/* CSS Variables:
  --fb-highlight-color-end
  --fb-highlight-color-end-alt
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
  highlightColorEndAlt?: string
}

const highlightDefaults = {
  colorEnd: '#49af42',
  colorEndAlt: '#4252af',
}
const highlightVars = {
  colorEnd: `var(--fb-highlight-color-end, ${highlightDefaults.colorEnd})`,
  colorEndAlt: `var(--fb-highlight-color-end-alt, ${highlightDefaults.colorEndAlt})`,
}

export class Effect4 {
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
      duration: 0.3,
      ease: 'power3.in',
    }

    this.gsap
      .timeline({ defaults: animationDefaults })
      .timeScale(this.options.speedFactor)
      .set(this.split.chars, { willChange: 'color, opacity, transform' })
      .to(this.split.chars, {
        color: this.options.highlightColorEnd || highlightVars.colorEnd,
        scale: 1.45,

        stagger: 0.05,
      })
      .to(
        this.split.chars,
        {
          color: this.options.highlightColorEndAlt || highlightVars.colorEndAlt,
          scale: 1,

          duration: 0.4,
          ease: 'sine',
          stagger: 0.05,
        },
        animationDefaults.duration
      )
  }

  reset() {
    this.gsap.killTweensOf(this.split.chars)
    this.gsap.set(this.split.chars, { clearProps: 'color,scale' })
  }
}
