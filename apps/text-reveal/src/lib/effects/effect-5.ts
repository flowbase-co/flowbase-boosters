import SplitText from '@flowbase-co/split-text'

type Options = {
  offset: number
  endColor?: string
}

export class Effect5 {
  split: SplitText

  constructor(
    protected target: HTMLElement,
    protected gsap: GSAP,
    protected options: Options
  ) {
    this.split = new SplitText(this.target, {
      split: 'words,chars',
    })

    this.init()
  }

  init() {
    if (!this.split.chars?.length) return

    this.gsap.to(this.split.chars, {
      color: this.options.endColor || 'currentColor',
      duration: 0.5,
      stagger: 0.05,
      scrollTrigger: {
        trigger: this.target,
        start: `${this.options.offset}% bottom`,
        end: 'bottom bottom',
        scrub: 0.5,
        toggleActions: 'play play reverse reverse',
      },
    })
  }
}
