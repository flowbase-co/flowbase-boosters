import { CarouselTickerFlowbase } from './carousel-ticker'

document.readyState === 'complete'
  ? CarouselTickerFlowbase()
  : window.addEventListener('load', CarouselTickerFlowbase)
