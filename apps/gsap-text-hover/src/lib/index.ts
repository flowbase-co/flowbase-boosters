import { TextHoverFlowbase } from './gsap-text-hover'

document.readyState === 'complete'
  ? TextHoverFlowbase()
  : window.addEventListener('load', TextHoverFlowbase)
