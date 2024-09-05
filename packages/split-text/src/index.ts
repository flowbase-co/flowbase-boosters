import SplitType, {
  type SplitTypeOptions,
  type TargetElement,
} from 'split-type'

// TODELETE: https://gsap.com/docs/v3/Plugins/SplitText/
// TODO: responsive

export default class SplitText {
  lines: HTMLElement[] | null
  words: HTMLElement[] | null
  chars: HTMLElement[] | null

  constructor(target: TargetElement, options?: Partial<SplitTypeOptions>) {
    const modifiedOptions = {
      lineClass: 'fb-line',
      wordClass: 'fb-word',
      charClass: 'fb-char',
      ...options,
    }
    const splitResult = new SplitType(target, modifiedOptions)

    this.lines = splitResult.lines
    this.words = splitResult.words
    this.chars = splitResult.chars
  }
}
