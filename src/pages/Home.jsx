import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import ShuffleDeck from '../components/ShuffleDeck'
import Categories from '../components/Categories'
import Drops from '../components/Drops'

export default function Home({ onAdd }) {
  return (
    <>
      <Hero />
      <Marquee />
      <Categories />
      <ShuffleDeck onAdd={onAdd} />
      <Drops onAdd={onAdd} />
    </>
  )
}
