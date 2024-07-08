import { AgeGateFlowbase } from './age-gate'

document.readyState === 'complete'
  ? AgeGateFlowbase()
  : window.addEventListener('load', AgeGateFlowbase)
