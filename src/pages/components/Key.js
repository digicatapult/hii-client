import React, { useState } from 'react'
import styled from 'styled-components'
import { HelpContainer, ToggleButton } from '@digicatapult/ui-component-library'

import { colours } from '../../utils/theme'

const Wrapper = styled.div`
  position: absolute;
  right: 5ch;
  bottom: 5ch;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const ButtonWrapper = styled.div`
  margin: 1.25em 1.75em 0 0;
`

const RowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.3rem;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  ::after {
    content: '';
    height: 24px;
    width: 24px;
    background-color: ${(props) => props.color};
  }
`

const Rows = () => (
  <RowWrapper>
    {Object.entries(colours).map(([key, value]) => (
      <Row key={key} color={value}>
        {key}
      </Row>
    ))}
  </RowWrapper>
)

export default function Key({}) {
  const [isOpen, setIsOpen] = useState(false)
  const onClick = () => setIsOpen(!isOpen)

  return (
    <Wrapper>
      {isOpen && (
        <HelpContainer width="30ch" background="#FFF">
          <Rows />
        </HelpContainer>
      )}
      <ButtonWrapper>
        <ToggleButton
          height="2.5em"
          width="2.5em"
          closeBackground="#27847A"
          openBackground="#000"
          borderRadius="1.25em"
          fontColor="#FFF"
          fontWeight="bold"
          margin="2em"
          isOpen={isOpen}
          onClick={onClick}
        />
      </ButtonWrapper>
    </Wrapper>
  )
}
