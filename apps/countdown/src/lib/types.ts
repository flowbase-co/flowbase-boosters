export enum CountdownAttrNames {
  Root = 'fb-countdown',
  Target = 'fb-countdown-target',

  Type = 'fb-countdown-type',
  Finish = 'fb-countdown-finish',
}

export enum CountdownType {
  Weeks = 'weeks',
  Days = 'days',
  Hours = 'hours',
  Minutes = 'minutes',
  Seconds = 'seconds',
}

export type CountdownAttributes = {
  [CountdownAttrNames.Target]: string
}
