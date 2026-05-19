import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

import { resolve } from 'path'

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      'react-native': resolve(__dirname, './src/mocks/empty.ts'),
      'react-native-fs': resolve(__dirname, './src/mocks/empty.ts'),
      'react-native-fetch-blob': resolve(__dirname, './src/mocks/empty.ts'),
    }
  },
  plugins: [
    devtools(),
    nitro({ 
      rollupConfig: { 
        external: [/^@sentry\//, 'react-native', 'react-native-fs', 'react-native-fetch-blob'] 
      } 
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
