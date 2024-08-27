import { PasswordVisibilityControlFlowbase } from './password-visibility-control'

document.readyState === 'complete'
  ? PasswordVisibilityControlFlowbase()
  : window.addEventListener('load', PasswordVisibilityControlFlowbase)
