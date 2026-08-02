import { type SceneSpec, BLUE, GREEN, ORANGE, PURPLE } from 'flow-engine'

// A small scene: a Master container holding Driver + SparkSession, a Cluster Manager, and
// two Worker Nodes, wired left→right. Scenes are this concept app's STRUCTURE (authored
// with the engine's helpers); the beats that assemble it live in content/course.ts.
export const demo: SceneSpec = {
  id: 'demo',
  title: 'Demo — the cluster',
  canvas: { width: 960, height: 540 },
  grid: { cols: [1.4, 1, 1, 1], rows: 1, gap: 0.4, padding: 0.4 },
  nodes: [
    {
      id: 'master',
      label: 'Master Node',
      kind: 'container',
      color: ORANGE,
      cell: [0, 0],
      layout: { cols: 1, rows: [1, 1], gap: 0.4, padding: 0.5 },
      children: [
        { id: 'driver', label: 'Driver Program', kind: 'symbol', color: ORANGE, cell: [0, 0] },
        { id: 'session', label: 'SparkSession', kind: 'symbol', color: BLUE, cell: [0, 1] },
      ],
    },
    { id: 'cluster-mgr', label: 'Cluster Mgr', kind: 'symbol', color: BLUE, cell: [1, 0] },
    { id: 'worker-a', label: 'Worker Node A', kind: 'symbol', color: GREEN, cell: [2, 0] },
    { id: 'worker-b', label: 'Worker Node B', kind: 'symbol', color: PURPLE, cell: [3, 0] },
  ],
  edges: [
    { from: 'driver', to: 'session', label: 'init' },
    { from: 'session', to: 'cluster-mgr', label: 'submit' },
    { from: 'cluster-mgr', to: 'worker-a', label: 'launch' },
    { from: 'cluster-mgr', to: 'worker-b', label: 'launch' },
  ],
}
