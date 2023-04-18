import { render, screen } from '@testing-library/react'

import { BeforeAfter } from '.'

const settings = {
  left: {
    src: 'https://assets.website-files.com/61dce392ca43558990b49df0/61dce4b03f03cccc0b415058_Slide%201.png',
  },
  right: {
    src: 'https://assets.website-files.com/61dce392ca43558990b49df0/61dcea1ac8725a36fc41cab4_Slide%202.png',
  },
  customHandle: false,
  position: 25,
  radius: 0,
}

describe('App', () => {
  beforeEach(() => {
    render(<BeforeAfter {...settings} />)
  })

  it('should render the left image', async () => {
    const image = await screen.findByTestId<HTMLImageElement>('left-image')

    expect(image).toBeInTheDocument()
    expect(image.src).toEqual(settings.left.src)
  })

  it('should render the right image', async () => {
    const image = await screen.findByTestId<HTMLImageElement>('right-image')

    expect(image).toBeInTheDocument()
    expect(image.src).toEqual(settings.right.src)
  })

  it('should set start position to control', async () => {
    const control = await screen.findByTestId<HTMLElement>('control')

    expect(control).toBeInTheDocument()
    expect(control.style.left).toEqual('25%')
  })

  it('should set start position to inner', async () => {
    const inner = await screen.findByTestId<HTMLElement>('inner')

    expect(inner).toBeInTheDocument()
    expect(inner.style.width).toEqual('25%')
  })
})
