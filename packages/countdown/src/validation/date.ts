export const isValidDate = (value: string) => {
  if (!value) return false

  const date = new Date(value)

  return !isNaN(date.valueOf())
}
