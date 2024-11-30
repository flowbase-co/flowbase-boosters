import SplitText from '@flowbase-co/split-text'

import { initScrollTriggerConfig } from '../scroll-trigger'

import type { TextHighlightDirection } from '../types'

type Options = {
  offset: number
  speedFactor: number
  direction: TextHighlightDirection
  once: boolean
}

export class Effect1 {
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
    this.element.style.display = 'inline-block'

    this.gsap.set(this.element, { perspective: 500 })
    this.gsap.set(this.split.words, { transformStyle: 'preserve-3d' })
  }

  play() {
    this.gsap.timeline().timeScale(this.options.speedFactor).fromTo(
      this.split.chars,
      {
        opacity: 0,
        rotationX: -45,
        z: 300,
      },
      {
        opacity: 1,
        rotationX: 0,
        z: 0,

        duration: 0.8,
        ease: 'power2',
        stagger: 0.04,
      }
    )
  }

  reset() {
    this.split.chars?.forEach((char) => {
      this.gsap.killTweensOf(char)
      this.gsap.set(char, { clearProps: 'opacity,rotationX,z' })
    })
  }
}
