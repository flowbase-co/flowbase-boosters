/* CSS Variables:
  --fb-highlight-bg-color
  --fb-highlight-bg-inset
  --fb-highlight-bg-radius
*/

import SplitText from '@flowbase-co/split-text'

import { initScrollTriggerConfig } from '../scroll-trigger'

import type { TextHighlightDirection } from '../types'

type Options = {
  offset: number
  speedFactor: number
  direction: TextHighlightDirection
  once: boolean
  allowMultiLine: boolean
  highlightClass?: string
  highlightBgColor?: string
  highlightBgInset?: string
  highlightBgRadius?: string
}

const highlightDefaults = {
  bgColor: '#6a5ace',
  bgInset: '-2px -8px',
  bgRadius: '8px',
}
const highlightVars = {
  bgColor: `var(--fb-highlight-bg-color, ${highlightDefaults.bgColor})`,
  bgInset: `var(--fb-highlight-bg-inset, ${highlightDefaults.bgInset})`,
  bgRadius: `var(--fb-highlight-bg-radius, ${highlightDefaults.bgRadius})`,
}

export class Effect5 {
  split: SplitText
  bgEl: HTMLElement | null = null

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
    this.element.style.position = 'relative'
    this.element.style.display = 'inline-block'

    if (!this.options.allowMultiLine) this.element.style.whiteSpace = 'nowrap'

    this.addBgElement()
  }

  addBgElement() {
    this.bgEl = document.createElement('div')

    if (this.options.highlightClass) {
      this.bgEl.classList.add(this.options.highlightClass)
    }

    this.element.prepend(this.bgEl)

    this.bgEl.style.position = 'absolute'
    this.bgEl.style.inset =
      this.options.highlightBgInset || highlightVars.bgInset
    this.bgEl.style.zIndex = '-1'
    this.bgEl.style.width = 'auto'
    this.bgEl.style.height = 'auto'
    this.bgEl.style.borderRadius =
      this.options.highlightBgRadius || highlightVars.bgRadius
    this.bgEl.style.backgroundColor =
      this.options.highlightBgColor || highlightVars.bgColor
    this.bgEl.style.transform = 'scale(0)'
  }

  play() {
    this.gsap
      .timeline()
      .timeScale(this.options.speedFactor)
      .fromTo(
        this.split.chars,
        {
          opacity: 0,
          scale: 1.3,
        },
        {
          opacity: 1,
          scale: 1,

          duration: 0.4,
          ease: 'power1',
          stagger: (pos) => 0.1 + 0.05 * pos,
        }
      )
      .fromTo(
        this.bgEl,
        {
          scale: 0,
        },
        {
          scale: 1,

          duration: 0.8,
          ease: 'expo',
        },
        0
      )
  }

  reset() {
    this.split.chars?.forEach((char) => {
      this.gsap.killTweensOf(char)
      this.gsap.set(char, { clearProps: 'opacity,scale' })
    })

    this.gsap.killTweensOf(this.bgEl)
    this.gsap.set(this.bgEl, { scale: 0 })
  }
}
