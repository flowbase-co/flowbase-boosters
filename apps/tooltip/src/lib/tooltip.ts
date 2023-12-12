import tippy, { Props, roundArrow } from 'tippy.js'
import 'tippy.js/dist/tippy.css'

import 'tippy.js/themes/translucent.css'
import 'tippy.js/themes/material.css'
import 'tippy.js/themes/light.css'

import 'tippy.js/animations/shift-toward.css'
import 'tippy.js/animations/perspective.css'
import 'tippy.js/animations/shift-away.css'
import 'tippy.js/animations/scale.css'

import 'tippy.js/dist/svg-arrow.css'

import Booster from '@flowbase-co/booster'

enum TooltipAttrNames {
  Root = 'fb-tooltip',
  Animation = 'fb-tooltip-animation',
  Arrow = 'fb-tooltip-arrow',
  Message = 'fb-tooltip-message',
  Position = 'fb-tooltip-position',
  ShowDelay = 'fb-tooltip-show-delay',
  Theme = 'fb-tooltip-theme',
  Trigger = 'fb-tooltip-trigger',
}

enum TooltipAnimation {
  Perspective = 'perspective',
  Scale = 'scale',
  ShiftAway = 'shift-away',
  ShiftToward = 'shift-toward',
}

enum TooltipArrowStyle {
  Rounded = 'rounded',
  Sharp = 'sharp',
}

enum TooltipPosition {
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right',
  Top = 'top',
}

enum TooltipTheme {
  Dark = 'dark',
  Light = 'light',
  Material = 'material',
  Translucence = 'translucence',
}

enum TooltipTrigger {
  Click = 'click',
  Hover = 'hover',
}

type TooltipAttributes = {
  [TooltipAttrNames.Animation]: TooltipAnimation
  [TooltipAttrNames.Arrow]: TooltipArrowStyle | undefined
  [TooltipAttrNames.Message]: string
  [TooltipAttrNames.Position]: TooltipPosition
  [TooltipAttrNames.ShowDelay]: number
  [TooltipAttrNames.Theme]: TooltipTheme
  [TooltipAttrNames.Trigger]: TooltipTrigger
}

const tooltipBooster = new Booster.Booster<TooltipAttributes, Element>({
  name: TooltipAttrNames.Root,
  attributes: {
    [TooltipAttrNames.Animation]: {
      defaultValue: TooltipAnimation.ShiftAway,
      validate: Object.values(TooltipAnimation),
    },
    [TooltipAttrNames.Arrow]: {
      defaultValue: undefined,
      validate: Object.values(TooltipArrowStyle),
    },
    [TooltipAttrNames.Message]: {
      defaultValue: '',
    },
    [TooltipAttrNames.Position]: {
      defaultValue: TooltipPosition.Top,
      validate: Object.values(TooltipPosition),
    },
    [TooltipAttrNames.ShowDelay]: {
      defaultValue: 0,
      validate: Booster.validation.isNumber,
      parse: Number,
    },
    [TooltipAttrNames.Theme]: {
      defaultValue: TooltipTheme.Dark,
      validate: Object.values(TooltipTheme),
    },
    [TooltipAttrNames.Trigger]: {
      defaultValue: TooltipTrigger.Hover,
      validate: Object.values(TooltipTrigger),
    },
  },
  apply: (element, data) => {
    const content = data.get(TooltipAttrNames.Message)

    if (!content) return

    const tippyOptions: Partial<Props> = {
      animation: data.get(TooltipAttrNames.Animation),
      content,
      delay: [data.get(TooltipAttrNames.ShowDelay), null],
      placement: data.get(TooltipAttrNames.Position),
    }

    switch (data.get(TooltipAttrNames.Arrow)) {
      case TooltipArrowStyle.Rounded:
        tippyOptions.arrow = roundArrow
        break
      case TooltipArrowStyle.Sharp:
        tippyOptions.arrow = true
        break
      default:
        tippyOptions.arrow = false
    }

    const theme = data.get(TooltipAttrNames.Theme)

    tippyOptions.theme = theme === TooltipTheme.Dark ? '' : theme

    const trigger = data.get(TooltipAttrNames.Trigger)

    tippyOptions.trigger =
      trigger === TooltipTrigger.Hover ? 'mouseenter' : trigger

    tippy(element, tippyOptions)
  },
  title: 'Tooltips Booster',
  documentationLink: 'https://www.flowbase.co/booster/tooltips',
})

export const TooltipFlowbase = () => tooltipBooster.init()
