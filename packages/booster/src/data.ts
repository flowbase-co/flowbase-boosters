import type { BoosterRecord } from './types'

export class BoosterData<T extends BoosterRecord> {
  private data: Record<string, unknown> = {}

  set<K extends Extract<keyof T, string>>(key: K, value: T[K]) {
    this.data[key] = value
  }

  get<K extends Extract<keyof T, string>>(key: K) {
    return this.data[key] as T[K]
  }
}
