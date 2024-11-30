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
  colorEnd: '#a86088',
}
const highlightVars = {
  colorEnd: `var(--fb-highlight-color-end, ${highlightDefaults.colorEnd})`,
}

export class Effect9 {
  split: SplitText
  originalChars: HTMLElement[] = []
  duplicateChars: HTMLElement[] = []

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
    if (!this.split.chars) return

    for (const char of this.split.chars) {
      const original = document.createElement('div')
      const duplicate = document.createElement('div')

      original.innerHTML = char.innerHTML
      duplicate.innerHTML = char.innerHTML
      char.innerHTML = ''

      original.style.color =
        this.options.highlightColorEnd || highlightVars.colorEnd

      duplicate.style.position = 'absolute'
      duplicate.style.inset = '0'
      duplicate.style.pointerEvents = 'none'
      duplicate.style.userSelect = 'none'

      char.style.position = 'relative'

      char.append(original, duplicate)
      this.originalChars.push(original)
      this.duplicateChars.push(duplicate)
    }
  }

  play() {
    if (!this.split.chars) return

    const rotations = Array.from(this.split.chars, () =>
      this.gsap.utils.random(-45, 45)
    )

    const timeline = this.gsap
      .timeline({
        defaults: {
          stagger: (idx) => 0.06 * (idx + 1),
        },
      })
      .timeScale(this.options.speedFactor)

    timeline.fromTo(
      this.originalChars,
      {
        opacity: 0,
        rotation: (idx) => rotations[idx],
        yPercent: 80,
      },
      {
        opacity: 1,
        rotation: 0,
        yPercent: 0,

        duration: 0.2,
        ease: 'sine',
      }
    )
    timeline.to(
      this.duplicateChars,
      {
        opacity: 0,
        rotation: (idx) => -1 * rotations[idx],
        scale: this.gsap.utils.random(1, 2),
        xPercent: this.gsap.utils.random(-15, 15),
        yPercent: this.gsap.utils.random(-130, -50),

        duration: 1,
        ease: 'expo',
      },
      0
    )
  }

  reset() {
    this.gsap.killTweensOf([this.originalChars, this.duplicateChars])
    this.gsap.set(this.originalChars, {
      opacity: 0,
      rotation: 0,
      yPercent: 0,
    })
    this.gsap.set(this.duplicateChars, {
      opacity: 1,
      rotation: 0,
      scale: 1,
      xPercent: 0,
      yPercent: 0,
    })
  }
}
