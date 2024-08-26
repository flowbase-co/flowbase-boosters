import Booster from '@flowbase-co/booster'

enum TabRotationAttrNames {
  Root = 'fb-tabs',
  Speed = 'fb-tabs-speed',
  PauseOnHover = 'fb-tabs-pauseable',
  Progress = 'fb-tabs-progress',
}

type TabRotationAttributes = {
  [TabRotationAttrNames.PauseOnHover]: boolean
  [TabRotationAttrNames.Progress]: boolean
  [TabRotationAttrNames.Speed]: number
}

const TAB_PROGRESS_VAR = '--fb-tab-progress'

class ControlledTimeout {
  remaining: number
  start: number
  intervalId?: number
  timerId?: number

  constructor(
    private cb: () => void,
    private delay: number,
    private tick?: (progress: number) => void
  ) {
    this.remaining = delay
    this.start = 0
  }

  clear() {
    clearInterval(this.intervalId)
    clearTimeout(this.timerId)
    this.intervalId = undefined
    this.timerId = undefined
  }

  reset() {
    this.clear()
    this.remaining = this.delay
    this.start = 0
  }

  pause() {
    if (!this.start) return

    this.remaining -= Date.now() - this.start
    this.start = 0
    this.clear()
  }

  resume() {
    if (this.timerId) return

    this.timerId = setTimeout(() => this.cb(), this.remaining)

    if (this.tick) {
      this.start = Date.now()
      this.intervalId = setInterval(() => {
        const end = this.start + this.remaining - Date.now()
        const progress = Math.ceil(((this.delay - end) * 100) / this.delay)

        this.tick!(progress)
      }, 1)
    }
  }
}

const tabRotationBooster = new Booster.Booster<
  TabRotationAttributes,
  HTMLElement
>({
  name: TabRotationAttrNames.Root,
  attributes: {
    [TabRotationAttrNames.PauseOnHover]: {
      defaultValue: false,
      validate: Booster.validation.isBoolean,
      parse: Booster.parse.stringToBoolean,
    },
    [TabRotationAttrNames.Progress]: {
      defaultValue: false,
      validate: Booster.validation.isBoolean,
      parse: Booster.parse.stringToBoolean,
    },
    [TabRotationAttrNames.Speed]: {
      defaultValue: 5000,
      validate: Booster.validation.isNumber,
      parse: Number,
    },
  },
  apply(element, data) {
    const tabElements = Array.from(
      element.querySelectorAll<HTMLLinkElement>('.w-tab-link')
    )

    if (!tabElements.length) return this.log('Required attribute is missing')

    const speed = data.get(TabRotationAttrNames.Speed)
    const isProgressOn = data.get(TabRotationAttrNames.Progress)

    let activeTabEl = tabElements.find((el) =>
      el.classList.contains('w--current')
    )

    const rotateTab = () => {
      if (!activeTabEl) return

      const currentTabIndex = tabElements.indexOf(activeTabEl)
      let nextTabIndex = currentTabIndex + 1

      if (nextTabIndex > tabElements.length - 1) nextTabIndex = 0

      const nextTabEl = tabElements[nextTabIndex]

      // Remove href to prevent scrolling to tab
      const href = nextTabEl.href

      nextTabEl.removeAttribute('href')
      nextTabEl.click()
      activeTabEl = nextTabEl

      if (href) nextTabEl.href = href
    }
    const updateTabProgress = (progress: number) => {
      requestAnimationFrame(
        () => activeTabEl?.style.setProperty(TAB_PROGRESS_VAR, progress + '%')
      )
    }

    const rotation = new ControlledTimeout(
      rotateTab,
      speed,
      isProgressOn ? updateTabProgress : undefined
    )

    const onTabClick = (tabEl: HTMLLinkElement) => {
      if (tabEl !== activeTabEl) {
        if (isProgressOn) activeTabEl?.style.removeProperty(TAB_PROGRESS_VAR)

        activeTabEl = tabEl
      }

      rotation.reset()
      rotation.resume()
    }

    tabElements.forEach((tabEl) => {
      tabEl.addEventListener(
        'click',
        (event) => {
          // Prevent closing other elements
          if (!event.isTrusted) event.stopPropagation()

          onTabClick(tabEl)
        },
        { passive: true }
      )
      tabEl.addEventListener(
        'focus',
        () => {
          if (tabEl === activeTabEl) return

          onTabClick(tabEl)
        },
        { passive: true }
      )
    })

    if (data.get(TabRotationAttrNames.PauseOnHover)) {
      const onEnter = () => rotation.pause()
      const onLeave = () => rotation.resume()

      element.addEventListener('mouseenter', onEnter, { passive: true })
      element.addEventListener('mouseleave', onLeave, { passive: true })

      element.addEventListener('touchstart', onEnter, { passive: true })
      element.addEventListener('touchend', onLeave, { passive: true })
      element.addEventListener('touchcancel', onLeave, { passive: true })
    }

    if (activeTabEl) rotation.resume()
  },
  title: 'Auto Tab Rotation Booster',
  documentationLink:
    'https://www.flowbase.co/booster/webflow-auto-tab-rotation',
})

export const TabRotationFlowbase = () => tabRotationBooster.init()
