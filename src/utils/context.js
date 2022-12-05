import React from 'react'

import { Themes } from '../fixtures/themes'

export const initState = {
  readDemo: {
    theme: Themes('Aarch64'),
    secret: '',
    showHackPopup: false,
    isSecretSet: false,
    renderModal: false,
    renderModalActions: true,
    showHackingProgress: false,
    renderExplainer: false,
  },
  writeDemo: {
    theme: Themes('Aarch64'),
  },
}

// TODO this is more of an exammple how we can have a global
// state without 3rd parties e.g. redux
// this could be a single entity e.g. themeCtx
export const Context = React.createContext({
  readDemo: {},
  writeDemo: {},
  update: () => {},
})

// this is a provider for initial and state updates
export const ContextProvider = ({ children }) => {
  // TOO update context or create separate update method for each demo e.g. demmo1-update
  const [state, setState] = React.useState({
    ...initState,
    update: (newState) => setState({ ...state, ...newState }),
  })

  return <Context.Provider value={state}>{children}</Context.Provider>
}
