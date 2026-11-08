import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import Drops from '../components/Drops'

export default function Home({ onAdd }) {
  return (
    <>
      <Hero />
      <Marquee />
      <Drops onAdd={onAdd} />
    </>
  )
}
