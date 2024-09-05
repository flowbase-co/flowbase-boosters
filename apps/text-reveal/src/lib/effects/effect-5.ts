import SplitText from '@flowbase-co/split-text'

type Options = {
  endColor: string
}

export class Effect5 {
  split: SplitText

  constructor(
    private target: HTMLElement,
    private gsap: GSAP,
    private options: Options
  ) {
    this.split = new SplitText(this.target, {
      split: 'chars',
    })

    this.init()
  }

  init() {
    if (!this.split.chars?.length) return

    this.gsap.to(this.split.chars, {
      color: this.options.endColor,
      duration: 0.5,
      stagger: 0.05,
      scrollTrigger: {
        trigger: this.target,
        start: 'top 80%',
        end: 'top 20%',
        scrub: true,
        // toggleActions: 'play play reverse reverse',
      },
    })
  }
}
