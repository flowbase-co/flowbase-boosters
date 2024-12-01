import SplitText from '@flowbase-co/split-text'

type Options = {
  offset: number
}

export class Effect2 {
  split: SplitText

  constructor(
    protected target: HTMLElement,
    protected gsap: GSAP,
    protected options: Options
  ) {
    this.split = new SplitText(this.target, {
      split: 'words,chars',
    })

    if (!this.split.chars) return

    this.play()
  }

  play() {
    this.gsap.fromTo(
      this.split.chars,
      {
        filter: 'blur(10px) brightness(30%)',
        willChange: 'filter',
      },
      {
        filter: 'blur(0px) brightness(100%)',

        ease: 'none',
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
