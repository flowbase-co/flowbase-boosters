/* CSS Variables:
  --fb-highlight-color-end
*/

import SplitText from '@flowbase-co/split-text'

import { initScrollTriggerConfig } from '../scroll-trigger'

import type { TextHighlightDirection } from '../types'

type Options = {
  offset: number
  speedFactor: number
  direction: TextHighlightDirection
  once: boolean
  highlightDuplicates?: number
  highlightColorEnd?: string
}

const highlightDefaults = {
  duplicates: 8,
  colorEnd: '#fff',
}
const highlightVars = {
  colorEnd: `var(--fb-highlight-color-end, ${highlightDefaults.colorEnd})`,
}

export class Effect11 {
  split: SplitText

  constructor(
    protected element: HTMLElement,
    protected gsap: GSAP,
    protected options: Options
  ) {
    this.split = new SplitText(this.element, {
      split: 'words',
    })

    if (!this.split.words) return

    this.init()
  }

  init() {
    this.setup()

    this.gsap.to(this.element, {
      scrollTrigger: initScrollTriggerConfig(
        {
          trigger: this.element,
          start: `${this.options.offset}% bottom`,
        },
        {
          direction: this.options.direction,
          once: this.options.once,
          play: () => this.play(),
          reset: () => this.reset(),
        }
      ),
    })
  }

  setup() {
    if (!this.split.words) return

    for (const word of this.split.words) {
      word.style.position = 'relative'

      const clone = word.cloneNode(true) as HTMLElement

      clone.style.position = 'absolute'
      clone.style.top = '0'
      clone.style.left = '0'
      clone.style.opacity = '0'
      clone.style.pointerEvents = 'none'
      clone.style.userSelect = 'none'
      clone.style.color =
        this.options.highlightColorEnd || highlightVars.colorEnd

      for (
        let i = 0;
        i < (this.options.highlightDuplicates || highlightDefaults.duplicates);
        i++
      ) {
        word.appendChild(clone.cloneNode(true) as HTMLElement)
      }
    }
  }

  play() {
    const duplicateDuration = 0.15
    const animationDefaults = {
      duration:
        duplicateDuration *
        (this.options.highlightDuplicates || highlightDefaults.duplicates),
      ease: 'expo',
    }

    const timeline = this.gsap
      .timeline({ defaults: animationDefaults })
      .timeScale(this.options.speedFactor)

    this.split.words?.forEach((word) => {
      const clones = word.querySelectorAll('.fb-word')

      timeline
        .fromTo(
          clones,
          {
            opacity: 0,
            yPercent: 150,
          },
          {
            opacity: 1,
            yPercent: 0,

            stagger: duplicateDuration,
          },
          0
        )
        .to(
          clones,
          {
            opacity: 0,

            duration: 0.01,
            stagger: duplicateDuration,
          },
          animationDefaults.duration
        )
        .to(
          word,
          {
            color: this.options.highlightColorEnd || highlightVars.colorEnd,
          },
          animationDefaults.duration - duplicateDuration
        )
    })
  }

  reset() {
    this.split.words?.forEach((word) => {
      const clones = word.querySelectorAll('.fb-word')

      this.gsap.killTweensOf([clones, word])
      this.gsap.set(clones, { opacity: '0' })
      this.gsap.set(word, { clearProps: 'color' })
    })
  }
}
