import { CountdownFlowbase } from './countdown'

document.readyState === 'complete'
  ? CountdownFlowbase()
  : window.addEventListener('load', CountdownFlowbase)
