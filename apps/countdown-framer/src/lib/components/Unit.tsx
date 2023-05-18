import styled from '@emotion/styled'

export enum UnitValue {
  Days,
  Hours,
  Minutes,
  Seconds,
}

export enum UnitVariant {
  Full = 'full',
  Short = 'short',
}

export enum UnitPosition {
  Top = 'top',
  Right = 'right',
  Bottom = 'bottom',
  Left = 'left',
}

export interface Settings {
  show: boolean

  variant: UnitVariant
  position: UnitPosition

  gap: number

  fontName: string
  fontSize: number
  fontColor: string
  fontWeight: string
  uppercase: boolean
}

export interface Props extends Settings {
  value: UnitValue
}

const getUnit = (unit: UnitValue, variant: UnitVariant) => {
  if (variant === UnitVariant.Short) {
    switch (unit) {
      case UnitValue.Days:
        return 'D'
      case UnitValue.Hours:
        return 'H'
      case UnitValue.Minutes:
        return 'M'
      case UnitValue.Seconds:
        return 'S'
    }
  }

  switch (unit) {
    case UnitValue.Days:
      return 'Days'
    case UnitValue.Hours:
      return 'Hours'
    case UnitValue.Minutes:
      return 'Minutes'
    case UnitValue.Seconds:
      return 'Seconds'
  }
}

export const Unit: React.FC<Props> = (props) => {
  if (!props.show) return null

  return <Container {...props}>{getUnit(props.value, props.variant)}</Container>
}

const Container = styled.span<Props>`
  color: ${(p) => p.fontColor};
  font-family: ${(p) => p.fontName};
  font-weight: ${(p) => p.fontWeight};
  font-size: ${(p) => p.fontSize}px;
  text-transform: ${(p) => (p.uppercase ? 'uppercase' : 'auto')};
`
