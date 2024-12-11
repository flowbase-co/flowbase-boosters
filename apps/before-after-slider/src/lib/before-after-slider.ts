import Booster from '@flowbase-co/booster'

enum BeforeAfterAttrNames {
  Root = 'fb-before-after',
  Direction = 'fb-before-after-direction',
  StartPosition = 'fb-before-after-start',

  // Elements

  Handle = 'fb-before-after-handle',
  Label = 'fb-before-after-label',
  Line = 'fb-before-after-line',
  Side = 'fb-before-after-side',

  // Internal

  Input = 'fb-before-after-input',
}

enum BeforeAfterDirection {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

enum BeforeAfterSide {
  Before = 'before',
  After = 'after',
}

type BeforeAfterAttributes = {
  [BeforeAfterAttrNames.Direction]: BeforeAfterDirection
  [BeforeAfterAttrNames.StartPosition]: number
}

const beforeAfterSliderBooster = new Booster.Booster<
  BeforeAfterAttributes,
  HTMLElement
>({
  name: BeforeAfterAttrNames.Root,
  attributes: {
    [BeforeAfterAttrNames.Direction]: {
      defaultValue: BeforeAfterDirection.Horizontal,
      validate: Object.values(BeforeAfterDirection),
    },
    [BeforeAfterAttrNames.StartPosition]: {
      defaultValue: 50,
      validate: (value) => {
        if (!Booster.validation.isNumber(value)) return false

        const numValue = Number(value)

        return numValue >= 0 && numValue <= 100
      },
      parse: Number,
    },
  },
  apply(element, data) {
    const afterEl = element.querySelector<HTMLElement>(
      `[${BeforeAfterAttrNames.Side}=${BeforeAfterSide.After}]`
    )

    if (!afterEl)
      return this.log(
        `Required attribute "${BeforeAfterAttrNames.Side}" is missing`
      )

    let handleEl = element.querySelector<HTMLElement>(
      `[${BeforeAfterAttrNames.Handle}]`
    )

    if (!handleEl) {
      handleEl = document.createElement('div')
      handleEl.setAttribute(BeforeAfterAttrNames.Handle, '')
      element.appendChild(handleEl)
    }

    const lineEl = element.querySelector<HTMLElement>(
      `[${BeforeAfterAttrNames.Line}]`
    )

    const direction = data.get(BeforeAfterAttrNames.Direction)
    const startPosition = data.get(BeforeAfterAttrNames.StartPosition)

    const setStyles = () => {
      element.style.position = 'relative'
      element.style.overflow = 'hidden'

      afterEl.style.position = 'absolute'
      afterEl.style.inset = '0'
      afterEl.style.zIndex = '1'
      afterEl.style.width = '100%'
      afterEl.style.height = '100%'
      afterEl.style.opacity = '1'

      handleEl.style.position = 'absolute'
      handleEl.style.zIndex = '2'
      handleEl.style.transform = 'translate(-50%, -50%)'
      handleEl.style.pointerEvents = 'none'
      handleEl.style.opacity = '1'

      if (lineEl) lineEl.style.opacity = '1'

      switch (direction) {
        case BeforeAfterDirection.Horizontal:
          handleEl.style.top = '50%'

          if (lineEl) {
            lineEl.style.left = 'var(--fb-thumb-position, 50%)'
            lineEl.style.transform = 'translateX(-50%)'
          }

          break
        case BeforeAfterDirection.Vertical:
          handleEl.style.left = '50%'

          if (lineEl) {
            lineEl.style.top = 'var(--fb-thumb-position, 50%)'
            lineEl.style.transform = 'translateY(-50%)'
          }

          break
      }
    }

    setStyles()

    const createInputEl = () => {
      const inputEl = document.createElement('input')

      inputEl.setAttribute(BeforeAfterAttrNames.Input, '')
      inputEl.type = 'range'
      inputEl.max = '100'
      inputEl.min = '0'

      element.insertBefore(inputEl, handleEl)

      inputEl.style.position = 'absolute'
      inputEl.style.inset = '0'
      inputEl.style.zIndex = '2'
      inputEl.style.margin = '0'
      inputEl.style.opacity = '0'
      inputEl.style.cursor = 'pointer'

      return inputEl
    }

    const inputEl = createInputEl()

    const initThumbSize = () => {
      element.style.setProperty('--fb-thumb-width', `${handleEl.clientWidth}px`)
      element.style.setProperty(
        '--fb-thumb-height',
        `${handleEl.clientHeight}px`
      )
    }

    const setPosition = (value: number) => {
      element.style.setProperty('--fb-thumb-position', `${value}%`)

      switch (direction) {
        case BeforeAfterDirection.Horizontal:
          afterEl.style.clipPath = `inset(0 0 0 ${value}%)`
          handleEl.style.left = `${value}%`
          break
        case BeforeAfterDirection.Vertical:
          afterEl.style.clipPath = `inset(${value}% 0 0)`
          handleEl.style.top = `${value}%`
          break
      }
    }

    const setInputPosition = (value: number) => {
      inputEl.value = value.toString()
    }

    const onInput = (event: Event) => {
      setPosition(+(event.target as HTMLInputElement).value)
    }

    setStyles()
    initThumbSize()
    setPosition(startPosition)
    setInputPosition(startPosition)

    inputEl.addEventListener('input', onInput)

    // Labels

    const initLabels = () => {
      const labelElements = Array.from(
        element.querySelectorAll<HTMLElement>(`[${BeforeAfterAttrNames.Label}]`)
      )

      if (!labelElements.length) return

      const beforeLabels: HTMLElement[] = []
      const afterLabels: HTMLElement[] = []

      for (const labelEl of labelElements) {
        const rawValue = labelEl.getAttribute(BeforeAfterAttrNames.Label)
        const attrValue = rawValue as BeforeAfterSide

        if (Object.values(BeforeAfterSide).includes(attrValue)) {
          if (attrValue === BeforeAfterSide.Before) beforeLabels.push(labelEl)
          if (attrValue === BeforeAfterSide.After) afterLabels.push(labelEl)
        } else {
          this.log(
            `Invalid value "${rawValue}" for attribute "${BeforeAfterAttrNames.Label}"`,
            [
              '%cPossible values:%c\n' +
                Object.values(BeforeAfterSide)
                  .map((value) => `• ${value}`)
                  .join('\n'),
              'font-weight: 700;',
              'font-weight: initial;',
            ]
          )
        }
      }

      if (!beforeLabels.length && !afterLabels.length) return

      for (const labelEl of [...beforeLabels, ...afterLabels]) {
        labelEl.style.position = 'absolute'
        labelEl.style.zIndex = '3'
      }

      return { before: beforeLabels, after: afterLabels }
    }

    const labels = initLabels()

    if (labels) {
      const enableAnimation = () => {
        afterEl.style.transition = 'clip-path 0.3s'
        handleEl.style.transition = 'top 0.3s, left 0.3s'
      }
      const disableAnimation = () => {
        afterEl.style.transition = ''
        handleEl.style.transition = ''
      }

      const onClickLabel = (side: BeforeAfterSide) => {
        enableAnimation()

        switch (side) {
          case BeforeAfterSide.Before:
            setPosition(100)
            setInputPosition(100)
            break
          case BeforeAfterSide.After:
            setPosition(0)
            setInputPosition(0)
            break
        }

        setTimeout(disableAnimation, 300)
      }

      for (const labelEl of labels.before) {
        labelEl.addEventListener('click', () =>
          onClickLabel(BeforeAfterSide.Before)
        )
      }
      for (const labelEl of labels.after) {
        labelEl.addEventListener('click', () =>
          onClickLabel(BeforeAfterSide.After)
        )
      }
    }

    // Vertical direction. Input styles

    if (direction === BeforeAfterDirection.Vertical) {
      inputEl.style.transform = 'rotate(90deg)'

      const updateInputStyles = (entry: ResizeObserverEntry) => {
        let { width, height } = entry.contentRect

        width = Number(width.toFixed(2))
        height = Number(height.toFixed(2))

        inputEl.style.width = `${height}px`
        inputEl.style.height = `${width}px`

        const offset = Number(((height - width) / 2).toFixed(2))

        inputEl.style.top = `${offset}px`
        inputEl.style.left = `${offset * -1}px`
      }

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) updateInputStyles(entry)
      })

      resizeObserver.observe(element)
    }
  },
  title: 'Before After Slider Booster',
  documentationLink: 'https://www.flowbase.co/booster/before-after-slider',
})

export const BeforeAfterSliderFlowbase = () => {
  // Global styles
  const style = document.createElement('style')

  style.textContent = `
    [${BeforeAfterAttrNames.Input}]::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: var(--fb-thumb-width, 40px);
        height: var(--fb-thumb-height, 40px);
    }
    [${BeforeAfterAttrNames.Input}]::-moz-range-thumb {
        -webkit-appearance: none;
        width: var(--fb-thumb-width, 40px);
        height: var(--fb-thumb-height, 40px);
    }
  `
  document.head.appendChild(style)

  beforeAfterSliderBooster.init()
}
