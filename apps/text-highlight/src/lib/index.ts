import { TextHighlightFlowbase } from './text-highlight'

document.readyState === 'complete'
  ? TextHighlightFlowbase()
  : window.addEventListener('load', TextHighlightFlowbase)
