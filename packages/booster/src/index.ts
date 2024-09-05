import { Dependencies } from './dependency'
import { Booster } from './booster'

import { stringToBoolean } from './parse/boolean'

import { isBoolean } from './validation/boolean'
import { isNumber } from './validation/number'

export default {
  Dependencies,
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
