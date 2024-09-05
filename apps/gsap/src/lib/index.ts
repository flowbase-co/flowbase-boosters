import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

import Booster from '@flowbase-co/booster'

Booster.Dependencies.init().register({
  name: 'gsap',
  version: '3.12.5',
  get() {
    gsap.registerPlugin(ScrollTrigger)

    return gsap
  },
})
