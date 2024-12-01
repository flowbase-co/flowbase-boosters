import SplitText from '@flowbase-co/split-text'

type Options = {
  offset: number
}

export class Effect4 {
  split: SplitText

  constructor(
    protected target: HTMLElement,
    protected gsap: GSAP,
    protected options: Options
  ) {
    this.split = new SplitText(this.target, {
      split: 'words',
    })

    if (!this.split.words) return

    this.play()
  }

  play() {
    this.gsap.fromTo(
      this.split.words,
      {
        filter: 'blur(8px)',
        opacity: 0,
        skewX: -20,
        willChange: 'filter, transform',
      },
      {
        filter: 'blur(0px)',
        opacity: 1,
        skewX: 0,

        ease: 'sine',
        stagger: 0.04,
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
