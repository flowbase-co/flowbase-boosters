import { TextHoverFlowbase } from './text-hover'

document.readyState === 'complete'
  ? TextHoverFlowbase()
  : window.addEventListener('load', TextHoverFlowbase)
