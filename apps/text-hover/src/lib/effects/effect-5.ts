import { Effect3 } from './effect-3'

type Options = {
  bgClass?: string
}

export class Effect5 extends Effect3 {
  constructor(
    protected element: HTMLElement,
    protected gsap: GSAP,
    protected options: Options
  ) {
    super(element, gsap, options)
  }

  applyStyles() {
    this.element.style.whiteSpace = 'nowrap'
    this.element.style.fontKerning = 'none'
    this.element.style.position = 'relative'
    this.element.style.zIndex = '0'
    this.element.style.setProperty('--anim', '0')

    const bgEl = document.createElement('div')

    if (this.options.bgClass) {
      bgEl.classList.add(this.options.bgClass)
    }

    this.element.appendChild(bgEl)

    bgEl.style.left =
      getComputedStyle(bgEl).left === 'auto'
        ? '-4px'
        : getComputedStyle(bgEl).left
    bgEl.style.right =
      getComputedStyle(bgEl).right !== 'auto'
        ? getComputedStyle(bgEl).right
        : '-4px'
    bgEl.style.top =
      getComputedStyle(bgEl).top !== 'auto'
        ? getComputedStyle(bgEl).top
        : '-2px'
    bgEl.style.bottom =
      getComputedStyle(bgEl).bottom !== 'auto'
        ? getComputedStyle(bgEl).bottom
        : '-2px'

    bgEl.style.position = 'absolute'
    bgEl.style.zIndex = '-1'
    bgEl.style.width = 'auto'
    bgEl.style.height = 'auto'
    bgEl.style.transformOrigin = '50% 100%'
    bgEl.style.transform = 'scaleY(var(--anim))'
    bgEl.style.backdropFilter = 'blur(5px)'

    bgEl.style.background =
      getComputedStyle(bgEl).backgroundColor !== 'rgba(0, 0, 0, 0)' &&
      getComputedStyle(bgEl).backgroundColor !== 'transparent'
        ? getComputedStyle(bgEl).backgroundColor
        : 'rgb(229 222 204 / 10%)'

    if (this.split.words) {
      for (const el of this.split.words) {
        el.style.whiteSpace = 'nowrap'
      }
    }
  }
}
