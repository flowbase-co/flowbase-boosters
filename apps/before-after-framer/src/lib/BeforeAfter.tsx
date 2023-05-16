import styled from '@emotion/styled'
import { useEffect, useRef } from 'react'

import { Welcome } from './Welcome'

const START_POSITION = 50

enum LabelPosition {
  Left,
  Right,
}

interface Image {
  src: string
  srcSet?: string
  alt?: string
}

export interface Props {
  radius: number
  position: number
  bg: string

  left?: Image
  right?: Image

  customHandle: boolean
  handle?: React.ReactNode

  customLabel: boolean
  label: {
    position: string
    x: number
    y: number
    before: string
    after: string
  }
  leftLabel?: React.ReactNode
  rightLabel?: React.ReactNode

  line: {
    color: string
    width: number
  }
}

export const BeforeAfter: React.FC<Props> = (props) => {
  if (!props.left?.src || !props.right?.src) {
    let count = 2
    if (props.left?.src || props.right?.src) count--

    return (
      <Welcome
        text={`Upload ${count} image${count > 1 ? 's' : ''} to continue`}
      />
    )
  }

  const inner = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const control = useRef<HTMLDivElement>(null)
  const container = useRef<HTMLDivElement>(null)

  const labelLeft = useRef<HTMLDivElement>(null)
  const labelRight = useRef<HTMLDivElement>(null)

  const setPosition = (value: number) => {
    inner.current!.style.clipPath = `inset(0px 0px 0px ${value}%)`
    control.current!.style.left = `${value}%`
  }

  const setInputPosition = (value: number) =>
    (input.current!.value = `${value}`)

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPosition(+event.target.value)
  }

  useEffect(() => {
    setPosition(props.position)
  }, [props.position])

  useEffect(() => {
    initThumbSize()

    if (props.position !== START_POSITION) {
      setPosition(props.position)
      setInputPosition(props.position)
    }
  }, [])

  const initThumbSize = () => {
    const handleEl = control.current?.firstChild as HTMLElement

    if (container.current && handleEl) {
      container.current.style.setProperty(
        '--thumb-size',
        `${handleEl.clientWidth}px`
      )
    }
  }

  const enableAnimation = () => {
    inner.current!.style.transition = 'clip-path 0.3s'
    control.current!.style.transition = 'left 0.3s'
  }

  const disableAnimation = () => {
    inner.current!.style.transition = ''
    control.current!.style.transition = ''
  }

  const onClickLabel = (position: LabelPosition) => {
    enableAnimation()

    switch (position) {
      case LabelPosition.Left:
        setPosition(0)
        setInputPosition(0)
        break
      case LabelPosition.Right:
        setPosition(100)
        setInputPosition(100)
        break
    }

    setTimeout(disableAnimation, 300)
  }

  return (
    <Container
      ref={container}
      borderRadius={props.radius}
      background={props.bg}
    >
      <LabelWrapper
        ref={labelLeft}
        hp="left"
        vp={props.label.position}
        x={props.label.x}
        y={props.label.y}
        onClick={() => onClickLabel(LabelPosition.Left)}
      >
        {props.customLabel ? (
          props.leftLabel
        ) : (
          <Label>{props.label.before}</Label>
        )}
      </LabelWrapper>
      <LabelWrapper
        ref={labelRight}
        hp="right"
        vp={props.label.position}
        x={props.label.x}
        y={props.label.y}
        onClick={() => onClickLabel(LabelPosition.Right)}
      >
        {props.customLabel ? (
          props.rightLabel
        ) : (
          <Label>{props.label.after}</Label>
        )}
      </LabelWrapper>

      <Inner data-testid="inner" ref={inner}>
        <Image
          data-testid="right-image"
          src={props.right.src}
          srcSet={props.right.srcSet}
          alt={props.right.alt}
        />
      </Inner>

      <Image
        data-testid="left-image"
        src={props.left.src}
        srcSet={props.left.srcSet}
        alt={props.left.alt}
      />

      <Input
        data-testid="input"
        type="range"
        ref={input}
        min="0"
        max="100"
        onChange={onChange}
      />

      <Control
        data-testid="control"
        ref={control}
        color={props.line.color}
        width={props.line.width}
      >
        {props.customHandle ? props.handle : <Handle />}
      </Control>
    </Container>
  )
}

const Container = styled.div<{ borderRadius: number; background: string }>`
  position: relative;
  display: inline-block;
  overflow: hidden;
  width: 100%;
  height: 100%;
  border-radius: ${(p) => p.borderRadius}px;
  background: ${(p) => p.background};
`

const Inner = styled.div`
  position: absolute;
  z-index: 1;
  bottom: 0;
  right: 0;
  left: 0;
  top: 0;
`

const Image = styled.img`
  vertical-align: bottom;
  object-fit: cover;
  height: 100%;
  width: 100%;
}`

const Control = styled.div<{ color: string; width: number }>`
  pointer-events: none;

  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  z-index: 2;

  left: 50%;
  bottom: 0;
  top: 0;

  transform: translateX(-50%);

  &:before {
    content: '';

    position: absolute;
    left: 50%;
    bottom: 0;
    top: 0;

    width: ${(p) => p.width}px;
    background: ${(p) => p.color};

    transform: translateX(-50%);
  }
`

const Input = styled.input`
  bottom: 0;
  cursor: pointer;
  height: 100%;
  left: -1px;
  margin: 0;
  opacity: 0;
  position: absolute;
  top: 0;
  touch-action: auto;
  width: calc(100% + 2px);
  z-index: 2;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: calc(var(--thumb-size) * 2);
    height: calc(var(--thumb-size) * 1.5);
  }
`

const Handle = styled.div`
  flex-shrink: 0;
  position: relative;

  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 50%;

  &:before,
  &:after {
    content: '';

    position: absolute;
    top: 50%;

    border-left: 2px solid;
    border-top: 2px solid;

    height: 8px;
    width: 8px;

    transform-origin: 0 0;
  }

  &:before {
    left: 18px;
    transform: rotate(-45deg);
  }

  &:after {
    right: 8px;
    transform: rotate(135deg);
  }
`

const LabelWrapper = styled.div<{
  vp: string
  hp: string
  x: number
  y: number
}>`
  position: absolute;
  z-index: 3;

  cursor: pointer;

  ${(p) => `${p.vp}: ${p.y}px;`}
  ${(p) => `${p.hp}: ${p.x}px;`}
`

const Label = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 2px 16px;
  background: rgba(255, 255, 255, 0.48);
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 6px;

  font-family: Inter, sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 28px;
  color: #000000;
`
