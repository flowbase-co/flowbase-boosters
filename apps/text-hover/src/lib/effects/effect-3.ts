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

export class Effect3 {
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
    const onLeave = () => this.reverse()

    this.element.addEventListener('mouseenter', onEnter, { passive: true })
    this.element.addEventListener('mouseleave', onLeave, { passive: true })

    this.element.addEventListener('touchstart', onEnter, { passive: true })
    this.element.addEventListener('touchend', onLeave, { passive: true })
    this.element.addEventListener('touchcancel', onLeave, { passive: true })
  }

  applyStyles() {
    this.element.style.whiteSpace = 'nowrap'
    this.element.style.fontKerning = 'none'
    this.element.style.position = 'relative'
    this.element.style.setProperty('--anim', '0')

    const bgEl = document.createElement('div')

    // TODO: class via options
    bgEl.classList.add('effect-3-bg')

    bgEl.style.position = 'absolute'
    bgEl.style.inset = '0'
    bgEl.style.width = '100%'
    bgEl.style.height = '100%'
    bgEl.style.mixBlendMode = 'difference'
    bgEl.style.transformOrigin = '0 50%'
    bgEl.style.transform = 'scaleX(var(--anim))'

    this.element.appendChild(bgEl)

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

          delay: (idx + 1) * 0.06,
          duration: 0.03,
          repeat: 2,
          repeatDelay: 0.05,
          repeatRefresh: true,

          onComplete: () => {
            this.gsap.set(char, { innerHTML: initialHTML, delay: 0.1 })
          },
        }
      )
    })

    this.gsap.fromTo(
      this.element,
      {
        '--anim': 0,
      },
      {
        duration: 1,
        ease: 'expo',
        '--anim': 1,
      }
    )
  }

  reverse() {
    this.gsap.killTweensOf(this.element)
    this.gsap.to(this.element, {
      duration: 0.6,
      ease: 'power4',
      '--anim': 0,
    })
  }

  reset() {
    this.split.chars?.forEach((char, idx) => {
      this.gsap.killTweensOf(char)
      char.innerHTML = this.originalChars[idx]
    })

    this.gsap.killTweensOf(this.element)
    this.gsap.set(this.element, { '--anim': 0 })
  }
}
