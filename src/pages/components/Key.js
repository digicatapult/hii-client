import React, { useState } from 'react'
import styled from 'styled-components'
import { HelpContainer, ToggleButton } from '@digicatapult/ui-component-library'

import { projectColours } from '../../utils/theme'

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
  color: #6d6d6d;
  font-size: 0.9em;

  ::after {
    content: '';
    height: 24px;
    width: 24px;
    background-color: ${(props) => props.color};
  }
`

const Rows = ({ projectTypes }) => (
  <RowWrapper>
    {projectTypes != undefined &&
    projectTypes != null &&
    projectTypes.length > 0
      ? projectTypes.map((projectType) => (
          <Row key={projectType.label} color={projectType.color}>
            {projectType.label}
          </Row>
        ))
      : Object.entries(projectColours).map(([key, value]) => (
          <Row key={key} color={value}>
            {key}
          </Row>
        ))}
  </RowWrapper>
)

export default function Key({ projectTypes }) {
  const [isOpen, setIsOpen] = useState(false)
  const onClick = () => setIsOpen(!isOpen)
  return (
    <Wrapper>
      {isOpen && (
        <HelpContainer width="25ch" background="#FFF">
          <Rows projectTypes={projectTypes} />
        </HelpContainer>
      )}
      <ButtonWrapper>
        <ToggleButton
          height="2.5em"
          width="2.5em"
          closeBackground="#27847A"
          openBackground="#000"
          borderRadius="0em"
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
