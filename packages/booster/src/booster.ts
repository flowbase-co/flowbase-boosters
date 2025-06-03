import { BoosterData } from './data'
import {
  Attribute,
  BoosterBase,
  BoosterOptions,
  type BoosterRecord,
} from './types'

const BOOSTER_STATE_INITIALIZED = 'fb-booster-initialized'

export class Booster<T extends BoosterRecord, K extends Element = Element>
  implements BoosterBase
{
  constructor(private options: BoosterOptions<T, K>) {}

  log(message: string, data?: any) {
    const logStyles = `
      display: inline-block;
      padding: 4px 6px;
      border-radius: 4px;
      line-height: 1.5em;
      color: #282735;
      background: linear-gradient(45deg,
        rgba(185, 205, 255, 0.4) 0%,
        rgba(201, 182, 255, 0.4) 33%,
        rgba(239, 184, 255, 0.4) 66%,
        rgba(255, 210, 177, 0.4) 100%);
        `
    const log = [
      `%c[${this.options.title}] ${message}. Link to documentation ${this.options.documentationLink}`,
      logStyles,
    ]

    if (data) {
      console.group(...log)
      Array.isArray(data) ? console.log(...data) : console.log(data)
      console.groupEnd()
    } else {
      console.log(...log)
    }
  }

  validate(attr: Attribute<unknown>, name: string, value: string) {
    if (!attr.validate) return true

    if (typeof attr.validate === 'function') {
      if (!attr.validate(value)) {
        this.log(`Invalid value "${value}" for attribute "${name}"`)

        return false
      }
    } else {
      if (!attr.validate.includes(value)) {
        this.log(`Invalid value "${value}" for attribute "${name}"`, [
          '%cPossible values:%c\n' +
            attr.validate.map((value) => `• ${value}`).join('\n'),
          'font-weight: 700;',
          'font-weight: initial;',
        ])

        return false
      }
    }

    return true
  }

  parse(el: K) {
    const data = new BoosterData<T>()

    for (const name in this.options.attributes) {
      const attr = this.options.attributes[name]
      const rawValue = el.getAttribute(name)

      if (!rawValue || !this.validate(attr, name, rawValue)) {
        data.set(name, attr.defaultValue)

        continue
      }

      let attrValue = rawValue as T[Extract<keyof T, string>]

      if (attr.parse) attrValue = attr.parse(rawValue) ?? attr.defaultValue

      data.set(name, attrValue)
    }

    this.options.apply.call(this, el, data)
  }

  getElements() {
    return document.querySelectorAll<K>(`[${this.options.name}]`)
  }

  init() {
    const elements = this.getElements()

    elements.forEach((el) => {
      if (el.hasAttribute(BOOSTER_STATE_INITIALIZED)) return

      el.setAttribute(BOOSTER_STATE_INITIALIZED, 'true')
      this.parse(el)
    })
  }
}
