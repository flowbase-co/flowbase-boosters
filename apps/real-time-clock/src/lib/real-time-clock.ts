import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

import Booster from '@flowbase-co/booster'

enum RealTimeClockAttrNames {
  Root = 'fb-clock',
  TimeFormat = 'fb-clock-format',
  Timezone = 'fb-clock-timezone',

  // Elements

  Hour = 'fb-clock-hour',
  Minute = 'fb-clock-minute',
  Second = 'fb-clock-second',
  Period = 'fb-clock-period',

  Day = 'fb-clock-day',
  Month = 'fb-clock-month',
  Year = 'fb-clock-year',
  DayWeek = 'fb-clock-day-week',
}

enum RealTimeClockTimeFormat {
  Standard = '12-hour',
  Military = '24-hour',
}

type RealTimeClockAttributes = {
  [RealTimeClockAttrNames.TimeFormat]: RealTimeClockTimeFormat
  [RealTimeClockAttrNames.Timezone]?: string
}

const formats: {
  [key: string]: {
    available?: string[]
    defaultValue: string
  }
} = {
  [RealTimeClockAttrNames.Hour]: {
    available: ['h', 'hh'],
    defaultValue: 'h',
  },
  [RealTimeClockAttrNames.Minute]: {
    available: ['m', 'mm'],
    defaultValue: 'mm',
  },
  [RealTimeClockAttrNames.Second]: {
    available: ['s', 'ss'],
    defaultValue: 'ss',
  },
  [RealTimeClockAttrNames.Period]: {
    defaultValue: 'a',
  },
  [RealTimeClockAttrNames.Day]: {
    available: ['D', 'DD'],
    defaultValue: 'DD',
  },
  [RealTimeClockAttrNames.Month]: {
    available: ['M', 'MM', 'MMM', 'MMMM'],
    defaultValue: 'MM',
  },
  [RealTimeClockAttrNames.Year]: {
    available: ['YY', 'YYYY'],
    defaultValue: 'YY',
  },
  [RealTimeClockAttrNames.DayWeek]: {
    available: ['ddd', 'dddd'],
    defaultValue: 'dddd',
  },
}

const realTimeClockBooster = new Booster.Booster<
  RealTimeClockAttributes,
  HTMLElement
>({
  name: RealTimeClockAttrNames.Root,
  attributes: {
    [RealTimeClockAttrNames.TimeFormat]: {
      defaultValue: RealTimeClockTimeFormat.Standard,
      validate: Object.values(RealTimeClockTimeFormat),
    },
    [RealTimeClockAttrNames.Timezone]: {
      defaultValue: undefined,
    },
  },
  apply(element, data) {
    const timeFormat = data.get(RealTimeClockAttrNames.TimeFormat)

    const log = (attr: RealTimeClockAttrNames, value: string) => {
      const values = formats[attr].available

      this.log(
        `Invalid value "${value}" for attribute "${attr}"`,
        values?.length && [
          '%cPossible values:%c\n' +
            values.map((value) => `• ${value}`).join('\n'),
          'font-weight: 700;',
          'font-weight: initial;',
        ]
      )
    }

    const attrElements: {
      attr: RealTimeClockAttrNames
      elements: HTMLElement[]
    }[] = []

    for (const attr of Object.values(RealTimeClockAttrNames)) {
      const elements = element.querySelectorAll<HTMLElement>(`[${attr}]`)

      if (elements.length) {
        attrElements.push({
          attr,
          elements: Array.from(elements),
        })
      }
    }

    const values: Array<{ element: HTMLElement; format: string }> = []

    for (const { attr, elements } of attrElements) {
      const attrFormat = formats[attr]

      if (!attrFormat) continue

      for (const element of elements) {
        if (attr === RealTimeClockAttrNames.Period) {
          values.push({ element, format: attrFormat.defaultValue })

          continue
        }

        const value = element.getAttribute(attr)

        if (value && !attrFormat.available?.includes(value)) {
          log(attr, value)
          continue
        }

        let format = value || attrFormat.defaultValue

        if (
          attr === RealTimeClockAttrNames.Hour &&
          timeFormat === RealTimeClockTimeFormat.Military
        ) {
          format = format.toUpperCase()
        }

        values.push({ element, format })
      }
    }

    if (!values.length) return this.log('Required attribute is missing')

    let timezone = data.get(RealTimeClockAttrNames.Timezone)

    if (timezone) {
      try {
        dayjs().tz(timezone).isValid()
      } catch {
        timezone = undefined
        this.log('Incorrect timezone')
      }
    }

    const updateValues = () => {
      let date = dayjs()

      if (timezone) date = date.tz(timezone)

      for (const { element, format } of values) {
        element.innerText = date.format(format)
      }
    }

    updateValues()
    setInterval(updateValues, 1000)
  },
  title: 'Real Time Clock Booster',
  documentationLink: 'https://www.flowbase.co/booster/real-time-clock',
})

export const RealTimeClockFlowbase = () => realTimeClockBooster.init()
