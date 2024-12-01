import { TextHighlightFlowbase } from './gsap-text-highlight'

document.readyState === 'complete'
  ? TextHighlightFlowbase()
  : window.addEventListener('load', TextHighlightFlowbase)
