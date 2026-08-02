import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { validateCourse } from 'flow-engine'
import 'flow-engine/styles.css'
// Self-hosted fonts (bundled at build → render in headless capture; never a CDN).
// Plex Sans = titles/body/labels · Plex Mono = code/ids/sub-labels.
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/600.css'
import '@fontsource/ibm-plex-sans/700.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import { App } from './App.tsx'
import { getScene } from './scenes/index.ts'
import { courses } from './content/courses/index.ts'
import './index.css'

// Fail loud at load in dev if any course's beat references a scene node id that doesn't
// exist. tsc type-checks the scenes + courses; validateCourse adds the id foreign-key.
if (import.meta.env.DEV) {
  for (const c of courses) {
    const errors = validateCourse(c.sections, getScene)
    if (errors.length) console.error(`[content] "${c.id}" failed:\n` + errors.map((e) => '  ✗ ' + e).join('\n'))
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
