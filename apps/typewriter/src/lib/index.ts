import { TypewriterFlowbase } from './typewriter'

document.readyState === 'complete'
  ? TypewriterFlowbase()
  : window.addEventListener('load', TypewriterFlowbase)
