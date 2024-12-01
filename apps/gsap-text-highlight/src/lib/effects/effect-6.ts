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
  bgColor: '#dc764c',
  bgInset: '-2px -8px',
  bgRadius: '8px',
}
const highlightVars = {
  bgColor: `var(--fb-highlight-bg-color, ${highlightDefaults.bgColor})`,
  bgInset: `var(--fb-highlight-bg-inset, ${highlightDefaults.bgInset})`,
  bgRadius: `var(--fb-highlight-bg-radius, ${highlightDefaults.bgRadius})`,
}

export class Effect6 {
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
    this.bgEl.style.width = '0%'
    this.bgEl.style.height = 'auto'
    this.bgEl.style.borderRadius =
      this.options.highlightBgRadius || highlightVars.bgRadius
    this.bgEl.style.backgroundColor =
      this.options.highlightBgColor || highlightVars.bgColor
  }

  play() {
    this.gsap
      .timeline({
        defaults: {
          duration: 0.1,
          ease: 'sine',
        },
      })
      .timeScale(this.options.speedFactor)
      .to(this.split.chars, {
        opacity: 0,

        stagger: (pos, _, arr) => 0.06 * (arr.length - 1 - pos),
      })
      .to(this.split.chars, {
        opacity: 1,

        stagger: (pos) => 0.2 + 0.05 * pos,
      })
      .fromTo(
        this.bgEl,
        {
          width: '0%',
          willChange: 'width',
        },
        {
          width: 'auto',

          duration: 1,
          ease: 'power4',
        },
        '<'
      )
  }

  reset() {
    this.gsap.killTweensOf([this.split.chars, this.bgEl])
    this.gsap.set(this.split.chars, { clearProps: 'opacity' })
    this.gsap.set(this.bgEl, { width: '0%' })
  }
}
