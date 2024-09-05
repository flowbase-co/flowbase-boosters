/* CSS Variables:
  --fb-hover-color-end
*/

import SplitText from '@flowbase-co/split-text'

type Options = {
  speedFactor: number
  hoverColorEnd?: string
}

const hoverDefaults = {
  colorEnd: 'currentColor',
}
const hoverVars = {
  colorEnd: `var(--fb-hover-color-end, ${hoverDefaults.colorEnd})`,
}

export class Effect1 {
  split: SplitText
  originalChars: HTMLElement[] = []
  duplicateChars: HTMLElement[] = []
  animation: GSAPTimeline | undefined

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
    this.initAnimation()

    const onEnter = () => this.animation?.play()
    const onLeave = () => this.animation?.reverse()

    this.element.addEventListener('mouseenter', onEnter, { passive: true })
    this.element.addEventListener('mouseleave', onLeave, { passive: true })

    this.element.addEventListener('touchstart', onEnter, { passive: true })
    this.element.addEventListener('touchend', onLeave, { passive: true })
    this.element.addEventListener('touchcancel', onLeave, { passive: true })
  }

  setup() {
    if (!this.split.chars) return

    for (const char of this.split.chars) {
      const original = document.createElement('div')
      const duplicate = document.createElement('div')

      original.innerHTML = char.innerHTML
      duplicate.innerHTML = char.innerHTML
      char.innerHTML = ''

      duplicate.style.position = 'absolute'
      duplicate.style.inset = '0'
      duplicate.style.color = this.options.hoverColorEnd || hoverVars.colorEnd

      char.style.position = 'relative'
      char.style.overflowY = 'hidden'
      char.style.verticalAlign = 'bottom'

      char.append(original, duplicate)
      this.originalChars.push(original)
      this.duplicateChars.push(duplicate)
    }
  }

  initAnimation() {
    this.animation = this.gsap
      .timeline({
        paused: true,
        defaults: {
          duration: 0.8,
          ease: 'power3.inOut',
          stagger: 0.03,
        },
      })
      .timeScale(this.options.speedFactor)
      .to(
        this.originalChars,
        {
          yPercent: -100,
        },
        0
      )
      .from(
        this.duplicateChars,
        {
          yPercent: 100,
        },
        0.1
      )
  }
}
