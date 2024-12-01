/* CSS Variables:
  --fb-reveal-color-end
*/

import SplitText from '@flowbase-co/split-text'

type Options = {
  offset: number
  revealColorEnd?: string
}

const revealDefaults = {
  colorEnd: 'currentColor',
}
const revealVars = {
  colorEnd: `var(--fb-reveal-color-end, ${revealDefaults.colorEnd})`,
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

    if (!this.split.chars) return

    this.play()
  }

  play() {
    this.gsap.to(this.split.chars, {
      color: this.options.revealColorEnd || revealVars.colorEnd,

      duration: 0.5,
      stagger: 0.05,
      scrollTrigger: {
        trigger: this.target,
        start: `${this.options.offset}% bottom`,
        end: 'bottom bottom',
        scrub: 0.5,
      },
    })
  }
}
