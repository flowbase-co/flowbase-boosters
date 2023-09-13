export const onLoad = (cb: () => void) => {
  document.readyState == 'complete' ? cb() : window.addEventListener('load', cb)
}
