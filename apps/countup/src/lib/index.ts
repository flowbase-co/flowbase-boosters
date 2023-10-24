import { CountupFlowbase } from './countup'

document.readyState === 'complete'
  ? CountupFlowbase()
  : window.addEventListener('load', CountupFlowbase)
