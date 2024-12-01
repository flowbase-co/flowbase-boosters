/* CSS Variables:
  --fb-highlight-bg-color
  --fb-highlight-bg-inset
  --fb-highlight-shadow-color
*/

import { colord } from 'colord'

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
  highlightShadowColor?: string
}

const highlightDefaults = {
  bgColor: '#6dd7e6',
  bgInset: '0 -4px',
  shadowColor: '#ffdbf5',
}
const highlightVars = {
  bgColor: `var(--fb-highlight-bg-color, ${highlightDefaults.bgColor})`,
  bgInset: `var(--fb-highlight-bg-inset, ${highlightDefaults.bgInset})`,
  shadowColor: `var(--fb-highlight-shadow-color, ${highlightDefaults.shadowColor})`,
}

export class Effect12 {
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
    this.bgEl.style.width = '0%'
    this.bgEl.style.height = 'auto'
    this.bgEl.style.mixBlendMode = 'plus-lighter'

    let bgColor = this.options.highlightBgColor

    if (!bgColor) {
      this.bgEl.style.backgroundColor = highlightVars.bgColor
      bgColor = getComputedStyle(this.bgEl).getPropertyValue('background-color')
    }

    this.bgEl.style.backgroundColor = colord(bgColor).alpha(0.14).toRgbString()

    const bgElLeft = document.createElement('div')

    bgElLeft.style.position = 'absolute'
    bgElLeft.style.display = 'flex'
    bgElLeft.style.flexDirection = 'column'
    bgElLeft.style.alignItems = 'center'

    const bgElRight = bgElLeft.cloneNode(true) as HTMLElement

    bgElLeft.style.top = '-7px'
    bgElLeft.style.bottom = '0'
    bgElLeft.style.left = '0'
    bgElLeft.style.transform = 'translateX(-50%)'

    bgElRight.style.top = '0'
    bgElRight.style.bottom = '-7px'
    bgElRight.style.right = '0'
    bgElRight.style.transform = 'translateX(50%)'

    const bgElDot = document.createElement('div')
    const bgElLine = document.createElement('div')

    bgElDot.style.flexShrink = '0'
    bgElDot.style.width = '8px'
    bgElDot.style.height = '8px'
    bgElDot.style.borderRadius = '100%'
    bgElDot.style.backgroundColor =
      this.options.highlightBgColor || highlightVars.bgColor

    bgElLine.style.width = '1px'
    bgElLine.style.height = '100%'
    bgElLine.style.backgroundColor =
      this.options.highlightBgColor || highlightVars.bgColor

    bgElLeft.append(
      bgElDot.cloneNode(true) as HTMLElement,
      bgElLine.cloneNode(true) as HTMLElement
    )
    bgElRight.append(
      bgElLine.cloneNode(true) as HTMLElement,
      bgElDot.cloneNode(true) as HTMLElement
    )

    this.bgEl.append(bgElLeft, bgElRight)
  }

  play() {
    this.gsap
      .timeline()
      .timeScale(this.options.speedFactor)
      .to(this.split.chars, {
        startAt: {
          filter: `drop-shadow(0px 0px 0px ${this.options.highlightShadowColor || highlightVars.shadowColor})`,
        },

        filter: `drop-shadow(0px 0px 20px ${this.options.highlightShadowColor || highlightVars.shadowColor})`,

        duration: 0.4,
        ease: 'power1.inOut',
        stagger: 0.03,
      })
      .fromTo(
        this.bgEl,
        {
          width: '0%',
          willChange: 'width',
        },
        {
          width: 'auto',

          duration: 0.8,
          ease: 'expo',
        },
        '<'
      )
  }

  reset() {
    this.gsap.killTweensOf([this.split.chars, this.bgEl])
    this.gsap.set(this.split.chars, { clearProps: 'filter' })
    this.gsap.set(this.bgEl, { width: '0%' })
  }
}
