import SplitType, { type SplitTypeOptions } from 'split-type'

const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
) => {
  let timeout: ReturnType<typeof setTimeout> | undefined

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), delay)
  }
}

export default class SplitText {
  lines: HTMLElement[] | null = null
  words: HTMLElement[] | null = null
  chars: HTMLElement[] | null = null

  private prevTargetWidth?: number

  constructor(
    protected target: HTMLElement,
    protected options?: Partial<SplitTypeOptions>,
    protected resizeCallback?: () => void
  ) {
    if (!(target instanceof HTMLElement)) {
      throw new Error('Invalid target provided')
    }

    SplitType.setDefaults({
      lineClass: 'fb-line',
      wordClass: 'fb-word',
      charClass: 'fb-char',
    })

    this.split()

    if (
      this.options?.absolute ||
      this.options?.split?.includes('lines') ||
      this.resizeCallback
    ) {
      this.initResizeObserver()
    }
  }

  split() {
    const splitResult = new SplitType(this.target, this.options)

    this.lines = splitResult.lines
    this.words = splitResult.words
    this.chars = splitResult.chars
  }

  initResizeObserver() {
    const resizeObserver = new ResizeObserver(
      debounce(
        (entries: ResizeObserverEntry[]) => this.handleResize(entries),
        100
      )
    )

    resizeObserver.observe(this.target)
  }

  handleResize(entries: ResizeObserverEntry[]) {
    const [{ contentRect }] = entries
    const targetWidth = Math.floor(contentRect.width)

    if (this.prevTargetWidth && this.prevTargetWidth !== targetWidth) {
      if (
        this.options &&
        (this.options.absolute || /lines/.test(String(this.options.split)))
      ) {
        this.split()
      }

      if (this.resizeCallback) this.resizeCallback()
    }

    this.prevTargetWidth = targetWidth
  }
}
