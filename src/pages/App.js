import React from 'react'
import styled from 'styled-components'
import Router from '../utils/Router'

const Root = styled.div`
  display: grid;
  grid-template-areas:
    'header'
    'body';
  grid-template-rows: 164px 1fr;
  width: 100vw;
  height: 100vh;
`

export default function App() {
  return (
    <Root>
      <Router />
    </Root>
  )
}
