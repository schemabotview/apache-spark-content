import { useEffect, useState } from 'react'
import { RevealPlayer } from 'flow-engine'
import { getScene } from './scenes/index.ts'
import { CONCEPT, courses, courseById } from './content/courses/index.ts'
import { CourseIndex } from './CourseIndex.tsx'

// Hash router (GitHub Pages has no SPA fallback, so `#/<courseId>` survives refresh):
//   #/            → the course index for this concept
//   #/<courseId>  → play that course
function useCourseId() {
  const read = () => location.hash.replace(/^#\/?/, '')
  const [id, setId] = useState(read)
  useEffect(() => {
    const on = () => setId(read())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return id
}

export function App() {
  const id = useCourseId()
  const course = id ? courseById(id) : undefined

  // Esc walks one level up: while a course plays it returns to this concept's index;
  // on the index (no course) a second Esc goes to the catalog home (graphl.in).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (course) location.hash = ''
      else location.href = '/'
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [course])

  if (!course) return <CourseIndex concept={CONCEPT} courses={courses} />

  // Per-course audio folder: public/audio/<courseId>/<section-id>-<beat>.wav.
  return (
    <RevealPlayer
      course={course}
      getScene={getScene}
      audioBase={`${import.meta.env.BASE_URL}audio/${course.id}`}
    />
  )
}
