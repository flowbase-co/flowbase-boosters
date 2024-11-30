import type { TextHighlightDirection } from './types'

interface ScrollTriggerOptions {
  direction: TextHighlightDirection
  once: boolean
  play: () => void
  reset: () => void
}

export const initScrollTriggerConfig = (
  config: Partial<ScrollTrigger.Vars>,
  options: ScrollTriggerOptions
) => {
  config.onEnter = () => options.play()

  if (options.once) {
    config.once = true
  } else {
    config.onLeaveBack = () => options.reset()

    if (options.direction === 'both') {
      config.onEnterBack = () => options.play()
      config.onLeave = () => options.reset()
    }
  }

  return config
}
