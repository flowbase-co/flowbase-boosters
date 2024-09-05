/* CSS Variables:
  --fb-hover-cursor-color
*/

import SplitText from '@flowbase-co/split-text'

type Options = {
  speedFactor: number
  hoverCursorClass?: string
  hoverCursorColor?: string
}

const hoverDefaults = {
  cursorColor: 'currentColor',
}
const hoverVars = {
  cursorColor: `var(--fb-hover-cursor-color, ${hoverDefaults.cursorColor})`,
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

export class Effect2 {
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

    this.element.addEventListener('mouseenter', onEnter, { passive: true })
    this.element.addEventListener('touchstart', onEnter, { passive: true })
  }

  setup() {
    if (!this.split.chars) return

    this.originalChars = this.split.chars.map((char) => char.innerHTML)

    for (const char of this.split.chars) {
      const wrapperEl = document.createElement('div')
      const cursorEl = document.createElement('div')

      if (this.options.hoverCursorClass) {
        cursorEl.classList.add(this.options.hoverCursorClass)
      }

      wrapperEl.innerHTML = char.innerHTML
      char.innerHTML = ''
      char.append(wrapperEl, cursorEl)

      char.style.position = 'relative'
      char.style.setProperty('--fb-cursor-opacity', '0')

      cursorEl.style.position = 'absolute'
      cursorEl.style.top = '0'
      cursorEl.style.left = '0'
      cursorEl.style.width = '1ch'
      cursorEl.style.height = '100%'
      cursorEl.style.backgroundColor =
        this.options.hoverCursorColor || hoverVars.cursorColor
      cursorEl.style.opacity = 'var(--fb-cursor-opacity)'
    }
  }

  play() {
    this.reset()

    this.split.chars?.forEach((charWr, idx) => {
      const char = charWr.firstChild as HTMLElement
      const initialHTML = char.innerHTML
      let repeatCount = 0

      this.gsap
        .timeline({
          onComplete: () => {
            this.gsap.set(charWr, { '--fb-cursor-opacity': 0 })
            this.gsap.set(char, {
              innerHTML: initialHTML,
              delay: 0.03,
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

            delay: (idx + 1) * 0.07,
            duration: 0.03,
            repeat: 3,
            repeatDelay: 0.04,
            repeatRefresh: true,

            onStart: () => {
              this.gsap.set(charWr, { '--fb-cursor-opacity': 1 })
            },
            onRepeat: () => {
              repeatCount++

              if (repeatCount === 1) {
                this.gsap.set(charWr, { '--fb-cursor-opacity': 0 })
              }
            },
          }
        )
    })
  }

  reset() {
    this.split.chars?.forEach((charWr, idx) => {
      const char = charWr.firstChild as HTMLElement

      this.gsap.killTweensOf(char)
      this.gsap.set(charWr, { '--fb-cursor-opacity': 0 })
      this.gsap.set(char, { innerHTML: this.originalChars[idx] })
    })
  }
}
