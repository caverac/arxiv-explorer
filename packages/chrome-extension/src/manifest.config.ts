import { defineManifest } from '@crxjs/vite-plugin'
import pkg from '../package.json'

const permissions: chrome.runtime.ManifestPermissions[] = [
  'scripting',
  'tabs',
  'management',
  'storage',
  'debugger',
  'cookies',
]

export default defineManifest((env) => {
  const version = pkg.version
    .replace(/[^\d.-]+/g, '')
    .split(/[.-]/)
    .slice(0, 4)
    .join('.')

  const isDev = env.mode === 'development'

  return {
    manifest_version: 3,
    name: `arXiv explorer${isDev ? ' – local' : ''}`,
    version,
    description: 'A Chrome extension to explore arXiv papers',
    action: { default_popup: 'index.html' },
    host_permissions: ['https://arxiv.org/*'],
    permissions,
    icons: {
      16: 'arxiv-explorer-16.png',
      32: 'arxiv-explorer-32.png',
      48: 'arxiv-explorer-48.png',
      128: 'arxiv-explorer-128.png',
    },
    content_scripts: [
      {
        matches: ['https://arxiv.org/*'],
        js: ['src/content-scripts/widget/index.tsx'],
      },
    ],
  }
})
