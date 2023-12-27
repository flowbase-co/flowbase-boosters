export enum CountdownUnit {
  Weeks = 'weeks',
  Days = 'days',
  Hours = 'hours',
  Minutes = 'minutes',
  Seconds = 'seconds',
}

export type CountdownResult = {
  [key in CountdownUnit]?: number
}

export interface CountdownValue {
  unit: CountdownUnit
  value: number
  shift: number
  skip: boolean
  calc: (distance: number) => number
}

export interface CountdownOptions {
  weeks?: boolean
  days?: boolean
  hours?: boolean
  minutes?: boolean
  seconds?: boolean

  onUpdate: (result: CountdownResult) => void
  onComplete?: () => void
}
