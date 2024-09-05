/* CSS Variables:
  --fb-highlight-color-end
*/

import SplitText from '@flowbase-co/split-text'

import { initScrollTriggerConfig } from '../scroll-trigger'

import type { TextHighlightDirection } from '../types'

type Options = {
  offset: number
  speedFactor: number
  direction: TextHighlightDirection
  once: boolean
  highlightColorEnd?: string
}

const highlightDefaults = {
  colorEnd: '#c3c58c',
}
const highlightVars = {
  colorEnd: `var(--fb-highlight-color-end, ${highlightDefaults.colorEnd})`,
}

export class Effect8 {
  split: SplitText

  constructor(
    protected element: HTMLElement,
    protected gsap: GSAP,
    protected options: Options
  ) {
    this.split = new SplitText(this.element, {
      split: 'words',
    })

    if (!this.split.words) return

    this.init()
  }

  init() {
    this.setup()

    this.gsap.to(this.element, {
      scrollTrigger: initScrollTriggerConfig(
        {
          trigger: this.element,
          start: `${this.options.offset}% bottom`,
        },
        {
          direction: this.options.direction,
          once: this.options.once,
          play: () => this.play(),
          reset: () => this.reset(),
        }
      ),
    })
  }

  setup() {
    this.gsap.set(this.split.words, { transformOrigin: '0% 50%' })
  }

  play() {
    this.gsap
      .timeline()
      .timeScale(this.options.speedFactor)
      .fromTo(
        this.split.words,
        {
          opacity: 0,
          rotationZ: -30,
        },
        {
          color: this.options.highlightColorEnd || highlightVars.colorEnd,
          opacity: 1,
          rotationZ: 0,

          duration: 1.2,
          ease: 'elastic.out(0.7)',
          stagger: 0.2,
        }
      )
      .timeScale(this.options.speedFactor)
  }

  reset() {
    this.split.words?.forEach((word) => {
      this.gsap.killTweensOf(word)
      this.gsap.set(word, {
        opacity: 1,
        rotationZ: 0,
        clearProps: 'color',
      })
    })
  }
}
