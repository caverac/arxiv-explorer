# Chrome Extension

This directory contains the Chrome extension for Arxiv Explorer. To run the extension, you need to have the API running on your local machine.

## Running the Chrome Extension

To run the Chrome extension, follow these steps:

1. Open Chrome and go to `chrome://extensions/`.
2. Enable "Developer mode" by toggling the switch in the top right corner.
3. Click on "Load unpacked" and select the `dist` directory inside the `@arxiv-explorer/chrome-extension` package.
4. The extension should now be loaded and you should see it in the list of extensions.

## Building the Chrome Extension

To build the Chrome extension in build mode, run the following command:

```bash
yarn workspace @arxiv-explorer/chrome-extension dev
```
