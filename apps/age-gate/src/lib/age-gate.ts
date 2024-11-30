import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

import Booster from '@flowbase-co/booster'

enum AgeGateAttrNames {
  Root = 'fb-age-gate',
  Type = 'fb-age-gate-type',
  MinimumAge = 'fb-age-gate-minimum',
  RedirectUrl = 'fb-age-gate-redirect',

  CookieName = 'fb-age-gate-cookie-name',
  CookieDuration = 'fb-age-gate-cookie-duration',

  Button = 'fb-age-gate-button',
  Field = 'fb-age-gate-field',
}

enum AgeGateType {
  Button = 'button',
  Date = 'date',
}

enum AgeGateButton {
  Enter = 'enter',
  Under = 'under',
  Over = 'over',
}

enum AgeGateField {
  Year = 'year',
  Month = 'month',
  Day = 'day',
}

type AgeGateAttributes = {
  [AgeGateAttrNames.Type]: AgeGateType
  [AgeGateAttrNames.MinimumAge]: number
  [AgeGateAttrNames.RedirectUrl]: string
  [AgeGateAttrNames.CookieName]: string
  [AgeGateAttrNames.CookieDuration]: number
}

const regexUrl = new RegExp(
  '^http(s)?://(www.)?[a-z0-9@%:_.+~#=-]{1,256}.[a-z]{2,6}([a-z0-9@%:_.+~#=?&/,-]*)$',
  'i'
)

const getCookieValueByName = (name: string) => {
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  )

  return matches?.[1]
}

const ageGateBooster = new Booster.Booster<AgeGateAttributes, HTMLElement>({
  name: AgeGateAttrNames.Root,
  attributes: {
    [AgeGateAttrNames.Type]: {
      defaultValue: AgeGateType.Button,
      validate: Object.values(AgeGateType),
    },
    [AgeGateAttrNames.MinimumAge]: {
      defaultValue: 18,
      validate: Booster.validation.isNumber,
      parse: Number,
    },
    [AgeGateAttrNames.RedirectUrl]: {
      defaultValue: 'https://google.com',
    },
    [AgeGateAttrNames.CookieName]: {
      defaultValue: 'age_gate',
    },
    [AgeGateAttrNames.CookieDuration]: {
      defaultValue: 0,
      validate: Booster.validation.isNumber,
      parse: Number,
    },
  },
  apply(element, data) {
    const showElement = () => (element.style.display = 'block')
    const removeElement = () => element.remove()

    const minAge = data.get(AgeGateAttrNames.MinimumAge)
    const cookieName = data.get(AgeGateAttrNames.CookieName)
    const cookieValue = Number(getCookieValueByName(cookieName))
    const cookieAge = !isNaN(cookieValue) ? cookieValue : undefined

    if (cookieAge && cookieAge >= minAge) {
      removeElement()
      return
    }

    showElement()

    const getRedirectUrl = (url: string) => {
      return url.match(regexUrl) ? url : window.location.origin + url
    }

    const cookieDuration = data.get(AgeGateAttrNames.CookieDuration)
    const redirectUrl = getRedirectUrl(data.get(AgeGateAttrNames.RedirectUrl))

    const setCookie = (value: number) => {
      let cookie = `${cookieName}=${value}; samesite=lax`

      if (cookieDuration) cookie += `; max-age=${cookieDuration};`

      document.cookie = cookie
    }
    const redirect = () => window.location.replace(redirectUrl)

    const type = data.get(AgeGateAttrNames.Type)

    if (type === AgeGateType.Button) {
      const buttonOver = element.querySelector(
        `[${AgeGateAttrNames.Button}=${AgeGateButton.Over}]`
      )

      if (!buttonOver) return this.log('Required attribute is missing')

      buttonOver.addEventListener('click', () => {
        setCookie(minAge)
        removeElement()
      })

      const buttonUnder = element.querySelector(
        `[${AgeGateAttrNames.Button}=${AgeGateButton.Under}]`
      )

      if (buttonUnder) buttonUnder.addEventListener('click', redirect)
    }

    if (type === AgeGateType.Date) {
      const fieldYear = element.querySelector(
        `[${AgeGateAttrNames.Field}=${AgeGateField.Year}]`
      )

      if (!fieldYear) return this.log('Required attribute is missing')

      const buttonEnter = element.querySelector(
        `[${AgeGateAttrNames.Button}=${AgeGateButton.Enter}]`
      )

      if (!buttonEnter) return this.log('Required attribute is missing')

      const fieldMonth = element.querySelector(
        `[${AgeGateAttrNames.Field}=${AgeGateField.Month}]`
      )
      const fieldDay = element.querySelector(
        `[${AgeGateAttrNames.Field}=${AgeGateField.Day}]`
      )

      if (
        !('value' in fieldYear) ||
        (fieldMonth && !('value' in fieldMonth)) ||
        (fieldDay && !('value' in fieldDay))
      ) {
        return this.log('Unsupported field detected')
      }

      const clearFields = () => {
        fieldYear.value = ''
        if (fieldMonth) fieldMonth.value = ''
        if (fieldDay) fieldDay.value = ''
      }

      const onClickButtonEnter = () => {
        const year = Number(fieldYear.value)
        let month: number | undefined
        let day: number | undefined

        if (fieldMonth) {
          month = Number(fieldMonth.value)

          if (fieldDay) day = Number(fieldDay.value)
        }

        if (
          !dayjs(
            `${year}-${month ?? 1}-${day ?? 1}`,
            'YYYY-M-D',
            true
          ).isValid()
        ) {
          clearFields()
          return
        }

        const inputDate = dayjs()
          .year(year)
          .month(month ? month - 1 : 0)
          .date(day ?? 1)
        const diffYears = dayjs().diff(inputDate, 'year')

        clearFields()

        if (diffYears > 100) return
        if (diffYears >= minAge) {
          setCookie(diffYears)
          removeElement()
        } else redirect()
      }

      buttonEnter.addEventListener('click', onClickButtonEnter)
    }
  },
  title: 'Age Gate Booster',
  documentationLink: 'https://www.flowbase.co/booster/age-gate-webflow',
})

export const AgeGateFlowbase = () => ageGateBooster.init()
