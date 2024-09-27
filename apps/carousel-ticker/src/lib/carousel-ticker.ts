import Booster from '@flowbase-co/booster'

enum CarouselTickerAttrNames {
  Root = 'fb-carousel',
  Delay = 'fb-carousel-delay',
  Direction = 'fb-carousel-direction',
  Overflow = 'fb-carousel-overflow',
  OverflowSize = 'fb-carousel-overflow-size',
  PauseOnHover = 'fb-carousel-pauseable',
  Speed = 'fb-carousel-speed',

  // Elements

  Content = 'fb-carousel-content',
}

enum CarouselTickerDirection {
  Left = 'left',
  Right = 'right',
  Top = 'top',
  Bottom = 'bottom',
}

type CarouselTickerAttributes = {
  [CarouselTickerAttrNames.Delay]: number
  [CarouselTickerAttrNames.Direction]: CarouselTickerDirection
  [CarouselTickerAttrNames.Overflow]: boolean
  [CarouselTickerAttrNames.OverflowSize]: number
  [CarouselTickerAttrNames.PauseOnHover]: boolean
  [CarouselTickerAttrNames.Speed]: number
}

const carouselTickerBooster = new Booster.Booster<
  CarouselTickerAttributes,
  HTMLElement
>({
  name: CarouselTickerAttrNames.Root,
  attributes: {
    [CarouselTickerAttrNames.Delay]: {
      defaultValue: 0,
      validate: Booster.validation.isNumber,
      parse: Number,
    },
    [CarouselTickerAttrNames.Direction]: {
      defaultValue: CarouselTickerDirection.Left,
      validate: Object.values(CarouselTickerDirection),
    },
    [CarouselTickerAttrNames.Overflow]: {
      defaultValue: false,
      validate: Booster.validation.isBoolean,
      parse: Booster.parse.stringToBoolean,
    },
    [CarouselTickerAttrNames.OverflowSize]: {
      defaultValue: 0,
      validate: Booster.validation.isNumber,
      parse: Number,
    },
    [CarouselTickerAttrNames.PauseOnHover]: {
      defaultValue: false,
      validate: Booster.validation.isBoolean,
      parse: Booster.parse.stringToBoolean,
    },
    [CarouselTickerAttrNames.Speed]: {
      defaultValue: 10000,
      validate: Booster.validation.isNumber,
      parse: Number,
    },
  },
  apply(element, data) {
    const contentEl = element.querySelector<HTMLElement>(
      `[${CarouselTickerAttrNames.Content}]`
    )

    if (!contentEl) return this.log('Required attribute is missing')

    // Content child elements

    const contentChildNodes: HTMLElement[] = []

    for (const el of Array.from(contentEl.childNodes)) {
      if (el instanceof HTMLElement) {
        el.style.flexShrink = '0'
        el.style.flexGrow = '0'
        el.style.willChange = 'transform'

        contentChildNodes.push(el)
      } else contentEl.removeChild(el)
    }

    if (!contentChildNodes.length) return

    // Direction

    const direction = data.get(CarouselTickerAttrNames.Direction)
    const isVertical =
      direction === CarouselTickerDirection.Top ||
      direction === CarouselTickerDirection.Bottom

    // Set styles

    element.style.overflow = data.get(CarouselTickerAttrNames.Overflow)
      ? 'visible'
      : 'hidden'

    contentEl.style.position = 'relative'
    contentEl.style.display = 'flex'
    contentEl.style.width = '100%'
    contentEl.style.height = '100%'
    contentEl.style.margin = '0'
    contentEl.style.padding = '0'
    contentEl.style.overflow = 'visible'
    contentEl.style.willChange = 'transform'
    contentEl.style.flexDirection = isVertical ? 'column' : 'row'

    // Calculate content child elements size

    const calcContentChildNodesSize = () => {
      const createChildEl = () => {
        const el = document.createElement('div')

        el.style.width = '0'
        el.style.height = '0'
        el.setAttribute('aria-hidden', 'true')

        return el
      }

      const firstChildEl = createChildEl()
      const lastChildEl = createChildEl()

      contentEl.prepend(firstChildEl)
      contentEl.append(lastChildEl)

      const offsetStart =
        firstChildEl.getBoundingClientRect()[isVertical ? 'top' : 'left']

      firstChildEl.remove()

      const size =
        lastChildEl.getBoundingClientRect()[isVertical ? 'top' : 'left'] -
        offsetStart

      lastChildEl.remove()

      return Number(size.toFixed(2))
    }

    const contentChildNodesSize = calcContentChildNodesSize()

    // Get initial element size

    const initialElBoundingRect = element.getBoundingClientRect()
    const initialElSize = {
      width: Number(initialElBoundingRect.width.toFixed(2)),
      height: Number(initialElBoundingRect.height.toFixed(2)),
    }

    // Calculate overflow offset

    const overflowSize = data.get(CarouselTickerAttrNames.OverflowSize)
    let overflowDuplicateCount = 0

    if (overflowSize) {
      overflowDuplicateCount = Math.ceil(overflowSize / contentChildNodesSize)

      const offset =
        -1 * (contentChildNodesSize * overflowDuplicateCount) + 'px'

      if (isVertical) {
        contentEl.style.top = offset
      } else {
        contentEl.style.left = offset
      }
    }

    // Duplicate content child elements

    const getDuplicateCount = () => {
      const { width, height } = element.getBoundingClientRect()
      const elSize = isVertical ? height : width

      return (
        Math.ceil(elSize / contentChildNodesSize) + overflowDuplicateCount * 2
      )
    }

    let duplicateCount = getDuplicateCount()

    const duplicateNodes = (count: number) => {
      const additionalNodes: HTMLElement[][] = Array(count).fill([])

      for (let index = 0; index < count; index++) {
        for (const node of contentChildNodes) {
          const clonedNode = node.cloneNode(true) as HTMLElement

          clonedNode.setAttribute('aria-hidden', 'true')

          additionalNodes[index].push(clonedNode)
        }
      }

      for (const node of additionalNodes.flat()) contentEl.appendChild(node)
    }

    duplicateNodes(duplicateCount)

    // If element size isn't specified, set fixed size

    const elBoundingRect = element.getBoundingClientRect()
    const elSize = {
      width: Number(elBoundingRect.width.toFixed(2)),
      height: Number(elBoundingRect.height.toFixed(2)),
    }

    if (isVertical) {
      if (elSize.height && elSize.height > initialElSize.height) {
        element.style.height = initialElSize.height + 'px'
      }
    } else {
      if (elSize.width && elSize.width > initialElSize.width) {
        element.style.width = initialElSize.width + 'px'
      }
    }

    // Create animation

    const translateDirection = isVertical ? 'Y' : 'X'
    const startPosition = 0
    const endPosition = -1 * contentChildNodesSize
    const reverse = direction === 'bottom' || direction === 'right'

    const keyframes = new KeyframeEffect(
      contentEl,
      [
        {
          transform: `translate${translateDirection}(${startPosition}px)`,
        },
        {
          transform: `translate${translateDirection}(${endPosition}px)`,
        },
      ],
      {
        delay: data.get(CarouselTickerAttrNames.Delay),
        duration: data.get(CarouselTickerAttrNames.Speed),
        direction: reverse ? 'reverse' : 'normal',
        easing: 'linear',
        iterations: Infinity,
      }
    )
    const animation = new Animation(keyframes)

    // Pause on hover

    if (data.get(CarouselTickerAttrNames.PauseOnHover)) {
      const onEnter = () => animation.pause()
      const onLeave = () => animation.play()

      element.addEventListener('mouseenter', onEnter, { passive: true })
      element.addEventListener('mouseleave', onLeave, { passive: true })

      element.addEventListener('touchstart', onEnter, { passive: true })
      element.addEventListener('touchend', onLeave, { passive: true })
      element.addEventListener('touchcancel', onLeave, { passive: true })
    }

    // Start animation

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            animation.play()
            intersectionObserver.disconnect()
            break
          }
        }
      },
      { threshold: isVertical ? 0.5 : 1 }
    )

    intersectionObserver.observe(element)

    // Add/remove content child elements if element size changed

    const resizeObserver = new ResizeObserver(() => {
      const newDuplicateCount = getDuplicateCount()

      if (newDuplicateCount !== duplicateCount) {
        if (newDuplicateCount < duplicateCount) {
          for (
            let i = 0;
            i < contentChildNodes.length * (duplicateCount - newDuplicateCount);
            i++
          ) {
            if (contentEl.lastElementChild) {
              contentEl.removeChild(contentEl.lastElementChild)
            }
          }
        } else {
          duplicateNodes(newDuplicateCount - duplicateCount)
        }

        duplicateCount = newDuplicateCount
      }
    })

    resizeObserver.observe(element)
  },
  title: 'Carousel Ticker Booster',
  documentationLink: 'https://www.flowbase.co/booster/carousel-ticker',
})

export const CarouselTickerFlowbase = () => carouselTickerBooster.init()
