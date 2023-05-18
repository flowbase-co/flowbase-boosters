import styled from '@emotion/styled'

interface Props {
  text: string
}

export const Welcome: React.FC<Props> = (props) => {
  return (
    <Container>
      <Logo src="https://flowbase-figma.pages.dev/images/logo-dark.png" />
      <Text>{props.text}</Text>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  row-gap: 20px;

  width: 100%;
  height: 100%;

  border-radius: 18px;

  min-width: 600px;
  min-height: 400px;

  background: #f7f8fd;
`

const Logo = styled.img`
  width: 160px;
`

const Text = styled.span`
  color: #061237;
  font-family: Inter, sans-serif;
  font-size: 18px;
  line-height: 36px;
`
