import Booster from '@flowbase-co/booster'

import { Effect1 } from './effects/effect-1'
import { Effect2 } from './effects/effect-2'
import { Effect3 } from './effects/effect-3'
import { Effect4 } from './effects/effect-4'
import { Effect5 } from './effects/effect-5'

enum TextHoverAttrNames {
  Root = 'fb-text-hover',
  Type = 'fb-text-hover-type',

  Colors = 'fb-text-hover-colors',
  Class = 'fb-text-hover-class',
}

enum TextHoverType {
  First = 'first',
  Second = 'second',
  Third = 'third',
  Fourth = 'fourth',
  Fifth = 'fifth',
}

type TextHoverAttributes = {
  [TextHoverAttrNames.Type]: TextHoverType

  [TextHoverAttrNames.Colors]?: string
  [TextHoverAttrNames.Class]?: string
}

let gsap: GSAP | undefined

const textHoverBooster = new Booster.Booster<TextHoverAttributes, HTMLElement>({
  name: TextHoverAttrNames.Root,
  attributes: {
    [TextHoverAttrNames.Type]: {
      defaultValue: TextHoverType.First,
      validate: Object.values(TextHoverType),
    },

    [TextHoverAttrNames.Colors]: {
      defaultValue: undefined,
    },
    [TextHoverAttrNames.Class]: {
      defaultValue: undefined,
    },
  },
  apply(element, data) {
    if (!gsap) return this.log(`GSAP isn't initialized`)

    const type = data.get(TextHoverAttrNames.Type)

    const className = data
      .get(TextHoverAttrNames.Class)
      ?.toLowerCase()
      .replaceAll(' ', '-')

    const colors = data.get(TextHoverAttrNames.Colors)
    let colorsList: string[] = []

    if (colors) colorsList = colors.replaceAll(' ', '').split(',')

    switch (type) {
      case TextHoverType.Second:
        return new Effect2(element, gsap, { cursorClass: className })
      case TextHoverType.Third:
        return new Effect3(element, gsap, { bgClass: className })
      case TextHoverType.Fourth:
        return new Effect4(element, gsap, { colors: colorsList })
      case TextHoverType.Fifth:
        return new Effect5(element, gsap, { bgClass: className })
      default:
        new Effect1(element, gsap)
    }
  },
  title: 'Text Hover Booster',
  documentationLink: 'https://www.flowbase.co/booster/text-hover',
})

export const TextHoverFlowbase = async () => {
  gsap = await Booster.Dependencies.init()
    .get<GSAP>('gsap', '3.12')
    .catch(() => undefined)

  // if (!gsap) return textHoverBooster.log(`GSAP isn't initialized`)

  textHoverBooster.init()
}
