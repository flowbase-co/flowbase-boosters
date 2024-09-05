import SplitText from '@flowbase-co/split-text'

const lettersAndSymbols = [
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
    protected gsap: GSAP
  ) {
    this.split = new SplitText(this.element, {
      split: 'words,chars',
    })

    if (!this.split.chars) return

    this.originalChars = this.split.chars.map((char) => char.innerHTML)
    this.init()
  }

  init() {
    this.applyStyles()

    const onEnter = () => this.play()

    this.element.addEventListener('mouseenter', onEnter, { passive: true })
    this.element.addEventListener('touchstart', onEnter, { passive: true })
  }

  applyStyles() {
    this.element.style.fontKerning = 'none'

    if (this.split.words) {
      for (const el of this.split.words) {
        el.style.whiteSpace = 'nowrap'
      }
    }

    if (this.split.chars) {
      for (const char of this.split.chars) {
        const cursorEl = document.createElement('div')

        // TODO: class via options
        cursorEl.classList.add('effect-2-cursor')

        const wrapperEl = document.createElement('div')

        wrapperEl.innerHTML = char.innerHTML

        char.innerHTML = ''
        char.append(wrapperEl, cursorEl)

        char.style.position = 'relative'
        char.style.setProperty('--cursor-opacity', '0')

        cursorEl.style.position = 'absolute'
        cursorEl.style.top = '0'
        cursorEl.style.left = '0'
        cursorEl.style.width = '1ch'
        cursorEl.style.height = '100%'
        cursorEl.style.background =
          getComputedStyle(cursorEl).backgroundColor !== 'rgba(0, 0, 0, 0)' &&
          getComputedStyle(cursorEl).backgroundColor !== 'transparent'
            ? getComputedStyle(cursorEl).backgroundColor
            : 'currentColor'
        cursorEl.style.opacity = 'var(--cursor-opacity)'
      }
    }
  }

  play() {
    this.reset()

    this.split.chars?.forEach((ch, idx) => {
      const char = ch.firstChild as HTMLElement

      let initialHTML = char.innerHTML
      let repeatCount = 0

      this.gsap.fromTo(
        char,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          innerHTML: () =>
            lettersAndSymbols[
              this.gsap.utils.random(0, lettersAndSymbols.length - 1, 1)
            ],

          delay: (idx + 1) * 0.07,
          duration: 0.03,
          repeat: 3,
          repeatDelay: 0.04,
          repeatRefresh: true,

          onStart: () => {
            this.gsap.set(ch, { '--cursor-opacity': 1 })
          },
          onRepeat: () => {
            repeatCount++

            if (repeatCount === 1) {
              this.gsap.set(ch, { '--cursor-opacity': 0 })
            }
          },
          onComplete: () => {
            this.gsap.set(char, {
              innerHTML: initialHTML,
              delay: 0.03,
            })
          },
        }
      )
    })
  }

  reset() {
    this.split.chars?.forEach((ch, idx) => {
      const char = ch.firstChild as HTMLElement

      this.gsap.killTweensOf([ch, char])
      char.innerHTML = this.originalChars[idx]
      this.gsap.set(ch, { '--cursor-opacity': 0 })
    })
  }
}
