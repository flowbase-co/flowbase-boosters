enum TextScrambleAttrNames {
  Root = 'fb-scramble',
  Trigger = 'fb-scramble-trigger',
  Type = 'fb-scramble-type',
  Speed = 'fb-scramble-speed',
  Count = 'fb-scramble-count',
}

enum TextScrambleTrigger {
  Hover = 'hover',
  View = 'view',
}

enum TextScrambleType {
  All = 'all',
  Forward = 'forward',
}

const defaultValues = {
  trigger: TextScrambleTrigger.Hover,
  type: TextScrambleType.Forward,
}

const randomNumber = (max: number) => Math.floor(Math.random() * max)
const randomChar = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const signs = '<>[]()/:;.-_?!%$*+=#&@'
  const space = ' '

  const chars = [...alphabet.split(''), ...signs.split(''), space]

  return chars[randomNumber(chars.length)]
}

class TextScramble {
  element: HTMLElement
  originalTextContent: string
  interval?: NodeJS.Timer
  type: string

  constructor(element: HTMLElement) {
    this.element = element
    this.originalTextContent = this.element.textContent?.trim() || ''
    this.interval
    this.type =
      element.getAttribute(TextScrambleAttrNames.Type) || defaultValues.type
  }

  get speed() {
    const speed = Number(this.element.getAttribute(TextScrambleAttrNames.Speed))

    if (speed) return speed

    return this.type === TextScrambleType.All ? 60 : 20
  }

  get count() {
    const count = Number(this.element.getAttribute(TextScrambleAttrNames.Count))

    if (count) return count

    return this.type === TextScrambleType.All ? 15 : 5
  }

  scrambleAll() {
    const text = this.originalTextContent.split('')
    let iteration = 0

    this.interval = setInterval(() => {
      if (iteration >= this.count) {
        this.unscramble()

        return
      }

      text.map((_, idx) => (text[idx] = randomChar()))
      iteration += 1

      this.element.textContent = text.join('')
    }, this.speed)
  }

  scrambleForward() {
    const text = this.originalTextContent.split('')
    let letterPosition = 0
    let iteration = 0

    this.interval = setInterval(() => {
      if (letterPosition >= this.originalTextContent.length) {
        this.unscramble()

        return
      }

      if (iteration >= this.count) {
        text[letterPosition] = this.originalTextContent[letterPosition]
        letterPosition += 1
        iteration = 0
      } else {
        text[letterPosition] = randomChar()
        iteration += 1
      }

      this.element.textContent = text.join('')
    }, this.speed)
  }

  scramble() {
    if (!this.originalTextContent) return

    if (this.type === TextScrambleType.All) this.scrambleAll()
    if (this.type === TextScrambleType.Forward) this.scrambleForward()
  }

  unscramble() {
    this.element.textContent = this.originalTextContent

    if (this.interval) clearInterval(this.interval)
  }
}

const scrambleOnView = (element: HTMLElement) => {
  new TextScramble(element).scramble()
}

const scrambleOnHover = (element: HTMLElement) => {
  const textScrambleClass = new TextScramble(element)

  element.addEventListener('mouseover', () => textScrambleClass.scramble())
  element.addEventListener('mouseleave', () => textScrambleClass.unscramble())
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        scrambleOnView(entry.target as HTMLElement)
        observer.unobserve(entry.target)
      }
    })
  },
  { threshold: 1 }
)

export const TextScrambleFlowbase = async () => {
  const elements = document.querySelectorAll<HTMLElement>(
    `[${TextScrambleAttrNames.Root}]`
  )

  elements.forEach((element) => {
    if (!element.textContent) return

    const trigger =
      element.getAttribute(TextScrambleAttrNames.Trigger) ||
      defaultValues.trigger

    if (trigger === TextScrambleTrigger.View) observer.observe(element)
    if (trigger === TextScrambleTrigger.Hover) scrambleOnHover(element)
  })
}
