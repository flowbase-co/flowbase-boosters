import { colord, extend } from 'colord'
import namesPlugin from 'colord/plugins/names'

import Booster from '@flowbase-co/booster'

import { Effect1 } from './effects/effect-1'
import { Effect2 } from './effects/effect-2'
import { Effect3 } from './effects/effect-3'
import { Effect4 } from './effects/effect-4'
import { Effect5 } from './effects/effect-5'
import { Effect6 } from './effects/effect-6'
import { Effect7 } from './effects/effect-7'
import { Effect8 } from './effects/effect-8'
import { Effect9 } from './effects/effect-9'
import { Effect10 } from './effects/effect-10'
import { Effect11 } from './effects/effect-11'
import { Effect12 } from './effects/effect-12'

import {
  highlightDirection,
  highlightType,
  type TextHighlightDirection,
  type TextHighlightType,
} from './types'

extend([namesPlugin])

enum TextHighlightAttrNames {
  Root = 'fb-text-highlight',
  Type = 'fb-text-highlight-type',

  // Advanced settings
  Direction = 'fb-text-highlight-direction',
  MultiLine = 'fb-text-highlight-multi-line',
  Offset = 'fb-text-highlight-offset',
  Once = 'fb-text-highlight-once',
  SpeedFactor = 'fb-text-highlight-speed',

  // Highlight style
  HighlightClass = 'fb-text-highlight-class',
  HighlightColors = 'fb-text-highlight-colors',
  HighlightDuplicates = 'fb-text-highlight-duplicates',
  HighlightBgColor = 'fb-text-highlight-bg-color',
  HighlightBgInset = 'fb-text-highlight-bg-inset',
  HighlightBgRadius = 'fb-text-highlight-bg-radius',
  HighlightColorEnd = 'fb-text-highlight-color-end',
  HighlightColorEndAlt = 'fb-text-highlight-color-end-alt',
  HighlightShadowColor = 'fb-text-highlight-shadow-color',
}

type TextHighlightAttributes = {
  [TextHighlightAttrNames.Type]: TextHighlightType
  [TextHighlightAttrNames.Direction]: TextHighlightDirection
  [TextHighlightAttrNames.MultiLine]: boolean
  [TextHighlightAttrNames.Offset]: number
  [TextHighlightAttrNames.Once]: boolean
  [TextHighlightAttrNames.SpeedFactor]: number
  [TextHighlightAttrNames.HighlightClass]?: string
  [TextHighlightAttrNames.HighlightColors]: string[]
  [TextHighlightAttrNames.HighlightDuplicates]: number
  [TextHighlightAttrNames.HighlightBgColor]?: string
  [TextHighlightAttrNames.HighlightBgInset]?: string
  [TextHighlightAttrNames.HighlightBgRadius]?: string
  [TextHighlightAttrNames.HighlightColorEnd]?: string
  [TextHighlightAttrNames.HighlightColorEndAlt]?: string
  [TextHighlightAttrNames.HighlightShadowColor]?: string
}

let gsap: GSAP | undefined

const textHighlightBooster = new Booster.Booster<
  TextHighlightAttributes,
  HTMLElement
