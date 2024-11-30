import Booster from '@flowbase-co/booster'

enum PasswordVisibilityControlAttrNames {
  Root = 'fb-password',
  Toggle = 'fb-password-toggle',
  State = 'fb-password-state',
}

enum PasswordVisibilityState {
  Visible = 'visible',
  Hidden = 'hidden',
}

const passwordVisibilityControlBooster = new Booster.Booster<{}, HTMLElement>({
  name: PasswordVisibilityControlAttrNames.Root,
  attributes: {},
  apply(element) {
    const input = element.getElementsByTagName('input')[0]

    if (!input) return this.log('Input element is missing')

    const toggles = Array.from(
      element.querySelectorAll<HTMLElement>(
        `[${PasswordVisibilityControlAttrNames.Toggle}]`
      )
    )

    if (!toggles.length)
      return this.log(
        `Required attribute "${PasswordVisibilityControlAttrNames.Toggle}" is missing`
      )

    const stateElements = Array.from(
      element.querySelectorAll<HTMLElement>(
        `[${PasswordVisibilityControlAttrNames.State}]`
      )
    )

    const visibleStateElements: HTMLElement[] = []
    const hiddenStateElements: HTMLElement[] = []

    for (const stateEl of stateElements) {
      const rawValue = stateEl.getAttribute(
        PasswordVisibilityControlAttrNames.State
      )
      const attrValue = rawValue as PasswordVisibilityState

      if (Object.values(PasswordVisibilityState).includes(attrValue)) {
        if (attrValue === PasswordVisibilityState.Visible) {
          visibleStateElements.push(stateEl)
        }
        if (attrValue === PasswordVisibilityState.Hidden) {
          hiddenStateElements.push(stateEl)
        }
      } else {
        this.log(
          `Invalid value "${rawValue}" for attribute "${PasswordVisibilityControlAttrNames.State}"`,
          [
            '%cPossible values:%c\n' +
              Object.values(PasswordVisibilityState)
                .map((value) => `• ${value}`)
                .join('\n'),
            'font-weight: 700;',
            'font-weight: initial;',
          ]
        )
      }
    }

    const updateStateElements = () => {
      for (const el of visibleStateElements) {
        el.style.display = input.type === 'text' ? 'block' : 'none'
      }
      for (const el of hiddenStateElements) {
        el.style.display = input.type === 'text' ? 'none' : 'block'
      }
    }

    const togglePasswordVisibility = () => {
      input.type = input.type === 'text' ? 'password' : 'text'
      updateStateElements()
    }

    for (const toggle of toggles) {
      toggle.addEventListener('click', togglePasswordVisibility)
    }

    updateStateElements()
  },
  title: 'Password Visibility Control Booster',
  documentationLink: 'https://www.flowbase.co/booster/show-and-hide-password',
})

export const PasswordVisibilityControlFlowbase = () =>
  passwordVisibilityControlBooster.init()
