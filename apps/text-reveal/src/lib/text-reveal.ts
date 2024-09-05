import Booster from '@flowbase-co/booster'

import { Effect1 } from './effects/effect-1'
import { Effect2 } from './effects/effect-2'
import { Effect3 } from './effects/effect-3'
import { Effect4 } from './effects/effect-4'
import { Effect5 } from './effects/effect-5'

// TODO: add attrs for settings (position, ...)

enum TextRevealAttrNames {
  Root = 'fb-text-reveal',
  Type = 'fb-text-reveal-type',
}

enum TextRevealType {
  First = 'first',
  Second = 'second',
  Third = 'third',
  Fourth = 'fourth',
  Fifth = 'fifth',
}

type TextRevealAttributes = {
  [TextRevealAttrNames.Type]: TextRevealType
}

let gsap: GSAP | undefined

const textRevealBooster = new Booster.Booster<
  TextRevealAttributes,
  HTMLElement
>({
  name: TextRevealAttrNames.Root,
  attributes: {
    [TextRevealAttrNames.Type]: {
      defaultValue: TextRevealType.First,
      validate: Object.values(TextRevealType),
    },
  },
  apply(element, data) {
    if (!gsap) return this.log(`GSAP isn't initialized`)

    const type = data.get(TextRevealAttrNames.Type)

    switch (type) {
      case TextRevealType.Second:
        return new Effect2(element, gsap)
      case TextRevealType.Third:
        return new Effect3(element, gsap)
      case TextRevealType.Fourth:
        return new Effect4(element, gsap)
      case TextRevealType.Fifth:
        const endColor = element.getAttribute('fb-text-reveal-end-color')

        return new Effect5(element, gsap, {
          endColor: endColor || 'currentColor',
        })
      default:
        new Effect1(element, gsap)
    }
  },
  title: 'Text Reveal Booster',
  documentationLink: 'https://www.flowbase.co/booster/text-reveal',
})

export const TextRevealFlowbase = async () => {
  gsap = await Booster.Dependencies.init()
    .get<GSAP>('gsap', '3.12')
    .catch(() => undefined)

  // if (!gsap) return textRevealBooster.log(`GSAP isn't initialized`)

  textRevealBooster.init()
}
