import { useState } from 'react'
import { Countdown, type Props } from './lib/Countdown'
import { UnitVariant, UnitPosition } from './lib/components/Unit'

const settings: Props = {
  countdown: 'December 31, 2025 23:59:59',

  days: true,
  hours: true,
  minutes: true,
  seconds: true,

  unit: {
    show: true,
    variant: UnitVariant.Full,
    position: UnitPosition.Left,
    gap: 14,
    fontName: 'Inter',
    fontSize: 18,
    fontColor: '#75788A',
    fontWeight: '400',
    uppercase: true,
  },

  gap: 14,

  fontName: 'Inter',
  fontSize: 24,
  fontColor: '#282636',
  fontWeight: '400',
}

export default () => {
  const [countdown, setCountdown] = useState('December 31, 202x5 23:59:59')

  return (
    <>
      <Countdown {...settings} countdown={countdown} />
      <button onClick={() => setCountdown('December 31, 2023 23:59:59')}>
        Click
      </button>
    </>
  )
}
