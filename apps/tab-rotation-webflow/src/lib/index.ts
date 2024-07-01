import { TabRotationFlowbase } from './tab-rotation'

document.readyState === 'complete'
  ? TabRotationFlowbase()
  : window.addEventListener('load', TabRotationFlowbase)
