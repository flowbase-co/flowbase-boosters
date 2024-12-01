import { colord, extend } from 'colord'
import namesPlugin from 'colord/plugins/names'

import Booster from '@flowbase-co/booster'

import { Effect1 } from './effects/effect-1'
import { Effect2 } from './effects/effect-2'
import { Effect3 } from './effects/effect-3'
import { Effect4 } from './effects/effect-4'
import { Effect5 } from './effects/effect-5'

extend([namesPlugin])

enum TextHoverAttrNames {
  Root = 'fb-text-hover',
  Type = 'fb-text-hover-type',

  // Advanced settings
  MultiLine = 'fb-text-hover-multi-line',
  SpeedFactor = 'fb-text-hover-speed',

  // Hover style
  HoverClass = 'fb-text-hover-class',
  HoverColors = 'fb-text-hover-colors',
  HoverBgColor = 'fb-text-hover-bg-color',
  HoverBgInset = 'fb-text-hover-bg-inset',
  HoverColorEnd = 'fb-text-hover-color-end',
  HoverCursorColor = 'fb-text-hover-cursor-color',
}

const hoverType = [1, 2, 3, 4, 5] as const
type TextHoverType = (typeof hoverType)[number]

type TextHoverAttributes = {
  [TextHoverAttrNames.Type]: TextHoverType
  [TextHoverAttrNames.MultiLine]: boolean
  [TextHoverAttrNames.SpeedFactor]: number
  [TextHoverAttrNames.HoverClass]?: string
  [TextHoverAttrNames.HoverColors]: string[]
  [TextHoverAttrNames.HoverBgColor]?: string
  [TextHoverAttrNames.HoverBgInset]?: string
  [TextHoverAttrNames.HoverColorEnd]?: string
  [TextHoverAttrNames.HoverCursorColor]?: string
}

let gsap: GSAP | undefined

const textHoverBooster = new Booster.Booster<TextHoverAttributes, HTMLElement>({
  name: TextHoverAttrNames.Root,
  attributes: {
    [TextHoverAttrNames.Type]: {
      defaultValue: 1,
      validate: (value) =>
        Booster.validation.isValidType(Number(value), hoverType),
      parse: (value) => Number(value) as TextHoverType,
    },
    [TextHoverAttrNames.MultiLine]: {
      defaultValue: false,
      validate: Booster.validation.isBoolean,
      parse: Booster.parse.stringToBoolean,
    },
    [TextHoverAttrNames.SpeedFactor]: {
      defaultValue: 1,
      validate: (value) => {
        if (!Booster.validation.isNumber(value)) return false

        const numValue = Number(value)

        return numValue >= 0.5 && numValue <= 2
      },
      parse: (value) => Number(Number(value).toFixed(1)),
    },
    [TextHoverAttrNames.HoverClass]: {
      defaultValue: undefined,
      parse: (value) => value.toLowerCase().replaceAll(' ', '-'),
    },
    [TextHoverAttrNames.HoverColors]: {
      defaultValue: [],
      parse: (value) => {
        return value
          .match(/([^(,]+(?:\([^)]+\))?|[^,]+)/g)
          ?.map((color) => color.trim())
          .filter((color) => colord(color).isValid())
      },
    },
    [TextHoverAttrNames.HoverBgColor]: {
      defaultValue: undefined,
      validate: (value) => colord(value).isValid(),
      parse: (value) => colord(value).toRgbString(),
    },
    [TextHoverAttrNames.HoverBgInset]: {
      defaultValue: undefined,
      validate: (value) =>
        Booster.validation.isValidCSSPropertyValue('inset', value),
    },
    [TextHoverAttrNames.HoverColorEnd]: {
      defaultValue: undefined,
      validate: (value) => colord(value).isValid(),
      parse: (value) => colord(value).toRgbString(),
    },
    [TextHoverAttrNames.HoverCursorColor]: {
      defaultValue: undefined,
      validate: (value) => colord(value).isValid(),
      parse: (value) => colord(value).toRgbString(),
    },
  },
  apply(element, data) {
    if (!gsap) return

    element.style.fontKerning = 'none'
    element.style.textRendering = 'optimizeSpeed'

    const type = data.get(TextHoverAttrNames.Type)
    const speedFactor = data.get(TextHoverAttrNames.SpeedFactor)
    const allowMultiLine = data.get(TextHoverAttrNames.MultiLine)

    const hoverClass = data.get(TextHoverAttrNames.HoverClass)
    const hoverBgColor = data.get(TextHoverAttrNames.HoverBgColor)
    const hoverBgInset = data.get(TextHoverAttrNames.HoverBgInset)
    const hoverColorEnd = data.get(TextHoverAttrNames.HoverColorEnd)
    const hoverCursorColor = data.get(TextHoverAttrNames.HoverCursorColor)

    switch (type) {
      case 1:
        return new Effect1(element, gsap, {
          speedFactor,
          hoverColorEnd,
        })
      case 2:
        return new Effect2(element, gsap, {
          speedFactor,
          hoverCursorClass: hoverClass,
          hoverCursorColor,
        })
      case 3:
        return new Effect3(element, gsap, {
          speedFactor,
          allowMultiLine,
          hoverBgClass: hoverClass,
          hoverBgColor,
          hoverBgInset,
        })
      case 4:
        return new Effect4(element, gsap, {
          speedFactor,
          hoverColors: data.get(TextHoverAttrNames.HoverColors),
        })
      case 5:
        return new Effect5(element, gsap, {
          speedFactor,
          allowMultiLine,
          hoverBgClass: hoverClass,
          hoverBgColor,
          hoverBgInset,
        })
    }
  },
  title: 'GSAP Text Hover Booster',
  documentationLink: 'https://www.flowbase.co/booster/gsap-text-hover',
})

export const TextHoverFlowbase = async () => {
  gsap = await Booster.Dependencies.init()
    .get<GSAP>('gsap', '3.12.x')
    .catch(() => undefined)

  if (!gsap) return textHoverBooster.log(`GSAP isn't initialized`)

  textHoverBooster.init()
}
