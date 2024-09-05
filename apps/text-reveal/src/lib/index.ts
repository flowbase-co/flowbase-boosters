import { TextRevealFlowbase } from './text-reveal'

document.readyState === 'complete'
  ? TextRevealFlowbase()
  : window.addEventListener('load', TextRevealFlowbase)
