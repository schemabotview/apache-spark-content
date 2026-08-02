import { writeFileSync, mkdirSync } from 'node:fs'
import { CONCEPT, courses } from '../src/content/courses/index.ts'

// Emit public/courses.json — this concept's catalog (id, title, section count) served at
// the deployed Pages URL, so the top-level index site (schemabotview.github.io) can
// aggregate every concept's courses without hard-coding them.
const manifest = {
  concept: CONCEPT,
  courses: courses.map((c) => ({ id: c.id, title: c.title, sections: c.sections.length })),
}

mkdirSync(new URL('../public/', import.meta.url), { recursive: true })
writeFileSync(new URL('../public/courses.json', import.meta.url), JSON.stringify(manifest, null, 2) + '\n')
console.log(`wrote courses.json — ${courses.length} courses`)
