import SplitText from '@flowbase-co/split-text'

type Options = {
  offset: number
}

export class Effect1 {
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
    if (!this.split.chars) return

    this.gsap.fromTo(
      this.split.chars,
      {
        filter: 'blur(10px) brightness(0%)',
        willChange: 'filter',
      },
      {
        ease: 'none',
        filter: 'blur(0px) brightness(100%)',
        stagger: 0.05,
        scrollTrigger: {
          trigger: this.target,
          start: `${this.options.offset}% bottom`,
          end: 'bottom bottom',
          scrub: 0.5,
        },
      }
    )
  }
}
