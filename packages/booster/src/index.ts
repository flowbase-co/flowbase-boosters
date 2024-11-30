import { Dependencies } from './dependency'
import { Booster } from './booster'

import { stringToBoolean } from './parse/boolean'

import { isValidCSSPropertyValue } from './validation/css-property'
import { isValidType } from './validation/type'
import { isBoolean } from './validation/boolean'
import { isNumber } from './validation/number'

export default {
  Dependencies,
  Booster,
  parse: {
    stringToBoolean,
  },
  validation: {
    isValidCSSPropertyValue,
    isValidType,
    isBoolean,
    isNumber,
  },
}

export * from './types'
