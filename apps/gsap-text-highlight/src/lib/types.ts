export const highlightType = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const
export type TextHighlightType = (typeof highlightType)[number]

export const highlightDirection = ['both', 'forward'] as const
export type TextHighlightDirection = (typeof highlightDirection)[number]
