import type { Course } from 'flow-engine'
import { evolution } from './evolution.ts'
import { sparkArchitecture } from './spark-architecture.ts'
import { sparkApi } from './spark-api.ts'
import { sparkStreaming } from './spark-streaming.ts'
import { capstone } from './capstone.ts'

// This concept's course catalog. A concept can hold several courses; each is routed by id
// (#/<id>) and shown in the course index by title. All courses share the concept's scene
// registry (scenes/index.ts).
export const CONCEPT = 'Apache Spark'

export const courses: Course[] = [evolution, sparkArchitecture, sparkApi, sparkStreaming, capstone]

export const courseById = (id: string): Course | undefined => courses.find((c) => c.id === id)

// One-line blurb per course (concept-specific copy — the engine's Course type carries only
// id/title/sections). SINGLE SOURCE OF TRUTH: consumed by the app landing (CourseIndex) AND
// emitted into public/courses.json (gen-courses-json) so the graphl.in catalog shows the same
// descriptions. Keyed by course id.
export const BLURBS: Record<string, string> = {
  evolution: 'From Hadoop to the unified engine',
  'spark-architecture': 'Driver, executors, stages & the shuffle',
  'spark-api': 'RDD → DataFrame → SQL, and Catalyst beneath',
  'spark-streaming': 'Structured Streaming, the unbounded table',
  capstone: 'A Lambda pipeline that uses every concept',
}
