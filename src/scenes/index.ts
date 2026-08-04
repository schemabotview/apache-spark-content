import type { SceneSpec } from 'flow-engine'
import { evolution } from './evolution.ts'
import { clusterTopology } from './cluster-topology.ts'
import { execution } from './execution.ts'
import { apiStack } from './api-stack.ts'
import { catalyst } from './catalyst.ts'
import { streamingModel } from './streaming-model.ts'
import { eventTime } from './event-time.ts'
import { lambdaArch } from './lambda-arch.ts'

// This concept's scene registry. The engine's RevealPlayer resolves a section's scene id
// through getScene; content/course.ts references these ids.
const scenes: Record<string, SceneSpec> = {
  [evolution.id]: evolution,
  [clusterTopology.id]: clusterTopology,
  [execution.id]: execution,
  [apiStack.id]: apiStack,
  [catalyst.id]: catalyst,
  [streamingModel.id]: streamingModel,
  [eventTime.id]: eventTime,
  [lambdaArch.id]: lambdaArch,
}

export const getScene = (id: string): SceneSpec | undefined => scenes[id]
