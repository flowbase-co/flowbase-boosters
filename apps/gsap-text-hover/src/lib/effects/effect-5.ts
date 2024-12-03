/* CSS Variables:
  --fb-hover-bg-color
  --fb-hover-bg-inset
*/

import { Effect3 } from './effect-3'

type Options = {
  speedFactor: number
  allowMultiLine: boolean
  hoverBgClass?: string
  hoverBgColor?: string
  hoverBgInset?: string
}

const hoverDefaults = {
  bgColor: 'rgba(229, 222, 204, 0.1)',
  bgInset: '-2px -4px',
}
const hoverVars = {
  bgColor: `var(--fb-hover-bg-color, ${hoverDefaults.bgColor})`,
  bgInset: `var(--fb-hover-bg-inset, ${hoverDefaults.bgInset})`,
}

export class Effect5 extends Effect3 {
  constructor(
    protected element: HTMLElement,
    protected gsap: GSAP,
    protected options: Options
  ) {
    super(element, gsap, options)
  }

  setup() {
    if (!this.split.chars) return

    this.originalChars = this.split.chars.map((char) => char.innerHTML)

    this.element.style.position = 'relative'
    this.element.style.display = 'inline-block'
    this.element.style.isolation = 'isolate'
    this.element.style.setProperty('--fb-bg-scale', '0')

    if (!this.options.allowMultiLine) this.element.style.whiteSpace = 'nowrap'

    this.addBgElement()
  }

  addBgElement() {
    const bgEl = document.createElement('div')

    if (this.options.hoverBgClass) bgEl.classList.add(this.options.hoverBgClass)

    this.element.appendChild(bgEl)

    bgEl.style.position = 'absolute'
    bgEl.style.inset = this.options.hoverBgInset || hoverVars.bgInset
    bgEl.style.zIndex = '-1'
    bgEl.style.width = 'auto'
    bgEl.style.height = 'auto'
    bgEl.style.transformOrigin = '50% 100%'
    bgEl.style.transform = 'scaleY(var(--fb-bg-scale))'
    bgEl.style.backgroundColor = this.options.hoverBgColor || hoverVars.bgColor
    bgEl.style.backdropFilter = 'blur(5px)'
  }
}
