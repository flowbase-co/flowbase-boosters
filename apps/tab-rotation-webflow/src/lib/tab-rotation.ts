import Booster from '@flowbase-co/booster'

enum TabRotationAttrNames {
  Root = 'fb-tabs',
  Speed = 'fb-tabs-speed',
}

type TabRotationAttributes = {
  [TabRotationAttrNames.Speed]: number
}

const tabRotationBooster = new Booster.Booster<
  TabRotationAttributes,
  HTMLElement
>({
  name: TabRotationAttrNames.Root,
  attributes: {
    [TabRotationAttrNames.Speed]: {
      defaultValue: 5000,
      validate: Booster.validation.isNumber,
      parse: Number,
    },
  },
  apply(element, data) {
    const buttonElements = element.querySelectorAll<HTMLElement>('.w-tab-link')

    if (!buttonElements.length) return this.log('Required attribute is missing')

    const speed = data.get(TabRotationAttrNames.Speed)

    let timeout: ReturnType<typeof setTimeout>

    const rotateTab = () => {
      timeout = setTimeout(() => {
        let nextButtonIndex =
          Array.from(buttonElements).findIndex((el) =>
            el.classList.contains('w--current')
          ) + 1

        if (nextButtonIndex > buttonElements.length - 1) {
          nextButtonIndex = 0
        }

        buttonElements[nextButtonIndex]?.click()
      }, speed)
    }

    buttonElements.forEach((el) =>
      el.addEventListener('click', () => {
        clearTimeout(timeout)
        rotateTab()
      })
    )

    rotateTab()
  },
  title: 'Auto Tab Rotation Booster',
  documentationLink:
    'https://www.flowbase.co/booster/webflow-auto-tab-rotation',
})

export const TabRotationFlowbase = () => tabRotationBooster.init()
