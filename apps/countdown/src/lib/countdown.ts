interface Options {
  daysSelector?: string
  hoursSelector?: string
  minutesSelector?: string
  secondsSelector?: string

  onComplete?: () => void
}

const day = 1000 * 60 * 60 * 24
const hour = 1000 * 60 * 60
const minute = 1000 * 60
const second = 1000

export const CountdownTimerFlowbase = (
  expiredDate: string,
  options: Options = {}
) => {
  if (!expiredDate) {
    throw new Error('Please provide the expiration date')
  }

  const date = new Date(expiredDate)

  if (date.toString() == 'Invalid Date' || isNaN(date.valueOf())) {
    throw new Error('Invalid date format')
  }

  const targetDate = date.getTime()

  const daysEl = document.querySelector<HTMLElement>(
    options.daysSelector || '#days'
  )
  const hoursEl = document.querySelector<HTMLElement>(
    options.hoursSelector || '#hours'
  )
  const minutesEl = document.querySelector<HTMLElement>(
    options.minutesSelector || '#minutes'
  )
  const secondsEl = document.querySelector<HTMLElement>(
    options.secondsSelector || '#seconds'
  )

  const countdownInterval = setInterval(() => {
    const currentDate = new Date().getTime()
    const distance = targetDate - currentDate

    if (daysEl) {
      daysEl.innerText = `${Math.floor(distance / day)}`
    }

    if (hoursEl) {
      hoursEl.innerText = `${Math.floor((distance % day) / hour)}`
    }

    if (minutesEl) {
      minutesEl.innerText = `${Math.floor((distance % hour) / minute)}`
    }

    if (secondsEl) {
      secondsEl.innerText = `${Math.floor((distance % minute) / second)}`
    }

    if (distance < 0) {
      clearInterval(countdownInterval)

      if (daysEl) daysEl.innerText = '0'
      if (hoursEl) hoursEl.innerText = '0'
      if (minutesEl) minutesEl.innerText = '0'
      if (secondsEl) secondsEl.innerText = '0'

      if (options.onComplete && typeof options.onComplete === 'function') {
        options.onComplete()
      }
    }
  }, 1000)
}
