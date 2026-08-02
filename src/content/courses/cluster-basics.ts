import type { Course } from 'flow-engine'

// Course: the cluster's control plane + workers, on the shared `demo` scene (reveal
// accumulates across its two sections).
export const clusterBasics: Course = {
  id: 'cluster-basics',
  title: 'The cluster',
  sections: [
    {
      id: 'the-cluster',
      heading: 'The cluster',
      scene: 'demo',
      slide: {
        title: 'The cluster',
        body: [
          '- The **driver** owns the SparkSession and builds the plan',
          '- The **cluster manager** allocates machines to the app',
          '- Work is **submitted** to the manager for scheduling',
        ].join('\n'),
      },
      beats: [
        { line: 'Here is the cluster we are about to assemble.', delta: [{ kind: 'solidify', ids: ['master'] }] },
        { line: 'Your driver program owns the SparkSession.', delta: [{ kind: 'solidify', ids: ['driver', 'session'] }] },
        {
          line: 'It submits work to the cluster manager.',
          delta: [
            { kind: 'solidify', ids: ['cluster-mgr'] },
            { kind: 'draw', edges: [['session', 'cluster-mgr']] },
          ],
        },
      ],
    },
    {
      id: 'the-worker-nodes',
      heading: 'The worker nodes',
      scene: 'demo',
      slide: {
        title: 'The worker nodes',
        body: [
          '- The cluster manager **launches executors** on the workers',
          '- Each executor **holds partitions** in memory',
          '- Cores **run tasks** across the cluster in parallel',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Which launches executors on the worker nodes.',
          delta: [
            { kind: 'solidify', ids: ['worker-a', 'worker-b'] },
            { kind: 'draw', edges: [['cluster-mgr', 'worker-a'], ['cluster-mgr', 'worker-b']] },
          ],
        },
      ],
    },
  ],
}
