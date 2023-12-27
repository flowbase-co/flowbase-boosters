import { BoosterData } from './data'

export type ValidateFn = (value: string) => boolean
export type Validate<T> = ValidateFn | T[]

export type BoosterRecord = Record<string, unknown>

export interface Attribute<T> {
  defaultValue: T
  validate?: Validate<T>
  parse?: (value: string) => T | undefined
}

export type Attributes<T extends BoosterRecord> = {
  [Key in keyof T]: Attribute<T[Key]>
}

export interface BoosterBase {
  log(message: string, data?: any): void
}

export interface BoosterOptions<T extends BoosterRecord, K = Element> {
  name: string
  attributes: Attributes<T>
  apply: (this: BoosterBase, el: K, data: BoosterData<T>) => void

  title: string
  documentationLink: string
}
