import React from 'react'
import styled from 'styled-components'
import Router from '../utils/Router'

const Root = styled.div`
  font-family: 'Roboto', sans-serif;
`

export default function App() {
  return (
    <Root>
      <Router />
    </Root>
  )
}
