import counterUp from 'counterup2'

enum CountupAttrNames {
  Root = 'fb-count',
  Target = 'fb-count-target',
  Time = 'fb-count-time',
  Delay = 'fb-count-delay',
}

const defaultValues = {
  target: 1000,
  time: 1500,
  delay: 0,
}

const startCounterUp = (counter: HTMLElement) => {
  if (!counter) return

  const target =
    counter.getAttribute(CountupAttrNames.Target) || defaultValues.target
  const time = counter.hasAttribute(CountupAttrNames.Time)
    ? Number(counter.getAttribute(CountupAttrNames.Time))
    : defaultValues.time
  const delay = counter.hasAttribute(CountupAttrNames.Delay)
    ? Number(counter.getAttribute(CountupAttrNames.Delay))
    : defaultValues.delay

  const start = () => {
    counter.innerHTML = target.toString()

    counterUp(counter, {
      duration: time,
    })
  }

  delay ? setTimeout(start, delay) : start()
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        startCounterUp(entry.target as HTMLElement)
        observer.unobserve(entry.target)
      }
    })
  },
  { threshold: 1 }
)

export const CountupFlowbase = async () => {
  const counters = document.querySelectorAll<HTMLElement>(
    `[${CountupAttrNames.Root}]`
  )

  counters.forEach((counter) => observer.observe(counter))
}
