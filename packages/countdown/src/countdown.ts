import { isValidDate } from './validation/date'

import {
  CountdownOptions,
  CountdownValue,
  CountdownUnit,
  type CountdownResult,
} from './types'

const second = 1000
const minute = second * 60
const hour = minute * 60
const day = hour * 24
const week = day * 7

export class Countdown {
  private values: CountdownValue[]
  private intervalId?: number
  private targetDate?: number

  constructor(
    target: string,
    private options: CountdownOptions
  ) {
    if (!target) throw new Error('Please provide the target date')
    if (!isValidDate(target)) throw new Error('Invalid date format')

    this.targetDate = new Date(target).getTime()
    this.values = [
      {
        unit: CountdownUnit.Weeks,
        value: 0,
        shift: 0,
        skip: !options.weeks,
        calc: (distance) => Math.floor(distance / week),
      },
      {
        unit: CountdownUnit.Days,
        value: 0,
        shift: 7,
        skip: !options.days,
        calc: (distance) => Math.floor((distance % week) / day),
      },
      {
        unit: CountdownUnit.Hours,
        value: 0,
        shift: 24,
        skip: !options.hours,
        calc: (distance) => Math.floor((distance % day) / hour),
      },
      {
        unit: CountdownUnit.Minutes,
        value: 0,
        shift: 60,
        skip: !options.minutes,
        calc: (distance) => Math.floor((distance % hour) / minute),
      },
      {
        unit: CountdownUnit.Seconds,
        value: 0,
        shift: 60,
        skip: !options.seconds,
        calc: (distance) => Math.floor((distance % minute) / second),
      },
    ]
  }

  get intervalTimeout() {
    switch (true) {
      case this.options.seconds:
      default:
        return second
      case this.options.minutes:
        return minute
      case this.options.hours:
        return hour
      case this.options.days:
        return day
      case this.options.weeks:
        return week
    }
  }

  private updateValues() {
    if (!this.targetDate) return

    const currentDate = new Date().getTime()
    const distance = this.targetDate - currentDate

    const result = {} as CountdownResult

    this.values.forEach((value, idx) => {
      if (distance > 0) {
        value.value = value.calc(distance)

        const prevValue = this.values[idx - 1]

        if (prevValue?.skip) value.value += prevValue.value * value.shift
      }

      if (!value.skip) result[value.unit] = value.value
    })

    this.options.onUpdate(result)

    if (distance <= this.intervalTimeout) {
      this.stop()

      if (this.options.onComplete) this.options.onComplete()
    }
  }

  start() {
    if (this.intervalId) return

    this.updateValues()

    this.intervalId = setInterval(() => {
      this.updateValues()
    }, this.intervalTimeout)
  }

  stop() {
    clearInterval(this.intervalId)
    this.intervalId = undefined
  }
}
