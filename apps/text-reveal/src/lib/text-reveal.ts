import { colord, extend } from 'colord'
import namesPlugin from 'colord/plugins/names'

import Booster from '@flowbase-co/booster'

import { Effect1 } from './effects/effect-1'
import { Effect2 } from './effects/effect-2'
import { Effect3 } from './effects/effect-3'
import { Effect4 } from './effects/effect-4'
import { Effect5 } from './effects/effect-5'

extend([namesPlugin])

enum TextRevealAttrNames {
  Root = 'fb-text-reveal',
  Type = 'fb-text-reveal-type',

  // Advanced settings
  Offset = 'fb-text-reveal-offset',

  // Reveal style
  RevealColorEnd = 'fb-text-reveal-color-end',
}

const revealType = [1, 2, 3, 4, 5] as const
type TextRevealType = (typeof revealType)[number]

type TextRevealAttributes = {
  [TextRevealAttrNames.Type]: TextRevealType
  [TextRevealAttrNames.Offset]: number
  [TextRevealAttrNames.RevealColorEnd]?: string
}

let gsap: GSAP | undefined

const textRevealBooster = new Booster.Booster<
  TextRevealAttributes,
  HTMLElement
>({
  name: TextRevealAttrNames.Root,
  attributes: {
    [TextRevealAttrNames.Type]: {
      defaultValue: 1,
      validate: (value) =>
        Booster.validation.isValidType(Number(value), revealType),
      parse: (value) => Number(value) as TextRevealType,
    },
    [TextRevealAttrNames.Offset]: {
      defaultValue: 20,
      validate: Booster.validation.isNumber,
      parse: Number,
    },
    [TextRevealAttrNames.RevealColorEnd]: {
      defaultValue: undefined,
      validate: (value) => colord(value).isValid(),
      parse: (value) => colord(value).toRgbString(),
    },
  },
  apply(element, data) {
    if (!gsap) return

    element.style.fontKerning = 'none'
    element.style.textRendering = 'optimizeSpeed'

    const type = data.get(TextRevealAttrNames.Type)
    const offset = data.get(TextRevealAttrNames.Offset)

    switch (type) {
      case 1:
        return new Effect1(element, gsap, { offset })
      case 2:
        return new Effect2(element, gsap, { offset })
      case 3:
        return new Effect3(element, gsap, { offset })
      case 4:
        return new Effect4(element, gsap, { offset })
      case 5:
        return new Effect5(element, gsap, {
          offset,
          revealColorEnd: data.get(TextRevealAttrNames.RevealColorEnd),
        })
    }
  },
  title: 'Text Reveal Booster',
  documentationLink: 'https://www.flowbase.co/booster/text-reveal',
})

export const TextRevealFlowbase = async () => {
  gsap = await Booster.Dependencies.init()
    .get<GSAP>('gsap', '3.12.x')
    .catch(() => undefined)

  if (!gsap) return textRevealBooster.log(`GSAP isn't initialized`)

  textRevealBooster.init()
}
