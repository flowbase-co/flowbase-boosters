import { UnitPosition, UnitVariant } from './components/Unit'

export const propertyControls = {
  countdown: {
    type: 'string',
    title: 'Countdown',
    defaultValue: 'May 18, 2030 14:42:59',
    description:
      '[Flowbase](https://www.flowbase.co/) is the worlds largest component resource site. Explore endless components and templates to inspire your workflows and help you build better, faster.',
  },

  days: {
    type: 'boolean',
    defaultValue: true,
  },
  hours: {
    type: 'boolean',
    defaultValue: true,
  },
  minutes: {
    type: 'boolean',
    defaultValue: true,
  },
  seconds: {
    type: 'boolean',
    defaultValue: true,
  },

  unit: {
    type: 'object',
    title: 'Unit',
    controls: {
      show: {
        type: 'boolean',
        defaultValue: true,
      },
      variant: {
        type: 'enum',
        defaultValue: UnitVariant.Full,
        options: Object.values(UnitVariant),
        optionTitles: Object.keys(UnitVariant),
      },
      position: {
        type: 'enum',
        defaultValue: UnitPosition.Right,
        options: Object.values(UnitPosition),
        optionTitles: Object.keys(UnitPosition),
      },
      gap: {
        type: 'number',
        defaultValue: 14,
        min: 0,
        max: 999,
        step: 1,
        displayStepper: true,
      },
      fontName: {
        type: 'string',
        defaultValue: 'Inter',
      },
      fontSize: {
        type: 'number',
        defaultValue: 20,
        min: 0,
        max: 999,
        step: 1,
        displayStepper: true,
      },
      fontColor: {
        type: 'color',
        defaultValue: '#75788A',
      },
      fontWeight: {
        type: 'number',
        defaultValue: 400,
        min: 100,
        max: 1000,
        step: 100,
        displayStepper: true,
      },
      uppercase: {
        type: 'boolean',
        defaultValue: false,
      },
    },
  },

  gap: {
    type: 'number',
    defaultValue: 14,
    min: 0,
    max: 999,
    step: 1,
    displayStepper: true,
  },

  fontName: {
    type: 'string',
    defaultValue: 'Inter',
  },
  fontSize: {
    type: 'number',
    defaultValue: 24,
    min: 0,
    max: 999,
    step: 1,
    displayStepper: true,
  },
  fontColor: {
    type: 'color',
    defaultValue: '#282636',
  },
  fontWeight: {
    type: 'number',
    defaultValue: 400,
    min: 100,
    max: 1000,
    step: 100,
    displayStepper: true,
  },

  finishedComponent: {
    type: 'componentinstance',
    title: 'Finished',
  },
}
