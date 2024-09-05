import SplitText from '@flowbase-co/split-text'

type Options = {
  offset: number
}

export class Effect3 {
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

    this.gsap.fromTo(
      this.split.chars,
      {
        filter: 'blur(10px) brightness(50%)',
        scaleX: 1.8,
        scaleY: 0.1,
        willChange: 'filter, transform',
      },
      {
        ease: 'none',
        filter: 'blur(0px) brightness(100%)',
        scaleX: 1,
        scaleY: 1,
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
