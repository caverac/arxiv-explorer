import { CognitoUserPool } from 'amazon-cognito-identity-js'

/**
 * A helper to set login state from chrome.storage
 * @param loggedIn Wether the user is logged in or not
 * @param idToken Optional ID token from Cognito
 * @param accessToken Optional Access token from Cognito
 */
export const setLoggedInState = (
  loggedIn: boolean,
  idToken?: string,
  accessToken?: string,
) => {
  chrome.storage.local.set({ loggedIn, idToken, accessToken }, () => {
    // eslint-disable-next-line no-console
    console.log('[popup] Stored login state:', { loggedIn })
  })
}

/**
 * A helper to get login state from chrome.storage
 * @param callback Callback function to handle the retrieved state
 */
export const getLoggedInState = (
  callback: (state: {
    loggedIn: boolean
    idToken?: string
    accessToken?: string
  }) => void,
) => {
  chrome.storage.local.get(['loggedIn', 'idToken', 'accessToken'], callback)
}

export const userPool = new CognitoUserPool({
  UserPoolId: import.meta.env.VITE_USER_POOL_ID!,
  ClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID!,
})
