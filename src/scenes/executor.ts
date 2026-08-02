import { type SceneSpec, BLUE, GREEN, PURPLE, RED, YELLOW } from 'flow-engine'

// A second scene — the inside of one executor: a Heap (execution + storage memory) over
// two cores, with a Local Disk it spills to. A different scene from `demo`, so a section
// on it enters fully ghosted (the reveal reset boundary).
export const executor: SceneSpec = {
  id: 'executor',
  title: 'Inside an executor',
  canvas: { width: 900, height: 520 },
  grid: { cols: [1.6, 1], rows: 1, gap: 0.4, padding: 0.4 },
  nodes: [
    {
      id: 'executor',
      label: 'Executor',
      kind: 'container',
      color: PURPLE,
      cell: [0, 0],
      layout: { cols: [1, 1], rows: [1.4, 1], gap: 0.3, padding: 0.5 },
      children: [
        {
          id: 'heap',
          label: 'Heap',
          kind: 'container',
          color: BLUE,
          cell: [0, 0, 2, 1],
          layout: { cols: [1, 1], rows: 1, gap: 0.3, padding: 0.5 },
          children: [
            { id: 'execution', label: 'Execution', kind: 'symbol', color: PURPLE, icon: 'memory', cell: [0, 0] },
            { id: 'storage', label: 'Storage', kind: 'symbol', color: GREEN, icon: 'memory', cell: [1, 0] },
          ],
        },
        { id: 'core-1', label: 'Core 1', kind: 'symbol', color: RED, icon: 'engine', cell: [0, 1] },
        { id: 'core-2', label: 'Core 2', kind: 'symbol', color: RED, icon: 'engine', cell: [1, 1] },
      ],
    },
    { id: 'disk', label: 'Local Disk', kind: 'symbol', color: YELLOW, icon: 'disk', cell: [1, 0] },
  ],
  edges: [
    { from: 'core-1', to: 'disk', label: 'spill' },
    { from: 'core-2', to: 'disk', label: 'spill' },
  ],
}
