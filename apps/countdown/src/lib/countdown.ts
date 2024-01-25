import Booster from '@flowbase-co/booster'
import Countdown from '@flowbase-co/countdown'

import {
  CountdownAttrNames,
  CountdownType,
  type CountdownAttributes,
} from './types'

const countdownBooster = new Booster.Booster<CountdownAttributes, Element>({
  name: CountdownAttrNames.Root,
  attributes: {
    [CountdownAttrNames.Target]: {
      defaultValue: '',
      validate: Countdown.validation.isValidDate,
    },
  },
  apply(element, data) {
    const target = data.get(CountdownAttrNames.Target)

    if (!target) return

    const weeksEl = element.querySelector(
      `[${CountdownAttrNames.Type}=${CountdownType.Weeks}]`
    )
    const daysEl = element.querySelector(
      `[${CountdownAttrNames.Type}=${CountdownType.Days}]`
    )
    const hoursEl = element.querySelector(
      `[${CountdownAttrNames.Type}=${CountdownType.Hours}]`
    )
    const minutesEl = element.querySelector(
      `[${CountdownAttrNames.Type}=${CountdownType.Minutes}]`
    )
    const secondsEl = element.querySelector(
      `[${CountdownAttrNames.Type}=${CountdownType.Seconds}]`
    )

    if (!weeksEl && !daysEl && !hoursEl && !minutesEl && !secondsEl) {
      return this.log('Required attribute is missing')
    }

    const finishElement = element.querySelector<HTMLElement>(
      `[${CountdownAttrNames.Finish}]`
    )

    if (finishElement) finishElement.style.display = 'none'

    const countdown = new Countdown.Countdown(target, {
      weeks: !!weeksEl,
      days: !!daysEl,
      hours: !!hoursEl,
      minutes: !!minutesEl,
      seconds: !!secondsEl,

      onUpdate(result) {
        if (weeksEl) weeksEl.textContent = result.weeks?.toString() ?? '0'
        if (daysEl) daysEl.textContent = result.days?.toString() ?? '0'
        if (hoursEl) hoursEl.textContent = result.hours?.toString() ?? '0'
        if (minutesEl) minutesEl.textContent = result.minutes?.toString() ?? '0'
        if (secondsEl) secondsEl.textContent = result.seconds?.toString() ?? '0'
      },

      onComplete() {
        if (finishElement) finishElement.style.display = 'block'
      },
    })

    countdown.start()
  },
  title: 'Countdown Booster',
  documentationLink: 'https://www.flowbase.co/booster/countdown',
})

export const CountdownFlowbase = () => countdownBooster.init()
