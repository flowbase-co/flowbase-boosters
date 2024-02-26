import { Booster } from './booster'

import { stringToBoolean } from './parse/boolean'

import { isBoolean } from './validation/boolean'
import { isNumber } from './validation/number'

export default {
  Booster,
  parse: {
    stringToBoolean,
  },
  validation: {
    isBoolean,
    isNumber,
  },
}

export * from './types'
