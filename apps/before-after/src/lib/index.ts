import { BeforeAfterFlowbase } from './before-after'

document.readyState === 'complete'
  ? BeforeAfterFlowbase()
  : window.addEventListener('load', BeforeAfterFlowbase)
