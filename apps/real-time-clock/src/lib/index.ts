import { RealTimeClockFlowbase } from './real-time-clock'

document.readyState === 'complete'
  ? RealTimeClockFlowbase()
  : window.addEventListener('load', RealTimeClockFlowbase)
