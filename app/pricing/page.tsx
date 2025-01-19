import React from 'react'
import Header from './components/Header'
import PricingCards from './components/PriceCards/PricingCards'

const Pricing = () => {
  return (
    <section className="relative overflow-hidden" style={{ backgroundImage: "url('/img/banner/banner_bg.jpg')" }}>
      <Header/>
      <PricingCards/>
    </section>
  )
}

export default Pricing