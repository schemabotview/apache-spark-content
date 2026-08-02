import type { Course } from 'flow-engine'

// Course: the inside of one executor, on the `executor` scene.
export const executorInternals: Course = {
  id: 'executor-internals',
  title: 'Inside an executor',
  sections: [
    {
      id: 'inside-the-executor',
      heading: 'Inside an executor',
      scene: 'executor',
      slide: {
        title: 'Inside an executor',
        body: [
          '- The heap splits into **execution** and **storage** memory',
          '- Each **core** runs one task per partition',
          '- Data **spills to local disk** when memory is tight',
        ].join('\n'),
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
