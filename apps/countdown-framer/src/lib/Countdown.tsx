import styled from '@emotion/styled'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Welcome } from './Welcome'

import {
  Unit,
  UnitValue,
  UnitPosition,
  type Settings as UnitProps,
} from './components/Unit'

export interface Props {
  countdown: string

  days: boolean
  hours: boolean
  minutes: boolean
  seconds: boolean

  unit: UnitProps

  gap: number

  fontName: string
  fontSize: number
  fontColor: string
  fontWeight: string

  finishedComponent?: React.ReactElement
}

interface Distance {
  days: string
  hours: string
  minutes: string
  seconds: string
}

const DAY = 1000 * 60 * 60 * 24
const HOUR = 1000 * 60 * 60
const MINUTE = 1000 * 60
const SECOND = 1000

const DEFAULT_DISTANCE: Distance = {
  days: '0',
  hours: '0',
  minutes: '0',
  seconds: '0',
}

const formatValue = (value: number) => String(value).padStart(2, '0')

export const Countdown: React.FC<Props> = (props) => {
  const [date, isValidDate] = useMemo(() => {
    const date = new Date(props.countdown)
    return [date.getTime(), !date || !isNaN(date.valueOf())]
  }, [props.countdown])

  const timer = useRef<NodeJS.Timer>()

  const clearTimer = () => {
    clearInterval(timer.current)
    timer.current = undefined
  }

  const [distance, setDistance] = useState<Distance | null>(DEFAULT_DISTANCE)

  const updateDistance = () => {
    const currentDate = new Date().getTime()
    const distance = date - currentDate

    if (distance < 0) {
      setDistance(props.finishedComponent ? null : DEFAULT_DISTANCE)
      return clearTimer()
    }

    setDistance({
      days: formatValue(Math.floor(distance / DAY)),
      hours: formatValue(Math.floor((distance % DAY) / HOUR)),
      minutes: formatValue(Math.floor((distance % HOUR) / MINUTE)),
      seconds: formatValue(Math.floor((distance % MINUTE) / SECOND)),
    })
  }

  useEffect(() => {
    if (timer.current) clearTimer()

    if (!isValidDate) return

    timer.current = setInterval(updateDistance, 1000)
    updateDistance()

    return clearTimer
  }, [date])

  if (distance === null) {
    return props.finishedComponent!
  }

  if (!date || !isValidDate) {
    return <Welcome text="Please provide correct date" />
  }

  return (
    <Container
      gap={props.gap}
      fontName={props.fontName}
      fontSize={props.fontSize}
      fontColor={props.fontColor}
      fontWeight={props.fontWeight}
    >
      {props.days && (
        <Value
          position={props.unit.position}
          gap={props.unit.gap}
          data-testid="days"
        >
          {distance.days}
          <Unit {...props.unit} value={UnitValue.Days} />
        </Value>
      )}
      {props.hours && (
        <Value position={props.unit.position} gap={props.unit.gap}>
          {distance.hours}
          <Unit {...props.unit} value={UnitValue.Hours} />
        </Value>
      )}
      {props.minutes && (
        <Value position={props.unit.position} gap={props.unit.gap}>
          {distance.minutes}
          <Unit {...props.unit} value={UnitValue.Minutes} />
        </Value>
      )}
      {props.seconds && (
        <Value position={props.unit.position} gap={props.unit.gap}>
          {distance.seconds}
          <Unit {...props.unit} value={UnitValue.Seconds} />
        </Value>
      )}
    </Container>
  )
}

const Container = styled.div<
  Pick<Props, 'gap' | 'fontName' | 'fontColor' | 'fontSize' | 'fontWeight'>
>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(p) => p.gap}px;

  color: ${(p) => p.fontColor};
  font-family: ${(p) => p.fontName};
  font-weight: ${(p) => p.fontWeight};
  font-size: ${(p) => p.fontSize}px;
`

const Value = styled.div<Pick<UnitProps, 'position' | 'gap'>>`
  display: flex;
  gap: ${(p) => p.gap}px;
  align-items: center;
  justify-content: center;

  flex-direction: ${(p) => {
    switch (p.position) {
      case UnitPosition.Right:
        return 'row'
      case UnitPosition.Left:
        return 'row-reverse'
      case UnitPosition.Bottom:
        return 'column'
      case UnitPosition.Top:
        return 'column-reverse'
    }
  }};
`
