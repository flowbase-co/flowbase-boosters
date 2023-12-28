import { CookieFlowbase } from './cookie'

document.readyState === 'complete'
  ? CookieFlowbase()
  : window.addEventListener('load', CookieFlowbase)
