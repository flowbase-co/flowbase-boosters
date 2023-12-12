import { TooltipFlowbase } from './tooltip'

document.readyState === 'complete'
  ? TooltipFlowbase()
  : window.addEventListener('load', TooltipFlowbase)
