import Booster from '@flowbase-co/booster'
import Countdown from '@flowbase-co/countdown'

enum CountdownAttrNames {
  Root = 'fb-countdown',
  Target = 'fb-countdown-target',

  Weeks = 'fb-countdown-weeks',
  Days = 'fb-countdown-days',
  Hours = 'fb-countdown-hours',
  Minutes = 'fb-countdown-minutes',
  Seconds = 'fb-countdown-seconds',

  Message = 'fb-countdown-message',
}

type CountdownAttributes = {
  [CountdownAttrNames.Target]: string
}

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

    const weeksEl = element.querySelector(`[${CountdownAttrNames.Weeks}]`)
    const daysEl = element.querySelector(`[${CountdownAttrNames.Days}]`)
    const hoursEl = element.querySelector(`[${CountdownAttrNames.Hours}]`)
    const minutesEl = element.querySelector(`[${CountdownAttrNames.Minutes}]`)
    const secondsEl = element.querySelector(`[${CountdownAttrNames.Seconds}]`)

    if (!weeksEl && !daysEl && !hoursEl && !minutesEl && !secondsEl) {
      return this.log('Required attribute is missing')
    }

    const messageElement = element.querySelector<HTMLElement>(
      `[${CountdownAttrNames.Message}]`
    )

    if (messageElement) messageElement.style.display = 'none'

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
        if (messageElement) messageElement.style.display = 'block'
      },
    })

    countdown.start()
  },
  title: 'Countdown Booster',
  documentationLink: 'https://www.flowbase.co/booster/countdown',
})

export const CountdownFlowbase = () => countdownBooster.init()
