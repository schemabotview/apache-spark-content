import type { SceneSpec } from 'flow-engine'
import { evolution } from './evolution.ts'

// This concept's scene registry. The engine's RevealPlayer resolves a section's scene id
// through getScene; content/course.ts references these ids.
const scenes: Record<string, SceneSpec> = {
  [evolution.id]: evolution,
}

export const getScene = (id: string): SceneSpec | undefined => scenes[id]
