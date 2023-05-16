import { BeforeAfter, type Props } from './lib/BeforeAfter'

const settings: Props = {
  left: {
    src: 'https://assets.website-files.com/61dce392ca43558990b49df0/61dce4b03f03cccc0b415058_Slide%201.png',
  },
  right: {
    src: 'https://assets.website-files.com/61dce392ca43558990b49df0/61dcea1ac8725a36fc41cab4_Slide%202.png',
  },
  position: 0,
  radius: 0,
  bg: '#e4e6f1',
  customHandle: false,
  customLabel: false,
  label: {
    position: 'bottom',
    before: 'Before',
    after: 'After',
    x: 100,
    y: 200,
  },
  line: {
    color: 'rgba(255, 255, 255, 0.4)',
    width: 1,
  },
}

export default () => <BeforeAfter {...settings} />
