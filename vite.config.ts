import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// A plain Vite/React app. The engine (rendering, reveal, player) comes from the
// flow-engine package; this app supplies only its own scenes + course + audio.
export default defineConfig({
  plugins: [react()],
})
