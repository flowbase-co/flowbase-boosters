/* CSS Variables:
  --fb-highlight-color-end
  --fb-highlight-shadow-color
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
  highlightShadowColor?: string
}

const highlightDefaults = {
  colorEnd: '#d686c1',
  shadowColor: '#ffdbf5',
}
const highlightVars = {
  colorEnd: `var(--fb-highlight-color-end, ${highlightDefaults.colorEnd})`,
  shadowColor: `var(--fb-highlight-shadow-color, ${highlightDefaults.shadowColor})`,
}

export class Effect3 {
  split: SplitText

  constructor(
    protected element: HTMLElement,
    protected gsap: GSAP,
    protected options: Options
  ) {
    this.split = new SplitText(this.element, {
      split: 'words,chars',
    })

    if (!this.split.chars) return

    this.init()
  }

  init() {
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

  play() {
    const animationDefaults = {
      duration: 0.5,
      ease: 'power1',
    }

    this.gsap
      .timeline({ defaults: animationDefaults })
      .timeScale(this.options.speedFactor)
      .set(this.split.chars, {
        willChange: 'color, filter, opacity, transform',
      })
      .to(this.split.chars, {
        opacity: 0,
        scale: 0.8,

        stagger: 0.06,
      })
      .to(
        this.split.chars,
        {
          startAt: {
            filter: `drop-shadow(0px 0px 0px ${this.options.highlightShadowColor || highlightVars.shadowColor})`,
          },

          color: this.options.highlightColorEnd || highlightVars.colorEnd,
          filter: `drop-shadow(0px 0px 20px ${this.options.highlightShadowColor || highlightVars.shadowColor})`,
          opacity: 1,
          scale: 1,

          stagger: 0.06,
        },
        animationDefaults.duration
      )
  }

  reset() {
    this.gsap.killTweensOf(this.split.chars)
    this.gsap.set(this.split.chars, {
      clearProps: 'color,filter,opacity,scale',
    })
  }
}
