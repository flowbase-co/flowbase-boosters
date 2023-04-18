import { BeforeAfter, type Props as Settings } from './lib'

const settings: Settings = {
  left: {
    src: 'https://assets.website-files.com/61dce392ca43558990b49df0/61dce4b03f03cccc0b415058_Slide%201.png',
  },
  right: {
    src: 'https://assets.website-files.com/61dce392ca43558990b49df0/61dcea1ac8725a36fc41cab4_Slide%202.png',
  },
  position: 25,
  radius: 0,
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
