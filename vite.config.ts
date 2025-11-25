import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/cardboard/',

  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        notFound: './index.html'
      },
      output: {
        entryFileNames: 'assets/[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'index.html') return '404.html'
          return 'assets/[name].[ext]'
        }
      }
    }
  }
})