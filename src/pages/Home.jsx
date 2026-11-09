import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import ShuffleDeck from '../components/ShuffleDeck'
import Drops from '../components/Drops'

export default function Home({ onAdd }) {
  return (
    <>
      <Hero />
      <Marquee />
      <ShuffleDeck onAdd={onAdd} />
      <Drops onAdd={onAdd} />
    </>
  )
}
