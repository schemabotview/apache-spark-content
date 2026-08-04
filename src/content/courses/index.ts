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
