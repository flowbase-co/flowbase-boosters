import { TextRevealFlowbase } from './gsap-text-reveal'

document.readyState === 'complete'
  ? TextRevealFlowbase()
  : window.addEventListener('load', TextRevealFlowbase)
