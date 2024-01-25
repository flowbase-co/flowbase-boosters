import { CountdownFlowbase } from './countdown'

export * from './types'

document.readyState === 'complete'
  ? CountdownFlowbase()
  : window.addEventListener('load', CountdownFlowbase)
