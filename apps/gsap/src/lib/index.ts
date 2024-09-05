import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

import Booster from '@flowbase-co/booster'

// TODO: test reject
// setTimeout(() => {
Booster.Dependencies.init().register({
  name: 'gsap',
  version: '3.12',
  get() {
    gsap.registerPlugin(ScrollTrigger)

    return gsap
  },
})
// }, 5000)
