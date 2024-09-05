import SplitText from '@flowbase-co/split-text'

type Options = {
  colors?: string[]
}

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

export class Effect4 {
  split: SplitText
  colors: string[]

  originalChars: string[] = []
  originalColors: string[] = []

  constructor(
    protected element: HTMLElement,
    protected gsap: GSAP,
    protected options: Options
  ) {
    this.colors = this.options.colors?.length
      ? this.options.colors
      : ['#6ac9ff', '#2dde68', '#def54f', '#fa7328']

    this.split = new SplitText(this.element, {
      split: 'words,chars',
    })

    if (!this.split.chars) return

    for (const char of this.split.chars) {
      this.originalChars.push(char.innerHTML)
      this.originalColors.push(getComputedStyle(char).color)
    }

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
  }

  play() {
    this.reset()

    this.split.chars?.forEach((char, idx) => {
      let initialHTML = char.innerHTML
      let initialColor = getComputedStyle(char).color

      this.gsap.fromTo(
        char,
        {
          opacity: 0,
          transformOrigin: '50% 0%',
        },
        {
          opacity: 1,
          innerHTML: () => {
            const randomChar =
              lettersAndSymbols[
                this.gsap.utils.random(0, lettersAndSymbols.length - 1, 1)
              ]
            const randomColor =
              this.colors[this.gsap.utils.random(0, this.colors.length - 1, 1)]

            this.gsap.set(char, { color: randomColor })

            return randomChar
          },

          delay: (idx + 1) * 0.08,
          duration: 0.03,
          ease: 'none',
          repeat: 3,
          repeatDelay: 0.1,
          repeatRefresh: true,

          onStart: () => {
            console.log('onComplete', initialHTML, initialColor)
          },
          onComplete: () => {
            console.log('onComplete', initialHTML, initialColor)
            this.gsap.set(char, {
              innerHTML: initialHTML,
              color: initialColor,
              delay: 0.03,
            })
          },
        }
      )
    })
  }

  reset() {
    this.split.chars?.forEach((char, idx) => {
      this.gsap.killTweensOf(char)
      char.innerHTML = this.originalChars[idx]
      char.style.color = this.originalColors[idx]
    })
  }
}
