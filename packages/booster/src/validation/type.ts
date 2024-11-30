export const isValidType = <T extends readonly unknown[]>(
  value: unknown,
  values: T
): value is T[number] => values.includes(value as T[number])
