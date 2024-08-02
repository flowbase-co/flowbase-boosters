import Booster from '@flowbase-co/booster'

enum TabRotationAttrNames {
  Root = 'fb-tabs',
  Speed = 'fb-tabs-speed',
}

type TabRotationAttributes = {
  [TabRotationAttrNames.Speed]: number
}

const controlledTimeout = (cb: () => void, delay: number) => {
  let timerId: number | undefined

  let start: number
  let remaining: number = delay

  const clearTimeout = () => {
    window.clearTimeout(timerId)
    timerId = undefined
  }

  const pause = () => {
    if (!start) return

    clearTimeout()
    remaining -= Date.now() - start
  }

  const resume = () => {
    start = Date.now()
    clearTimeout()
    timerId = window.setTimeout(() => {
      clearTimeout()
      cb()
    }, remaining)
  }

  const isPending = () => Boolean(timerId)

  return {
    pause,
    resume,
    isPending,
    start: resume,
    clear: clearTimeout,
  }
}

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min
}

class ControlledTimeout {
  timerId?: number
  intervalId?: number
  start?: number
  remaining: number

  constructor(
    private cb: () => void,
    private tick: (progress: number) => void,
    private delay: number
  ) {
    this.remaining = delay
  }

  clearTimeout() {
    window.clearTimeout(this.timerId)
    window.clearInterval(this.intervalId)
    this.timerId = undefined
    this.intervalId = undefined
  }

  reset() {
    this.clearTimeout()
    this.start = undefined
    this.remaining = this.delay
  }

  pause() {
    if (!this.start) return

    this.clearTimeout()
    this.remaining -= Date.now() - this.start
  }

  resume() {
    if (this.timerId) return

    this.start = Date.now()
    this.clearTimeout()

    this.timerId = window.setTimeout(() => {
      this.reset()
      this.cb()
    }, this.remaining)
    this.intervalId = window.setInterval(() => {
      const progress = Math.ceil(
        ((Date.now() - this.start!) * 100) / this.delay
      )
      this.tick(progress)
    }, 1)
  }

  isPending() {
    return Boolean(this.timerId)
  }
}
//
// class Tab {
//   timeout: ControlledTimeout
//   active: boolean
//
//   constructor(private el: HTMLElement) {
//     this.timeout = new ControlledTimeout(() => {}, 3000)
//     this.active = this.isActive()
//   }
//
//   isActive() {
//     return this.el.classList.contains('w--current')
//   }
// }

const tabRotationBooster = new Booster.Booster<
  TabRotationAttributes,
  HTMLElement
>({
  name: TabRotationAttrNames.Root,
  attributes: {
    [TabRotationAttrNames.Speed]: {
      defaultValue: 5000,
      validate: Booster.validation.isNumber,
      parse: Number,
    },
  },
  apply(element, data) {
    const tabElements = element.querySelectorAll<HTMLLinkElement>('.w-tab-link')

    if (!tabElements.length) return this.log('Required attribute is missing')

    // const speed = data.get(TabRotationAttrNames.Speed)
    const speed = 5000

    const getActiveTabEl = () =>
      Array.from(tabElements).find((el) => el.classList.contains('w--current'))!

    let activeTabEl = getActiveTabEl()

    const timeout = new ControlledTimeout(
      () => {
        activeTabEl.style.removeProperty('--tab-progress')

        const currentTabIndex = Array.from(tabElements).findIndex((el) =>
          el.classList.contains('w--current')
        )
        let nextTabIndex = currentTabIndex + 1
        if (nextTabIndex > tabElements.length - 1) nextTabIndex = 0
        const nextTabEl = tabElements[nextTabIndex]

        nextTabEl.click()

        activeTabEl = nextTabEl
        timeout.resume()
      },
      (progress) => {
        window.requestAnimationFrame(() => {
          activeTabEl.style.setProperty('--tab-progress', progress + '%')
        })
      },
      speed
    )

    timeout.resume()

    const onTabClick = (event: MouseEvent) => {
      timeout.reset()
      activeTabEl.style.removeProperty('--tab-progress')

      activeTabEl = getActiveTabEl()
      timeout.resume()
    }

    const onMouseOverTab = (event: MouseEvent) => {
      timeout.pause()
    }

    const onMouseLeave = (event: MouseEvent) => {
      timeout.resume()
    }

    element.addEventListener('mouseenter', onMouseOverTab)
    element.addEventListener('mouseleave', onMouseLeave)

    tabElements.forEach((el) => {
      el.addEventListener('click', onTabClick)
    })

    //
    // console.log(tabElements)
    //
    // const tabs: Tab[] = []
    //
    // for (const el of Array.from(tabElements)) {
    //   tabs.push(new Tab(el))
    // }
    //
    // console.log(tabs)

    // const rotateTab = () => {
    //
    // }

    // let timeout: ReturnType<typeof setTimeout>
    //
    // const rotateTab = () => {
    //   timeout = setTimeout(() => {
    //     const currentTabIndex = Array.from(tabElements).findIndex((el) =>
    //       el.classList.contains('w--current')
    //     )
    //     let nextTabIndex = currentTabIndex + 1
    //     if (nextTabIndex > tabElements.length - 1) nextTabIndex = 0
    //     const nextTabEl = tabElements[nextTabIndex]
    //     if (nextTabEl) {
    //       const href = nextTabEl.href
    //       // Prevent scrolling to tab
    //       nextTabEl.removeAttribute('href')
    //       nextTabEl.click()
    //       if (href) nextTabEl.href = href
    //     }
    //   }, speed)
    // }
    //
    // tabElements.forEach((el) => {
    //   el.addEventListener('click', (event: Event) => {
    //     // Prevent closing other elements
    //     if (!event.isTrusted) event.stopPropagation()
    //
    //     clearTimeout(timeout)
    //     rotateTab()
    //   })
    //   el.addEventListener('keydown', (event: Event) => {
    //     clearTimeout(timeout)
    //     rotateTab()
    //   })
    // })
    //
    // element.addEventListener('pointerenter', () => {
    //   console.log('pointerenter')
    //   // timer.pause()
    // })
    // element.addEventListener('pointerleave', () => {
    //   console.log('pointerleave')
    //   // timer.resume()
    // })
    //
    // rotateTab()
  },
  title: 'Auto Tab Rotation Booster',
  documentationLink:
    'https://www.flowbase.co/booster/webflow-auto-tab-rotation',
})

export const TabRotationFlowbase = () => tabRotationBooster.init()
