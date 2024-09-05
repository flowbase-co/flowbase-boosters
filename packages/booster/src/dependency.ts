declare global {
  interface Window {
    FlowbaseBoosters?: {
      deps?: Dependencies
    }
  }
}

interface Dependency<T> {
  name: string
  version: string
  get: () => T
}

interface Await {
  name: string
  version: string
  resolve: (value: unknown | PromiseLike<unknown>) => void
}

export class Dependencies {
  private dependencies: Dependency<unknown>[] = []
  private await: Await[] = []

  static init() {
    if (!window.hasOwnProperty('FlowbaseBoosters')) {
      window.FlowbaseBoosters = {}
    }

    if (!window.FlowbaseBoosters!.hasOwnProperty('deps')) {
      window.FlowbaseBoosters!.deps = new Dependencies()
    }

    return window.FlowbaseBoosters!.deps!
  }

  register(dep: Dependency<unknown>) {
    this.dependencies.push(dep)

    const dependency = dep.get()

    for (const awaiter of this.await) {
      if (awaiter.name === dep.name && awaiter.version === dep.version) {
        awaiter.resolve(dependency)
      }
    }
  }

  get<T>(name: string, version: string): Promise<T> {
    return new Promise((resolve, reject) => {
      const dep = this.dependencies.find(
        (dep) => name === dep.name && version === dep.version
      )

      if (!dep) {
        setTimeout(() => {
          // TODO: remove from awaiters list
          reject()
        }, 15000)

        this.await.push({
          name,
          version,
          resolve: (d: unknown) => resolve(d as T),
        })
      }

      if (dep) resolve(dep.get() as T)
    })
  }
}
