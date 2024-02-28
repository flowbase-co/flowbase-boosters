import { SocialShareFlowbase } from './social-share'

document.readyState === 'complete'
  ? SocialShareFlowbase()
  : window.addEventListener('load', SocialShareFlowbase)
