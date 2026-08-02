import type { Course } from 'flow-engine'

// The Apache Spark course — typed content (not a fetched manifest). Two sections share the
// `demo` scene (reveal accumulates), then one on `executor` (reveal resets). Beats
// reference the scenes' raw node ids; because scenes + beats are in the same TS project,
// a bad id is caught at build (tsc types) and by validateCourse (see main.tsx).
export const course: Course = {
  concept: 'Apache Spark',
  sections: [
    {
      id: 'the-cluster',
      heading: 'The cluster',
      scene: 'demo',
      slide: {
        title: 'The cluster',
        bullets: [
          'The driver owns the SparkSession and builds the plan',
          'The cluster manager allocates machines to the app',
          'Work is submitted to the manager for scheduling',
        ],
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
        bullets: [
          'The cluster manager launches executors on the workers',
          'Each executor holds partitions in memory',
          'Cores run tasks across the cluster in parallel',
        ],
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
    {
      id: 'inside-the-executor',
      heading: 'Inside an executor',
      scene: 'executor',
      slide: {
        title: 'Inside an executor',
        bullets: [
          'The heap splits into execution and storage memory',
          'Each core runs one task per partition',
          'Data spills to local disk when memory is tight',
        ],
      },
      beats: [
        { line: 'Now zoom into a single executor.', delta: [{ kind: 'solidify', ids: ['executor'] }] },
        {
          line: 'Its heap splits into execution and storage memory.',
          delta: [{ kind: 'solidify', ids: ['heap', 'execution', 'storage'] }],
        },
        {
          line: 'Cores run tasks and spill to local disk under memory pressure.',
          delta: [
            { kind: 'solidify', ids: ['core-1', 'core-2', 'disk'] },
            { kind: 'draw', edges: [['core-1', 'disk'], ['core-2', 'disk']] },
          ],
        },
      ],
    },
  ],
}
