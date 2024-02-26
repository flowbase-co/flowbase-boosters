import Typed, { type TypedOptions } from 'typed.js'

import Booster from '@flowbase-co/booster'

enum TypewriterAttrNames {
  Root = 'fb-typewriter',
  TypeSpeed = 'fb-typewriter-speed',
  BackSpeed = 'fb-typewriter-back-speed',
  StartDelay = 'fb-typewriter-delay',
  BackDelay = 'fb-typewriter-back-delay',
  Loop = 'fb-typewriter-loop',
  LoopCount = 'fb-typewriter-loop-count',
  Shuffle = 'fb-typewriter-shuffle',
  SmartBackspace = 'fb-typewriter-smart-backspace',
  Cursor = 'fb-typewriter-cursor',
  CursorChar = 'fb-typewriter-cursor-char',
  FadeOut = 'fb-typewriter-fade-out',
  FadeOutDelay = 'fb-typewriter-fade-out-delay',
}

type TypewriterAttributes = {
  [TypewriterAttrNames.TypeSpeed]: number
  [TypewriterAttrNames.BackSpeed]: number
  [TypewriterAttrNames.StartDelay]: number
  [TypewriterAttrNames.BackDelay]: number
  [TypewriterAttrNames.Loop]: boolean
  [TypewriterAttrNames.LoopCount]: number
  [TypewriterAttrNames.Shuffle]: boolean
  [TypewriterAttrNames.SmartBackspace]: boolean
  [TypewriterAttrNames.Cursor]: boolean
  [TypewriterAttrNames.CursorChar]: string
  [TypewriterAttrNames.FadeOut]: boolean
  [TypewriterAttrNames.FadeOutDelay]: number
}

const typewriterBooster = new Booster.Booster<TypewriterAttributes, Element>({
  name: TypewriterAttrNames.Root,
  attributes: {
    [TypewriterAttrNames.TypeSpeed]: {
      defaultValue: 0,
      validate: Booster.validation.isNumber,
      parse: Number,
    },
    [TypewriterAttrNames.BackSpeed]: {
      defaultValue: 0,
      validate: Booster.validation.isNumber,
      parse: Number,
    },
    [TypewriterAttrNames.StartDelay]: {
      defaultValue: 0,
      validate: Booster.validation.isNumber,
      parse: Number,
    },
    [TypewriterAttrNames.BackDelay]: {
      defaultValue: 700,
      validate: Booster.validation.isNumber,
      parse: Number,
    },
    [TypewriterAttrNames.Loop]: {
      defaultValue: false,
      validate: Booster.validation.isBoolean,
      parse: Booster.parse.stringToBoolean,
    },
    [TypewriterAttrNames.LoopCount]: {
      defaultValue: Infinity,
      validate: Booster.validation.isNumber,
      parse: Number,
    },
    [TypewriterAttrNames.Shuffle]: {
      defaultValue: false,
      validate: Booster.validation.isBoolean,
      parse: Booster.parse.stringToBoolean,
    },
    [TypewriterAttrNames.SmartBackspace]: {
      defaultValue: true,
      validate: Booster.validation.isBoolean,
      parse: Booster.parse.stringToBoolean,
    },
    [TypewriterAttrNames.Cursor]: {
      defaultValue: true,
      validate: Booster.validation.isBoolean,
      parse: Booster.parse.stringToBoolean,
    },
    [TypewriterAttrNames.CursorChar]: {
      defaultValue: '|',
    },
    [TypewriterAttrNames.FadeOut]: {
      defaultValue: false,
      validate: Booster.validation.isBoolean,
      parse: Booster.parse.stringToBoolean,
    },
    [TypewriterAttrNames.FadeOutDelay]: {
      defaultValue: 500,
      validate: Booster.validation.isNumber,
      parse: Number,
    },
  },
  apply: (element, data) => {
    const strings: string[] = []

    element.childNodes.forEach((child) => {
      const string = child as HTMLElement

      if (string.innerHTML) strings.push(string.innerHTML.trim())
    })

    element.innerHTML = ''

    const typedOptions: TypedOptions = {
      backDelay: data.get(TypewriterAttrNames.BackDelay),
      backSpeed: data.get(TypewriterAttrNames.BackSpeed),
      cursorChar: data.get(TypewriterAttrNames.CursorChar),
      fadeOut: data.get(TypewriterAttrNames.FadeOut),
      fadeOutDelay: data.get(TypewriterAttrNames.FadeOutDelay),
      loop: data.get(TypewriterAttrNames.Loop),
      loopCount: data.get(TypewriterAttrNames.LoopCount),
      showCursor: data.get(TypewriterAttrNames.Cursor),
      shuffle: data.get(TypewriterAttrNames.Shuffle),
      smartBackspace: data.get(TypewriterAttrNames.SmartBackspace),
      startDelay: data.get(TypewriterAttrNames.StartDelay),
      typeSpeed: data.get(TypewriterAttrNames.TypeSpeed),
      strings,
    }

    new Typed(element, typedOptions)
  },
  title: 'Typewriter Booster',
  documentationLink: 'https://www.flowbase.co/booster/typewriter',
})

export const TypewriterFlowbase = () => typewriterBooster.init()
