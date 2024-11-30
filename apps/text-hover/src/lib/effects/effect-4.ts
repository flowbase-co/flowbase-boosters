import SplitText from '@flowbase-co/split-text'

type Options = {
  speedFactor: number
  hoverColors: string[]
}

const hoverDefaults = {
  colors: ['#6ac9ff', '#2dde68', '#def54f', '#fa7328'],
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

export class Effect4 {
  split: SplitText
  colors = hoverDefaults.colors
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

    if (this.options.hoverColors.length) this.colors = this.options.hoverColors

    for (const char of this.split.chars) this.originalChars.push(char.innerHTML)
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
              clearProps: 'color',
              delay: 0.03,
            })
          },
        })
        .timeScale(this.options.speedFactor)
        .fromTo(
          char,
          {
            opacity: 0,
            transformOrigin: '50% 0%',
          },
          {
            opacity: 1,
            innerHTML: () => {
              this.gsap.set(char, {
                color: this.gsap.utils.random(this.colors),
              })

              return this.gsap.utils.random(characters)
            },

            delay: (idx + 1) * 0.08,
            duration: 0.03,
            ease: 'none',
            repeat: 3,
            repeatDelay: 0.1,
            repeatRefresh: true,
          }
        )
    })
  }

  reset() {
    this.split.chars?.forEach((char, idx) => {
      this.gsap.killTweensOf(char)
      this.gsap.set(char, {
        innerHTML: this.originalChars[idx],
        clearProps: 'color',
      })
    })
  }
}
