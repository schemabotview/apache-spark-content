import { type SceneSpec, BLUE, GREEN, TEAL, RED, GRAY } from 'flow-engine'

// The `execution` scene — the second scene of the `spark-architecture` course. Where
// `cluster-topology` shows WHO runs a job (driver / manager / executors), this shows HOW a job
// is broken down: an action on your code becomes one JOB, the DAG scheduler cuts it into STAGES
// at each shuffle, and every stage fans out into TASKS (one per partition).
//
//     df.filter(…).groupBy(…).count()        ← an ACTION triggers a job
//        │
//     ┌────────────────────── JOB ──────────────────────┐
//     │  STAGE 0 (narrow)   ║ SHUFFLE ║  STAGE 1 (after) │
//     │  [t][t] [t][t]      ║   bar   ║  [t] [t]         │
//     └───────────────────────────────────────────────────┘
//
// Unlike the topology scene (a solid tour), this scene is a genuine TRACE: switching scenes
// resets the reveal, so it ENTERS GHOSTED and section 7 assembles it beat by beat — code+job,
// then stages+shuffle, then the task fan-out. Section 8 then tightens on the `shuffle` bar.
export const execution: SceneSpec = {
  id: 'execution',
  title: 'A job decomposes',
  // Wide-and-short: a thin code row on top, the job (two stages + a shuffle divider) below.
  canvas: { width: 1320, height: 760 },
  grid: { cols: [1], rows: [0.34, 1.3], gap: 0.28, padding: 0.35 },
  nodes: [
    // ── the code line: transformations are lazy; an ACTION is what submits the job ──
    // Rendered as an IDE-editor card (window chrome + line-number gutter + syntax highlight);
    // `sub` becomes a trailing `# comment` line. See flow-engine SceneNode `CodeCard`.
    { id: 'code', label: 'df.filter(…).groupBy(…).count()', sub: 'an action → one job', kind: 'code', color: BLUE, filename: 'query.py', cell: [0, 0] },

    // ── the JOB: split into two stages by a shuffle boundary ──
    {
      id: 'job', label: 'Job', kind: 'container', color: GRAY, cell: [0, 1],
      layout: { cols: [1.3, 0.4, 0.95], rows: 1, gap: 0.22, padding: 0.28 },
      children: [
        // Stage 0 — the narrow (map/filter) stage: one task per input partition.
        {
          id: 'stage-0', label: 'Stage 0', sub: 'narrow · map/filter', kind: 'container', color: TEAL, cell: [0, 0],
          layout: { cols: [1, 1], rows: [1, 1], gap: 0.25, padding: 0.32 },
          children: [
            { id: 's0-t1', label: 'task', sub: 'part 0', kind: 'symbol', color: GREEN, cell: [0, 0] },
            { id: 's0-t2', label: 'task', sub: 'part 1', kind: 'symbol', color: GREEN, cell: [1, 0] },
            { id: 's0-t3', label: 'task', sub: 'part 2', kind: 'symbol', color: GREEN, cell: [0, 1] },
            { id: 's0-t4', label: 'task', sub: 'part 3', kind: 'symbol', color: GREEN, cell: [1, 1] },
          ],
        },
        // The shuffle boundary — a vertical divider bar between the stages.
        { id: 'shuffle', label: 'SHUFFLE', sub: 'redistribute', kind: 'symbol', color: RED, icon: 'share', cell: [1, 0] },
        // Stage 1 — after the shuffle: one task per shuffle partition (fewer here).
        {
          id: 'stage-1', label: 'Stage 1', sub: 'after shuffle', kind: 'container', color: TEAL, cell: [2, 0],
          layout: { cols: [1], rows: [1, 1], gap: 0.25, padding: 0.32 },
          children: [
            { id: 's1-t1', label: 'task', sub: 'part 0', kind: 'symbol', color: GREEN, cell: [0, 0] },
            { id: 's1-t2', label: 'task', sub: 'part 1', kind: 'symbol', color: GREEN, cell: [0, 1] },
          ],
        },
      ],
    },
  ],
  edges: [
    // The flow, drawn in section 7 beat 1: code → stage 0 → shuffle → stage 1.
    { from: 'code', to: 'stage-0' },
    { from: 'stage-0', to: 'shuffle' },
    { from: 'shuffle', to: 'stage-1' },
  ],
}
