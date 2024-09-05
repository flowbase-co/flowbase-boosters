import SplitText from '@flowbase-co/split-text'

export class Effect1 {
  split: SplitText

  constructor(
    private target: HTMLElement,
    private gsap: GSAP
  ) {
    this.split = new SplitText(this.target, {
      split: 'chars',
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
        ease: 'none', // TODELETE:
        filter: 'blur(0px) brightness(100%)',
        stagger: 0.05,
        scrollTrigger: {
          trigger: this.target,
          start: 'top bottom-=15%',
          end: 'bottom center+=15%',
          scrub: true,
          markers: true, // TODELETE:
        },
      }
    )
  }
}
