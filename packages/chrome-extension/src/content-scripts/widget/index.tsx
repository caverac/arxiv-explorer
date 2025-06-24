import { Theme } from '@chakra-ui/react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Widget } from './widget'
import { Provider } from '@components/ui/provider'

/**
 * Ensures the widget container exists in the DOM
 */
const ensureWidgetContainer = (): HTMLElement | null => {
  let container = document.getElementById('arxivExplorer')
  if (container) {
    return container
  }

  container = document.createElement('div')
  container.id = 'arxivExplorer'
  document.body.appendChild(container)
  return container
}

/**
 * Renders the widget into the page
 */
const renderWidget = () => {
  const container = ensureWidgetContainer()
  if (!container) return

  const root = createRoot(container)
  root.render(
    <React.StrictMode>
      <Provider>
        <Theme appearance="dark">
          <Widget />
        </Theme>
      </Provider>
    </React.StrictMode>,
  )
}

/**
 * Removes the widget from the page
 */
const removeWidget = () => {
  const container = document.getElementById('arxivExplorer')
  if (container) {
    container.remove()
  }
}

/**
 * Only render the widget if the user is logged in
 */
chrome.storage.local.get(['loggedIn'], (items) => {
  if (items.loggedIn) {
    renderWidget()
  }
})

/**
 * Listen for changes in the loggedIn state
 */
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'local') return

  if (changes.loggedIn) {
    const newValue = changes.loggedIn.newValue as boolean
    if (newValue) {
      renderWidget()
    } else {
      removeWidget()
    }
  }
})
