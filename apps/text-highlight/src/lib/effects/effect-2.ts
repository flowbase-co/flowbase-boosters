import SplitText from '@flowbase-co/split-text'

import { initScrollTriggerConfig } from '../scroll-trigger'

import type { TextHighlightDirection } from '../types'

type Options = {
  offset: number
  speedFactor: number
  direction: TextHighlightDirection
  once: boolean
}

export class Effect2 {
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
    const timeline = this.gsap
      .timeline({
        defaults: {
          duration: 0.6,
          ease: 'power1',
        },
      })
      .timeScale(this.options.speedFactor)

    this.split.chars?.forEach((char, position) => {
      timeline
        .to(
          char,
          {
            opacity: 0,

            delay: position * 0.05,
            repeat: 2,
            yoyo: true,
          },
          0
        )
        .to(
          char,
          {
            opacity: 1,
          },
          '>'
        )
    })
  }

  reset() {
    this.gsap.killTweensOf(this.split.chars)
    this.gsap.set(this.split.chars, { clearProps: 'opacity' })
  }
}
