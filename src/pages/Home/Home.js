import React from 'react'
import { FundsList, Hero } from '../../components'

function Home() {
  return (
    <div>
      <header>
        <Hero />
        <FundsList />
      </header>
    </div>  
  )
}

export default Home