/* CSS Variables:
  --fb-hover-bg-color
  --fb-hover-bg-inset
*/

import SplitText from '@flowbase-co/split-text'

type Options = {
  speedFactor: number
  allowMultiLine: boolean
  hoverBgClass?: string
  hoverBgColor?: string
  hoverBgInset?: string
}

const hoverDefaults = {
  bgColor: '#fff',
  bgInset: '-2px -4px',
}
const hoverVars = {
  bgColor: `var(--fb-hover-bg-color, ${hoverDefaults.bgColor})`,
  bgInset: `var(--fb-hover-bg-inset, ${hoverDefaults.bgInset})`,
}

const characters = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '!',
  '@',
  '#',
  '$',
  '%',
  '^',
  '&',
  '*',
  '-',
  '_',
  '+',
  '=',
  ';',
  ':',
  '<',
  '>',
  ',',
]

export class Effect3 {
  split: SplitText
  originalChars: string[] = []

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

    const onEnter = () => this.play()
    const onLeave = () => this.reverse()

    this.element.addEventListener('mouseenter', onEnter, { passive: true })
    this.element.addEventListener('mouseleave', onLeave, { passive: true })

    this.element.addEventListener('touchstart', onEnter, { passive: true })
    this.element.addEventListener('touchend', onLeave, { passive: true })
    this.element.addEventListener('touchcancel', onLeave, { passive: true })
  }

  setup() {
    if (!this.split.chars) return

    this.originalChars = this.split.chars.map((char) => char.innerHTML)

    this.element.style.position = 'relative'
    this.element.style.display = 'inline-block'
    this.element.style.setProperty('--fb-bg-scale', '0')

    if (!this.options.allowMultiLine) this.element.style.whiteSpace = 'nowrap'

    this.addBgElement()
  }

  addBgElement() {
    const bgEl = document.createElement('div')

    if (this.options.hoverBgClass) bgEl.classList.add(this.options.hoverBgClass)

    this.element.appendChild(bgEl)

    bgEl.style.position = 'absolute'
    bgEl.style.inset = this.options.hoverBgInset || hoverVars.bgInset
    bgEl.style.width = 'auto'
    bgEl.style.height = 'auto'
    bgEl.style.transformOrigin = '0% 50%'
    bgEl.style.transform = 'scaleX(var(--fb-bg-scale))'
    bgEl.style.backgroundColor = this.options.hoverBgColor || hoverVars.bgColor
    bgEl.style.mixBlendMode = 'difference'
  }

  play() {
    this.reset()

    this.split.chars?.forEach((char, idx) => {
      const initialHTML = char.innerHTML

      this.gsap
        .timeline({
          onComplete: () => {
            this.gsap.set(char, {
              innerHTML: initialHTML,
              delay: 0.1,
            })
          },
        })
        .timeScale(this.options.speedFactor)
        .fromTo(
          char,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            innerHTML: () => this.gsap.utils.random(characters),

            delay: (idx + 1) * 0.06,
            duration: 0.03,
            repeat: 2,
            repeatDelay: 0.05,
            repeatRefresh: true,
          }
        )
    })

    this.gsap
      .fromTo(
        this.element,
        {
          '--fb-bg-scale': 0,
        },
        {
          '--fb-bg-scale': 1,

          duration: 1,
          ease: 'expo',
        }
      )
      .timeScale(this.options.speedFactor)
  }

  reverse() {
    this.gsap.killTweensOf(this.element)
    this.gsap.to(this.element, {
      '--fb-bg-scale': 0,

      duration: 0.6,
      ease: 'power4',
    })
  }

  reset() {
    this.split.chars?.forEach((char, idx) => {
      this.gsap.killTweensOf(char)
      this.gsap.set(char, { innerHTML: this.originalChars[idx] })
    })

    this.gsap.killTweensOf(this.element)
    this.gsap.set(this.element, { '--fb-bg-scale': 0 })
  }
}
