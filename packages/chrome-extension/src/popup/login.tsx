import { Box, VStack, HStack, Field, Input, Button } from '@chakra-ui/react'
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'
import React, { useState } from 'react'
import { setLoggedInState, userPool } from '@auth/cognito'
import { ArxivExplorerLogo } from '@components/ui/logo'
import { PasswordInput } from '@components/ui/password-input'

type LoginFormProps = {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * LoginForm component for the Chrome extension popup
 * @param param0 - Props for the login form
 * @returns A React component for the login form
 */
export const LoginForm: React.FC<LoginFormProps> = ({ setLoggedIn }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  /**
   * Handler: "Log in" form submission
   * @param e Event object from the form submission
   */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const authDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    })

    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    })

    cognitoUser.authenticateUser(authDetails, {
      /**
       * Callback for successful authentication
       */
      onSuccess: (session) => {
        // Grab tokens (idToken, accessToken)
        const idToken = session.getIdToken().getJwtToken()
        const accessToken = session.getAccessToken().getJwtToken()

        // Store them in chrome.storage.local
        setLoggedInState(true, idToken, accessToken)
        setLoggedIn(true)
        setLoading(false)
      },
      /**
       * Callback for failed authentication
       */
      onFailure: (err: unknown) => {
        // eslint-disable-next-line no-console
        console.error('[popup] Cognito auth failed:', err)

        setError(err instanceof Error ? err.message : JSON.stringify(err))
        setLoading(false)
      },
      /**
       * Callback for new password required
       */
      newPasswordRequired: () => {
        setError('New password required')
        setLoading(false)
      },
    })
  }

  return (
    <Box>
      <HStack>
        <Box boxSize="30%">
          <ArxivExplorerLogo width={'100%'} height={'100%'} />
        </Box>
        <VStack gap="8" width="full">
          <Field.Root required>
            <Field.Label>
              Email <Field.RequiredIndicator />
            </Field.Label>
            <Input
              placeholder="Enter your email"
              variant="flushed"
              size="md"
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label>
              Password <Field.RequiredIndicator />
            </Field.Label>
            <PasswordInput
              placeholder="••••••••"
              variant="flushed"
              size="md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field.Root>

          <Button
            type="submit"
            width="full"
            disabled={!username || !password}
            onClick={handleLogin}
            loading={loading}
          >
            Sign In
          </Button>

          <Box>
            {error && (
              <Box color="red.500" fontSize="sm" mt="2">
                {error}
              </Box>
            )}
          </Box>
        </VStack>
      </HStack>
    </Box>
  )
}

type LoggedInViewProps = {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * LoggedInView component for the Chrome extension popup
 * @param param0 - Props for the logged-in view
 * @returns A React component for the logged-in view
 */
export const LoggedInView: React.FC<LoggedInViewProps> = ({ setLoggedIn }) => {
  /**
   * Handler: "Log out" button click
   */
  const handleLogout = () => {
    setLoggedInState(false)
    setLoggedIn(false)
  }

  return (
    <Box>
      <HStack>
        <Box boxSize="30%">
          <ArxivExplorerLogo width={'100%'} height={'100%'} />
        </Box>
        <Button onClick={handleLogout} colorScheme="red">
          Sign Out
        </Button>
      </HStack>
    </Box>
  )
}
