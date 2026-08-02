import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RevealPlayer, validateCourse } from 'flow-engine'
import 'flow-engine/styles.css'
import { getScene } from './scenes/index.ts'
import { course } from './content/course.ts'
import './index.css'

// Fail loud at load in dev if a beat references a scene node id that doesn't exist. Because
// scenes + course are in this one TS project, tsc already type-checks them; validateCourse
// adds the id-level foreign-key check.
if (import.meta.env.DEV) {
  const errors = validateCourse(course.sections, getScene)
  if (errors.length) console.error('[content] validation failed:\n' + errors.map((e) => '  ✗ ' + e).join('\n'))
}

// Audio is served same-origin from public/audio, so audioBase is empty.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RevealPlayer course={course} getScene={getScene} audioBase="" />
  </StrictMode>,
)
