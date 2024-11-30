import SplitText from '@flowbase-co/split-text'

import { initScrollTriggerConfig } from '../scroll-trigger'

import type { TextHighlightDirection } from '../types'

type Options = {
  offset: number
  speedFactor: number
  direction: TextHighlightDirection
  once: boolean
  highlightColors: string[]
}

const highlightDefaults = {
  colors: ['#ff0000'],
}

export class Effect10 {
  split: SplitText
  colors = highlightDefaults.colors

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
    if (this.options.highlightColors.length) {
      this.colors = this.options.highlightColors
    }
  }

  play() {
    const timeline = this.gsap.timeline().timeScale(this.options.speedFactor)

    this.split.chars?.forEach((char) => {
      const color = this.gsap.utils.random(this.colors)

      timeline.fromTo(
        char,
        {
          filter: `brightness(100%) drop-shadow(0 0 0 ${color})`,
          willChange: 'filter',
        },
        {
          filter: `brightness(300%) drop-shadow(0 0 50px ${color})`,

          delay: this.gsap.utils.random(0, 1),
          duration: 0.2,
          ease: 'power2.in',
          immediateRender: false,
          repeat: 1,
          yoyo: true,

          onComplete: () => {
            this.gsap.set(char, { clearProps: 'filter' })
          },
        },
        0
      )
    })
  }

  reset() {
    this.gsap.killTweensOf(this.split.chars)
    this.gsap.set(this.split.chars, { clearProps: 'filter' })
  }
}
