import counterUp from 'counterup2'

enum CountupAttrsNames {
  root = 'fb-count',
  time = 'fb-count-time',
  delay = 'fb-count-delay',
}

const defaultValues = {
  time: 1000,
  delay: 16,
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

const startCounterUp = (counter: HTMLElement) => {
  const time =
    Number(counter?.getAttribute(CountupAttrsNames.time)) || defaultValues.time
  const delay =
    Number(counter?.getAttribute(CountupAttrsNames.delay)) ||
    defaultValues.delay

  counterUp(counter, {
    duration: time,
    delay,
  })
}

export const CountupFlowbase = async () => {
  const counters = document.querySelectorAll<HTMLElement>(
    `[${CountupAttrsNames.root}]`
  )

  counters.forEach((counter) => observer.observe(counter))
}
