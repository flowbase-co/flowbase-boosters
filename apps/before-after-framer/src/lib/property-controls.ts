import type { Props } from './BeforeAfter'

const isImagesSelected = (props: Props) => !props.left?.src || !props.right?.src

export const propertyControls = {
  left: {
    type: 'responsiveimage',
    title: 'Left Image',
  },
  right: {
    type: 'responsiveimage',
    title: 'Right Image',
    description:
      '[Flowbase](https://www.flowbase.co/) is the worlds largest component resource site. Explore endless components and templates to inspire your workflows and help you build better, faster.',
  },
  radius: {
    type: 'number',
    defaultValue: 0,
    min: 0,
    max: 999,
    step: 1,
    displayStepper: true,
    hidden: isImagesSelected,
  },
  bg: {
    type: 'color',
    title: 'Background',
    defaultValue: '#e4e6f1',
  },
  position: {
    type: 'number',
    defaultValue: 50,
    description: 'Starting position of the handle',
    min: 0,
    max: 100,
    step: 1,
    displayStepper: true,
    hidden: isImagesSelected,
  },
  customHandle: {
    type: 'boolean',
    defaultValue: false,
    hidden: isImagesSelected,
  },
  handle: {
    type: 'componentinstance',
    title: 'Handle',
    hidden: (p: Props) => {
      return isImagesSelected(p) || !p.customHandle
    },
  },
  label: {
    type: 'object',
    hidden: isImagesSelected,
    controls: {
      position: {
        type: 'enum',
        defaultValue: 'row',
        options: ['top', 'bottom'],
        optionTitles: ['Top', 'Bottom'],
      },
      x: {
        type: 'number',
        defaultValue: 24,
        min: 0,
        max: 999,
        step: 1,
        displayStepper: true,
      },
      y: {
        type: 'number',
        defaultValue: 24,
        min: 0,
        max: 999,
        step: 1,
        displayStepper: true,
      },
      before: {
        type: 'string',
        defaultValue: 'Before',
      },
      after: {
        type: 'string',
        defaultValue: 'After',
      },
    },
  },
  customLabel: {
    type: 'boolean',
    defaultValue: false,
    hidden: isImagesSelected,
  },
  leftLabel: {
    type: 'componentinstance',
    title: 'Left Label',
    hidden: (p: Props) => isImagesSelected(p) || !p.customLabel,
  },
  rightLabel: {
    type: 'componentinstance',
    title: 'Left Label',
    hidden: (p: Props) => isImagesSelected(p) || !p.customLabel,
  },
  line: {
    type: 'object',
    hidden: isImagesSelected,
    controls: {
      color: {
        type: 'color',
        defaultValue: 'rgba(255, 255, 255, 0.4)',
      },
      width: {
        type: 'number',
        defaultValue: 1,
        min: 0,
        max: 99,
        step: 1,
        displayStepper: true,
      },
    },
  },
}
