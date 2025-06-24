import { Theme, Container } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'

import { LoginForm, LoggedInView } from './login'
import { getLoggedInState } from '@auth/cognito'
import { Provider } from '@components/ui/provider'

/**
 * PopupApp component for the Chrome extension popup
 * @returns A React component for the popup app
 */
const PopupApp: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false)

  // On mount, check if we're already logged in
  useEffect(() => {
    getLoggedInState(({ loggedIn: isLoggedIn }) => {
      setLoggedIn(!!isLoggedIn)
    })
  }, [])

  if (loggedIn) {
    return <LoggedInView setLoggedIn={setLoggedIn} />
  }

  // Otherwise, show login form:
  return <LoginForm setLoggedIn={setLoggedIn} />
}

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(
    <React.StrictMode>
      <Provider>
        <Theme appearance="dark">
          <Container w="md" p={2}>
            <PopupApp />
          </Container>
        </Theme>
      </Provider>
    </React.StrictMode>,
  )
} else {
  // eslint-disable-next-line no-console
  console.error('[popup] Could not find #root')
}
