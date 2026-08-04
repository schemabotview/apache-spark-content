import type { SceneSpec } from 'flow-engine'
import { evolution } from './evolution.ts'
import { clusterTopology } from './cluster-topology.ts'
import { execution } from './execution.ts'

// This concept's scene registry. The engine's RevealPlayer resolves a section's scene id
// through getScene; content/course.ts references these ids.
const scenes: Record<string, SceneSpec> = {
  [evolution.id]: evolution,
  [clusterTopology.id]: clusterTopology,
  [execution.id]: execution,
}

export const getScene = (id: string): SceneSpec | undefined => scenes[id]
