import { TextScrambleFlowbase } from './text-scramble'

document.readyState === 'complete'
  ? TextScrambleFlowbase()
  : window.addEventListener('load', TextScrambleFlowbase)
