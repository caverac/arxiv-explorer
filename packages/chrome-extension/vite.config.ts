import path from 'path'
import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

import manifest from './src/manifest.config'

export default defineConfig({
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@auth': path.resolve(__dirname, 'src/auth'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  plugins: [react(), crx({ manifest })],
})
