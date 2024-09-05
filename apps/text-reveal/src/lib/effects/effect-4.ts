import SplitText from '@flowbase-co/split-text'

export class Effect4 {
  split: SplitText

  constructor(
    private target: HTMLElement,
    private gsap: GSAP
  ) {
    this.split = new SplitText(this.target, {
      split: 'words',
    })

    this.init()
  }

  init() {
    if (!this.split.words?.length) return

    this.gsap.fromTo(
      this.split.words,
      {
        filter: 'blur(8px)',
        opacity: 0,
        skewX: -20,
        willChange: 'filter, transform',
      },
      {
        ease: 'sine',
        filter: 'blur(0px)',
        opacity: 1,
        skewX: 0,
        stagger: 0.04,
        scrollTrigger: {
          trigger: this.target,
          start: 'top bottom-=15%',
          end: 'bottom center+=15%',
          scrub: true,
        },
      }
    )
  }
}
