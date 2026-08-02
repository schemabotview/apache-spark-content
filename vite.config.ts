import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base` is the GitHub Pages project subpath in production (the app is served at
// https://schemabotview.github.io/apache-spark/); dev stays at root. import.meta.env.BASE_URL
// reflects this, so per-course audio resolves correctly in both (see App.tsx audioBase).
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/apache-spark/' : '/',
  plugins: [react()],
}))
