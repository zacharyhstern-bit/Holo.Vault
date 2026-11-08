// Holographic foil shader.
// The rainbow is driven by the card's world-space normal (i.e. its tilt), so
// pointer parallax physically "rolls" the foil exactly like a real holo.

export const holoVertex = /* glsl */ `
  uniform vec2 uSize;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vViewDir;

  void main() {
    vUv = position.xy / uSize + 0.5;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

export const holoFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform sampler2D uMask;
  uniform float uTime;
  uniform vec2  uPointer;
  uniform float uHover;
  uniform float uIntensity;
  uniform float uOpacity;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vViewDir;

  vec3 spectrum(float t) {
    // warm-biased cosine palette: ember → gold → teal → violet
    return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.18, 0.42)));
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec3 base = texture2D(uMap, vUv).rgb;
    float mask = texture2D(uMask, vUv).r;

    vec2 tilt = vNormalW.xy;
    float band = (vUv.x * 0.8 + vUv.y * 1.4)
               + tilt.x * 2.2 - tilt.y * 1.6
               + uTime * 0.03;
    vec3 holo = spectrum(band);

    // diffraction grating lines
    float lines = 0.5 + 0.5 * sin((vUv.x - vUv.y) * 220.0 + tilt.x * 18.0);
    lines = smoothstep(0.2, 1.0, lines);

    // cosmos sparkle
    vec2 cell = floor(vUv * vec2(110.0, 154.0));
    float rnd = hash(cell);
    float sparkle = step(0.982, rnd)
                  * pow(0.5 + 0.5 * sin(uTime * 2.4 + rnd * 60.0 + tilt.x * 30.0), 6.0);

    // specular glare that tracks the pointer
    vec2 gp = vec2(0.5) + uPointer * vec2(0.55, 0.45);
    float glare = exp(-pow(distance(vUv, gp) * 2.4, 2.0));

    // fresnel rim
    float fres = pow(1.0 - clamp(dot(vNormalW, vViewDir), 0.0, 1.0), 2.5);

    vec3 foil = holo * (0.6 + 0.4 * lines);
    float k = mask * uIntensity * (0.75 + 0.35 * uHover);
    vec3 col = mix(base, 1.0 - (1.0 - base) * (1.0 - foil * 0.85), k); // screen blend
    col += sparkle * mask * 1.2;
    col += glare * (0.12 + 0.28 * uHover) * vec3(1.0, 0.94, 0.86);
    col += fres * holo * 0.35;

    gl_FragColor = vec4(col, uOpacity);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`
