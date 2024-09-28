interface Webflow {
  require<T = unknown>(name: string): T | undefined
  push(cb: void): void
}

declare global {
  interface WebflowIx2Module {
    init(): void
  }

  interface Window {
    Webflow?: Webflow
  }
}

export {}