>({
  name: TextHighlightAttrNames.Root,
  attributes: {
    [TextHighlightAttrNames.Type]: {
      defaultValue: 1,
      validate: (value) =>
        Booster.validation.isValidType(Number(value), highlightType),
      parse: (value) => Number(value) as TextHighlightType,
    },
    [TextHighlightAttrNames.Direction]: {
      defaultValue: 'both',
      validate: (value) =>
        Booster.validation.isValidType(value, highlightDirection),
      parse: (value) => value as TextHighlightDirection,
    },
    [TextHighlightAttrNames.MultiLine]: {
      defaultValue: false,
      validate: Booster.validation.isBoolean,
      parse: Booster.parse.stringToBoolean,
    },
    [TextHighlightAttrNames.Offset]: {
      defaultValue: 0,
      validate: Booster.validation.isNumber,
      parse: Number,
    },
    [TextHighlightAttrNames.Once]: {
      defaultValue: false,
      validate: Booster.validation.isBoolean,
      parse: Booster.parse.stringToBoolean,
    },
    [TextHighlightAttrNames.SpeedFactor]: {
      defaultValue: 1,
      validate: (value) => {
        if (!Booster.validation.isNumber(value)) return false

        const numValue = Number(value)

        return numValue >= 0.5 && numValue <= 2
      },
      parse: Number,
    },
    [TextHighlightAttrNames.HighlightClass]: {
      defaultValue: undefined,
      parse: (value) => value.toLowerCase().replaceAll(' ', '-'),
    },
    [TextHighlightAttrNames.HighlightColors]: {
      defaultValue: [],
      parse: (value) => {
        return value
          .match(/([^(,]+(?:\([^)]+\))?|[^,]+)/g)
          ?.map((color) => color.trim())
          .filter((color) => colord(color).isValid())
      },
    },
    [TextHighlightAttrNames.HighlightDuplicates]: {
      defaultValue: 0,
      validate: Booster.validation.isNumber,
      parse: Number,
    },
    [TextHighlightAttrNames.HighlightBgColor]: {
      defaultValue: undefined,
      validate: (value) => colord(value).isValid(),
      parse: (value) => colord(value).toRgbString(),
    },
    [TextHighlightAttrNames.HighlightBgInset]: {
      defaultValue: undefined,
      validate: (value) =>
        Booster.validation.isValidCSSPropertyValue('inset', value),
    },
    [TextHighlightAttrNames.HighlightBgRadius]: {
      defaultValue: undefined,
      validate: (value) =>
        Booster.validation.isValidCSSPropertyValue('border-radius', value),
    },
    [TextHighlightAttrNames.HighlightColorEnd]: {
      defaultValue: undefined,
      validate: (value) => colord(value).isValid(),
      parse: (value) => colord(value).toRgbString(),
    },
    [TextHighlightAttrNames.HighlightColorEndAlt]: {
      defaultValue: undefined,
      validate: (value) => colord(value).isValid(),
      parse: (value) => colord(value).toRgbString(),
    },
    [TextHighlightAttrNames.HighlightShadowColor]: {
      defaultValue: undefined,
      validate: (value) => colord(value).isValid(),
      parse: (value) => colord(value).toRgbString(),
    },
  },
  async apply(element, data) {
    if (!gsap) return

    element.style.fontKerning = 'none'
    element.style.textRendering = 'optimizeSpeed'

    const type = data.get(TextHighlightAttrNames.Type)
    const direction = data.get(TextHighlightAttrNames.Direction)
    const offset = data.get(TextHighlightAttrNames.Offset)
    const once = data.get(TextHighlightAttrNames.Once)
    const speedFactor = data.get(TextHighlightAttrNames.SpeedFactor)
    const allowMultiLine = data.get(TextHighlightAttrNames.MultiLine)

    const highlightClass = data.get(TextHighlightAttrNames.HighlightClass)
    const highlightBgColor = data.get(TextHighlightAttrNames.HighlightBgColor)
    const highlightBgInset = data.get(TextHighlightAttrNames.HighlightBgInset)
    const highlightBgRadius = data.get(TextHighlightAttrNames.HighlightBgRadius)
    const highlightColorEnd = data.get(TextHighlightAttrNames.HighlightColorEnd)
    const highlightShadowColor = data.get(
      TextHighlightAttrNames.HighlightShadowColor
    )

    const sharedOptions = {
      direction,
      offset,
      once,
      speedFactor,
    }

    switch (type) {
      case 1:
        return new Effect1(element, gsap, sharedOptions)
      case 2:
        return new Effect2(element, gsap, sharedOptions)
      case 3:
        return new Effect3(element, gsap, {
          ...sharedOptions,
          highlightColorEnd,
          highlightShadowColor,
        })
      case 4:
        return new Effect4(element, gsap, {
          ...sharedOptions,
          highlightColorEnd,
          highlightColorEndAlt: data.get(
            TextHighlightAttrNames.HighlightColorEndAlt
          ),
        })
      case 5:
        return new Effect5(element, gsap, {
          ...sharedOptions,
          allowMultiLine,
          highlightClass,
          highlightBgColor,
          highlightBgInset,
          highlightBgRadius,
        })
      case 6:
        return new Effect6(element, gsap, {
          ...sharedOptions,
          allowMultiLine,
          highlightClass,
          highlightBgColor,
          highlightBgInset,
          highlightBgRadius,
        })
      case 7:
        return new Effect7(element, gsap, {
          ...sharedOptions,
          allowMultiLine,
          highlightClass,
          highlightBgColor,
          highlightBgInset,
          highlightBgRadius,
        })
      case 8:
        return new Effect8(element, gsap, {
          ...sharedOptions,
          highlightColorEnd,
        })
      case 9:
        return new Effect9(element, gsap, {
          ...sharedOptions,
          highlightColorEnd,
        })
      case 10:
        return new Effect10(element, gsap, {
          ...sharedOptions,
          highlightColors: data.get(TextHighlightAttrNames.HighlightColors),
        })
      case 11:
        return new Effect11(element, gsap, {
          ...sharedOptions,
          highlightDuplicates: data.get(
            TextHighlightAttrNames.HighlightDuplicates
          ),
          highlightColorEnd,
        })
      case 12:
        return new Effect12(element, gsap, {
          ...sharedOptions,
          allowMultiLine,
          highlightClass,
          highlightBgColor,
          highlightBgInset,
          highlightShadowColor,
        })
    }
  },
  title: 'GSAP Text Highlight Booster',
  documentationLink: 'https://www.flowbase.co/booster/gsap-text-highlight',
})

export const TextHighlightFlowbase = async () => {
  gsap = await Booster.Dependencies.init()
    .get<GSAP>('gsap', '3.12.x')
    .catch(() => undefined)

  if (!gsap) return textHighlightBooster.log(`GSAP isn't initialized`)

  textHighlightBooster.init()
}
