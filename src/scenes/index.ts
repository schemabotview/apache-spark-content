import type { SceneSpec } from 'flow-engine'
import { demo } from './demo.ts'
import { executor } from './executor.ts'

// This concept's scene registry. The engine's RevealPlayer resolves a section's scene id
// through getScene; content/course.ts references these ids.
const scenes: Record<string, SceneSpec> = {
  [demo.id]: demo,
  [executor.id]: executor,
}

export const getScene = (id: string): SceneSpec | undefined => scenes[id]
