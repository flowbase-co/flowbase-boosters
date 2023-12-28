import Booster from '@flowbase-co/booster'

enum CookieAttrNames {
  Root = 'fb-cookie',
  Hide = 'fb-cookie-hide',
  Name = 'fb-cookie-name',
  Value = 'fb-cookie-value',
  Duration = 'fb-cookie-duration',
}

type CookieAttributes = {
  [CookieAttrNames.Name]: string
  [CookieAttrNames.Value]: string
  [CookieAttrNames.Duration]: number
}

const cookieBooster = new Booster.Booster<CookieAttributes, Element>({
  name: CookieAttrNames.Root,
  attributes: {
    [CookieAttrNames.Name]: {
      defaultValue: 'cookie_consent',
    },
    [CookieAttrNames.Value]: {
      defaultValue: 'accepted',
    },
    [CookieAttrNames.Duration]: {
      defaultValue: 182,
      validate: Booster.validation.isNumber,
      parse: Number,
    },
  },
  apply(element, data) {
    const cookieElement = element as HTMLElement

    cookieElement.style.display = 'none'

    const hideElements = element.querySelectorAll(`[${CookieAttrNames.Hide}]`)

    if (!hideElements.length) return this.log('Required attribute is missing')

    const cookieName = data.get(CookieAttrNames.Name)
    const cookieValue = data.get(CookieAttrNames.Value)
    const cookieDuration = data.get(CookieAttrNames.Duration)

    if (!cookieName || !cookieValue || !cookieDuration) {
      return this.log('Required attribute is missing')
    }

    const setCookie = () => {
      const durationDaysInSeconds = cookieDuration * 24 * 60 * 60

      document.cookie = `${cookieName}=${cookieValue}; max-age=${durationDaysInSeconds};`
    }
    const onHide = () => {
      setCookie()
      removeElement()
    }

    const showElement = () => {
      cookieElement.style.display = 'block'
      hideElements.forEach((el) => el.addEventListener('click', onHide))
    }
    const removeElement = () => {
      cookieElement.remove()
      hideElements.forEach((el) => el.removeEventListener('click', onHide))
    }

    document.cookie?.includes(`${cookieName}=${cookieValue}`)
      ? removeElement()
      : showElement()
  },
  title: 'Cookies Booster',
  documentationLink: 'https://www.flowbase.co/booster/cookies',
})

export const CookieFlowbase = () => cookieBooster.init()
