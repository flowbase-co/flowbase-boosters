export const isValidCSSPropertyValue = (property: string, value: string) => {
  const exceptions = ['auto', 'initial', 'inherit', 'unset']

  if (exceptions.includes(value)) return false

  return CSS.supports(property, value)
}
