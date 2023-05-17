declare global {
  interface Window {
    CountdownTimerFlowbase: (expiredDate: string, options: Options) => void
  }
}

export {}
