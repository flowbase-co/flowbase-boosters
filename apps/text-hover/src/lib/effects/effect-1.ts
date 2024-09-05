import SplitText from '@flowbase-co/split-text'

export class Effect1 {
  constructor(
    protected element: HTMLElement,
    protected gsap: GSAP
  ) {
    this.init()
  }

  init() {
    this.element.style.fontKerning = 'none'
    this.element.style.whiteSpace = 'nowrap'

    const initialChildNodes = document.createElement('div')

    initialChildNodes.append(
      ...Array.from(this.element.childNodes).map((node) => node.cloneNode(true))
    )

    this.element.innerHTML = ''

    const additionalChildNodes = initialChildNodes.cloneNode(
      true
    ) as HTMLElement

    additionalChildNodes.style.position = 'absolute'
    additionalChildNodes.style.inset = '0'

    const wrapper = document.createElement('div')

    wrapper.style.fontKerning = 'none'
    wrapper.style.position = 'relative'
    wrapper.style.display = 'inline-flex'
    wrapper.style.overflowY = 'hidden'

    wrapper.appendChild(initialChildNodes)
    wrapper.appendChild(additionalChildNodes)
    this.element.appendChild(wrapper)

    const initialTextChars = new SplitText(initialChildNodes, {
      split: 'chars',
    }).chars
    const hoverTextChars = new SplitText(additionalChildNodes, {
      split: 'chars',
    }).chars

    if (!initialTextChars?.length || !hoverTextChars?.length) return

    const timeline = this.gsap
      .timeline({
        defaults: {
          duration: 0.8,
          ease: 'power3.inOut',
          stagger: 0.03,
        },
        paused: true,
      })
      .to(initialTextChars, {
        yPercent: -100,
      })
      .from(
        hoverTextChars,
        {
          yPercent: 100,
        },
        '<0.1'
      )

    const onEnter = () => timeline.play()
    const onLeave = () => timeline.reverse()

    this.element.addEventListener('mouseenter', onEnter, { passive: true })
    this.element.addEventListener('mouseleave', onLeave, { passive: true })
    this.element.addEventListener('touchstart', onEnter, { passive: true })
    this.element.addEventListener('touchend', onLeave, { passive: true })
    this.element.addEventListener('touchcancel', onLeave, { passive: true })
  }
}
