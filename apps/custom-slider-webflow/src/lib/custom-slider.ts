import Booster, { BoosterBase } from '@flowbase-co/booster'

enum CustomSliderAttrNames {
  Root = 'fb-slider',
  Arrow = 'fb-slider-arrow',
  NavItem = 'fb-slider-nav',
}

enum SliderArrow {
  Left = 'left',
  Right = 'right',
}

enum SliderNav {
  Active = 'active',
  Inactive = 'inactive',
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
  const inactiveItemEl = element.querySelector<HTMLElement>(
    `[${CustomSliderAttrNames.NavItem}=${SliderNav.Inactive}]`
  )

  if (!inactiveItemEl) return this.log(`Inactive Nav Element isn't detected`)

  const activeItemEl = element.querySelector<HTMLElement>(
    `[${CustomSliderAttrNames.NavItem}=${SliderNav.Active}]`
  )

  if (!activeItemEl) return this.log(`Active Nav Element isn't detected`)

  activeItemEl.remove()

  const webflowNavItems = Array.from(
    element.querySelectorAll<HTMLElement>('.w-slider-nav .w-slider-dot')
  )

  if (!webflowNavItems.length) {
    return this.log(`Webflow Slider Nav isn't detected`)
  }

  const attrsToCopy = ['aria-label', 'aria-pressed', 'role', 'tabindex']
  const copyNavItemAttrs = (
    webflowNavItem: HTMLElement,
    customNavItem: HTMLElement
  ) => {
    for (const attr of attrsToCopy) {
      const wfAttr = webflowNavItem.attributes.getNamedItem(attr)

      if (wfAttr) customNavItem.setAttribute(wfAttr.name, wfAttr.value)
    }
  }

  const onClickCustomNavItem = (idx: number) => webflowNavItems[idx].click()

  const customNavItems: HTMLElement[] = [inactiveItemEl]

  for (let idx = 0; idx < webflowNavItems.length; idx++) {
    const customNavItem = inactiveItemEl.cloneNode(true) as HTMLElement

    copyNavItemAttrs(webflowNavItems[idx], customNavItem)
    customNavItem.addEventListener('click', () => onClickCustomNavItem(idx))

    customNavItems[idx]?.insertAdjacentElement('afterend', customNavItem)
    customNavItems.push(customNavItem)
  }

  inactiveItemEl.remove()
  customNavItems.shift()

  let prevActiveWebflowNavItemIdx = -1
  let prevActiveWebflowNavItemEl: HTMLElement

  const changeActiveNavItem = () => {
    if (prevActiveWebflowNavItemIdx !== -1) {
      customNavItems[prevActiveWebflowNavItemIdx].replaceWith(
        prevActiveWebflowNavItemEl
      )
      customNavItems[prevActiveWebflowNavItemIdx] = prevActiveWebflowNavItemEl
    }

    const activeWebflowNavItem = webflowNavItems.find((el) =>
      el.classList.contains('w-active')
    )

    if (!activeWebflowNavItem) return

    const activeWebflowNavItemIdx =
      webflowNavItems.indexOf(activeWebflowNavItem)

    copyNavItemAttrs(activeWebflowNavItem, activeItemEl)

    prevActiveWebflowNavItemIdx = activeWebflowNavItemIdx
    prevActiveWebflowNavItemEl = customNavItems[activeWebflowNavItemIdx]

    customNavItems[activeWebflowNavItemIdx].replaceWith(activeItemEl)
    customNavItems[activeWebflowNavItemIdx] = activeItemEl
  }

  const observer = new MutationObserver(changeActiveNavItem)

  for (const item of webflowNavItems) {
    observer.observe(item, { attributeFilter: ['class'] })
  }

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
