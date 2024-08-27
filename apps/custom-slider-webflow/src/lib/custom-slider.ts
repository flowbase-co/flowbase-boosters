import Booster, { BoosterBase } from '@flowbase-co/booster'

enum CustomSliderAttrNames {
  Root = 'fb-slider',
  Arrow = 'fb-slider-arrow',
  NavItem = 'fb-slider-nav-item',
}

enum SliderArrow {
  Left = 'left',
  Right = 'right',
}

function setupArrows(this: BoosterBase, element: HTMLElement) {
  const customArrowElements = Array.from(
    element.querySelectorAll<HTMLElement>(`[${CustomSliderAttrNames.Arrow}]`)
  )

  if (!customArrowElements.length) return

  const webflowLeftArrow = element.querySelector<HTMLElement>(
    '.w-slider-arrow-left'
  )
  const webflowRightArrow = element.querySelector<HTMLElement>(
    '.w-slider-arrow-right'
  )

  if (!webflowLeftArrow && !webflowRightArrow) {
    return this.log('Webflow Slider Arrows are not detected')
  }

  const leftArrows: HTMLElement[] = []
  const rightArrows: HTMLElement[] = []

  for (const arrowEl of customArrowElements) {
    const rawValue = arrowEl.getAttribute(CustomSliderAttrNames.Arrow)
    const attrValue = rawValue as SliderArrow

    if (Object.values(SliderArrow).includes(attrValue)) {
      if (attrValue === SliderArrow.Left) leftArrows.push(arrowEl)
      if (attrValue === SliderArrow.Right) rightArrows.push(arrowEl)
    } else {
      this.log(
        `Invalid value "${rawValue}" for attribute "${CustomSliderAttrNames.Arrow}"`,
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
    if (webflowLeftArrow) {
      webflowLeftArrow.style.display = 'none'

      for (const arrowEl of leftArrows) {
        arrowEl.addEventListener('click', () => webflowLeftArrow.click())
      }
    } else this.log(`Webflow Left Arrow isn't detected`)
  }
  if (rightArrows.length) {
    if (webflowRightArrow) {
      webflowRightArrow.style.display = 'none'

      for (const arrowEl of rightArrows) {
        arrowEl.addEventListener('click', () => webflowRightArrow.click())
      }
    } else this.log(`Webflow Right Arrow isn't detected`)
  }
}

function setupNavigation(this: BoosterBase, element: HTMLElement) {
  const customNavItems = Array.from(
    element.querySelectorAll<HTMLElement>(`[${CustomSliderAttrNames.NavItem}]`)
  )

  if (!customNavItems.length) return

  const webflowNavItems = Array.from(
    element.querySelectorAll<HTMLElement>('.w-slider-nav .w-slider-dot')
  )

  if (!webflowNavItems.length) {
    return this.log(`Webflow Slider Nav isn't detected`)
  }

  const NAV_ITEM_ACTIVE_CLASS = 'slider-nav-active'

  const onClickCustomNavItem = (event: MouseEvent) => {
    const itemIdx = customNavItems.findIndex((el) => el === event.target)

    webflowNavItems[itemIdx].click()
  }

  for (const item of customNavItems) {
    item.addEventListener('click', onClickCustomNavItem)
  }

  const attrsToCopy = ['aria-label', 'aria-pressed', 'role', 'tabindex']
  const copyNavItemAttrs = (
    webflowNavItem?: HTMLElement,
    customNavItem?: HTMLElement
  ) => {
    if (!webflowNavItem || !customNavItem) return

    for (const attr of attrsToCopy) {
      const wfAttr = webflowNavItem.attributes.getNamedItem(attr)

      if (wfAttr) customNavItem.setAttribute(wfAttr.name, wfAttr.value)
    }
  }

  const changeActiveNavItem = () => {
    const activeCustomNavItemIdx = customNavItems.findIndex((el) =>
      el.classList.contains(NAV_ITEM_ACTIVE_CLASS)
    )
    const activeWebflowNavItemIdx = webflowNavItems.findIndex((el) =>
      el.classList.contains('w-active')
    )

    if (activeCustomNavItemIdx === activeWebflowNavItemIdx) return

    const prevActiveCustomNavItem = customNavItems[activeCustomNavItemIdx]
    const newActiveCustomNavItem = customNavItems[activeWebflowNavItemIdx]

    if (prevActiveCustomNavItem) {
      prevActiveCustomNavItem.classList.remove(NAV_ITEM_ACTIVE_CLASS)
      copyNavItemAttrs(
        webflowNavItems[activeCustomNavItemIdx],
        prevActiveCustomNavItem
      )
    }
    if (newActiveCustomNavItem) {
      newActiveCustomNavItem.classList.add(NAV_ITEM_ACTIVE_CLASS)
      copyNavItemAttrs(
        webflowNavItems[activeWebflowNavItemIdx],
        newActiveCustomNavItem
      )
    }
  }

  const observer = new MutationObserver(changeActiveNavItem)

  webflowNavItems.forEach((item, idx) => {
    observer.observe(item, { attributeFilter: ['class'] })
    copyNavItemAttrs(webflowNavItems[idx], customNavItems[idx])
  })

  changeActiveNavItem()
}

const customSliderBooster = new Booster.Booster<{}, HTMLElement>({
  name: CustomSliderAttrNames.Root,
  attributes: {},
  apply(element) {
    setupArrows.call(this, element)
    setupNavigation.call(this, element)
  },
  title: 'Webflow Custom Slider Booster',
  documentationLink: 'https://www.flowbase.co/booster/webflow-custom-slider',
})

export const CustomSliderFlowbase = () => customSliderBooster.init()
