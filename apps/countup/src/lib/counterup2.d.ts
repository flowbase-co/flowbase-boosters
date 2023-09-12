declare module 'counterup2' {
  interface Options {
    action?: string
    duration?: number
    delay?: number
  }

  function counter(el: HTMLElement, options: Options): void

  export default counter
}
