import Booster from '@flowbase-co/booster'

enum SliderArrowsAttrNames {
  Root = 'fb-slider',
  Arrow = 'fb-slider-arrow',
}

enum SliderArrow {
  Left = 'left',
  Right = 'right',
}

const sliderArrowsBooster = new Booster.Booster<{}, Element>({
  name: SliderArrowsAttrNames.Root,
  attributes: {},
  apply(element) {
    const webflowLeftArrow = element.querySelector<HTMLElement>(
      '.w-slider-arrow-left'
    )
    const webflowRightArrow = element.querySelector<HTMLElement>(
      '.w-slider-arrow-right'
    )

    if (!webflowLeftArrow || !webflowRightArrow) return

    const arrowElements = element.querySelectorAll(
      `[${SliderArrowsAttrNames.Arrow}]`
    )

    if (!arrowElements.length) return this.log('Required attribute is missing')

    const leftArrows = []
    const rightArrows = []

    for (const arrowEl of Array.from(arrowElements)) {
      const rawValue = arrowEl.getAttribute(SliderArrowsAttrNames.Arrow)
      const attrValue = rawValue as SliderArrow

      if (Object.values(SliderArrow).includes(attrValue)) {
        if (attrValue === SliderArrow.Left) leftArrows.push(arrowEl)
        if (attrValue === SliderArrow.Right) rightArrows.push(arrowEl)
      } else {
        this.log(
          `Invalid value "${rawValue}" for attribute "${SliderArrowsAttrNames.Arrow}"`,
          [
            '%cPossible values:%c\n' +
              Object.values(SliderArrow)
                .map((value) => `• ${value}`)
                .join('\n'),
            'font-weight: 700;',
            'font-weight: initial;',
          ]
        )
      }
    }

    if (leftArrows.length) {
      webflowLeftArrow.style.display = 'none'

      leftArrows.forEach((arrowEl) =>
        arrowEl.addEventListener('click', () => webflowLeftArrow.click())
      )
    }
    if (rightArrows.length) {
      webflowRightArrow.style.display = 'none'

      rightArrows.forEach((arrowEl) =>
        arrowEl.addEventListener('click', () => webflowRightArrow.click())
      )
    }
  },
  title: 'Webflow Custom Slider Arrows Booster',
  documentationLink: 'https://www.flowbase.co/booster/webflow-slider-arrows',
})

export const SliderArrowsFlowbase = () => sliderArrowsBooster.init()
