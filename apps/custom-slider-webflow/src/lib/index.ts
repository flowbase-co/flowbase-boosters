import { CustomSliderFlowbase } from './custom-slider'

document.readyState === 'complete'
  ? CustomSliderFlowbase()
  : window.addEventListener('load', CustomSliderFlowbase)
