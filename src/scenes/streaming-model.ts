import { type SceneSpec, BLUE, GREEN, ORANGE, PURPLE, TEAL, GRAY } from 'flow-engine'

// The `streaming-model` scene — the SPINE of the `spark-streaming` course ("The stream is a
// table"). The whole course hangs on one insight: a stream is an UNBOUNDED TABLE, and you run
// the SAME DataFrame/SQL query over it — Spark just executes it incrementally. This scene draws
// that dataflow left→right, with the trigger clock above and the durability layer below:
//
//   TRIGGER ── micro-batch clock · or continuous                                  (band ①)
//       │ each trigger: read new data → run the query → write out
//   SOURCES ─▶ INPUT TABLE ─▶ QUERY ─▶ RESULT TABLE ─▶ SINKS                      (band ②)
//   (Kafka…)   (unbounded)    │↑state   │ (output mode)   (Kafka…)
//   DURABILITY ── checkpoint (offsets + WAL) · exactly-once                       (band ③)
//
// Like the other Spark scenes it's a SOLID TOUR: the overview solidifies the whole model, then
// each section lights one band/region as the camera travels (the input→query→result heart,
// sources, trigger, result+modes, sinks), detouring to the sibling `event-time` scene for the
// windowing/watermark story, then returning here for durability + the closer. Node ids group by
// region — `tr-*` trigger, `src-*` sources, `sink-*` sinks, `om-*` output modes, and the spine
// symbols `input`/`query`/`result`/`state`, plus `checkpoint`/`exactly-once`.
export const streamingModel: SceneSpec = {
  id: 'streaming-model',
  title: 'The stream is a table',
  // Wide, three stacked bands: a thin trigger strip, the wide pipeline, a thin durability strip.
  canvas: { width: 1400, height: 1160 },
  grid: { cols: [1], rows: [0.4, 1.7, 0.4], gap: 0.28, padding: 0.32 },
  nodes: [
    // ── band ①: the TRIGGER — the clock that decides how often the query runs ──
    {
      id: 'trigger', label: 'Trigger — when does the query run?', kind: 'container', color: GRAY, cell: [0, 0],
      layout: { cols: [1, 1], rows: 1, gap: 0.28, padding: 0.4 },
      children: [
        { id: 'tr-microbatch', label: 'micro-batch', sub: 'default · fixed interval', kind: 'symbol', color: TEAL, icon: 'clock', cell: [0, 0] },
        { id: 'tr-continuous', label: 'continuous', sub: '~1 ms latency', kind: 'symbol', color: GRAY, icon: 'stream', cell: [1, 0] },
      ],
    },

    // ── band ②: the PIPELINE — sources → input table → query → result table → sinks, with the
    //    state store under the query and the output mode under the result table. ──
    {
      id: 'pipeline', label: 'The unbounded-table dataflow', kind: 'container', color: GRAY, cell: [0, 1],
      layout: { cols: [0.9, 1, 1.15, 1, 0.9], rows: [1, 0.62], gap: 0.28, padding: 0.38 },
      children: [
        // Sources — where the rows come from (spans both sub-rows so its 4 tiles have height).
        {
          id: 'src', label: 'Sources', kind: 'container', color: ORANGE, cell: [0, 0, 1, 2],
          layout: { cols: [1], rows: [1, 1, 1, 1], gap: 0.22, padding: 0.3 },
          children: [
            { id: 'src-kafka', label: 'Kafka', kind: 'symbol', color: BLUE, icon: 'stream', cell: [0, 0] },
            { id: 'src-files', label: 'files', kind: 'symbol', color: ORANGE, icon: 'file', cell: [0, 1] },
            { id: 'src-socket', label: 'socket', kind: 'symbol', color: GRAY, icon: 'plug', cell: [0, 2] },
            { id: 'src-rate', label: 'rate', sub: 'test source', kind: 'symbol', color: GRAY, icon: 'clock', cell: [0, 3] },
          ],
        },
        { id: 'input', label: 'Input Table', sub: 'unbounded · append-only', kind: 'symbol', color: BLUE, icon: 'table', cell: [1, 0] },
        { id: 'query', label: 'Query', sub: 'same DataFrame/SQL · incremental', kind: 'symbol', color: TEAL, icon: 'gears', cell: [2, 0] },
        { id: 'result', label: 'Result Table', sub: 'updated each trigger', kind: 'symbol', color: PURPLE, icon: 'table', cell: [3, 0] },
        // Sinks — where results are written (spans both sub-rows).
        {
          id: 'sink', label: 'Sinks', kind: 'container', color: GREEN, cell: [4, 0, 1, 2],
          layout: { cols: [1], rows: [1, 1, 1, 1], gap: 0.22, padding: 0.3 },
          children: [
            { id: 'sink-kafka', label: 'Kafka', kind: 'symbol', color: BLUE, icon: 'stream', cell: [0, 0] },
            { id: 'sink-files', label: 'files', kind: 'symbol', color: ORANGE, icon: 'file', cell: [0, 1] },
            { id: 'sink-console', label: 'console', kind: 'symbol', color: GRAY, icon: 'terminal', cell: [0, 2] },
            { id: 'sink-foreach', label: 'foreach', sub: 'any store', kind: 'symbol', color: GRAY, icon: 'gears', cell: [0, 3] },
          ],
        },
        // State store — under the query; carries aggregations across triggers.
        { id: 'state', label: 'State Store', sub: 'aggregations · joins · dedup', kind: 'symbol', color: ORANGE, icon: 'memory', cell: [2, 1] },
        // Output mode — under the result table; how much of it is written each trigger.
        {
          id: 'outmode', label: 'Output mode', kind: 'container', color: GRAY, cell: [3, 1],
          layout: { cols: [1, 1, 1], rows: 1, gap: 0.2, padding: 0.35 },
          children: [
            { id: 'om-append', label: 'append', kind: 'symbol', color: GREEN, cell: [0, 0] },
            { id: 'om-update', label: 'update', kind: 'symbol', color: TEAL, cell: [1, 0] },
            { id: 'om-complete', label: 'complete', kind: 'symbol', color: PURPLE, cell: [2, 0] },
          ],
        },
      ],
    },

    // ── band ③: DURABILITY — checkpointing + exactly-once, the foundation under the whole run ──
    {
      id: 'durability', label: 'Fault tolerance — restart where it left off', kind: 'container', color: BLUE, cell: [0, 2],
      layout: { cols: [1, 1], rows: 1, gap: 0.28, padding: 0.4 },
      children: [
        { id: 'checkpoint', label: 'Checkpoint', sub: 'source offsets · write-ahead log · state', kind: 'symbol', color: BLUE, icon: 'disk', cell: [0, 0] },
        { id: 'exactly-once', label: 'exactly-once', sub: 'replay + idempotent sinks', kind: 'symbol', color: GREEN, icon: 'shield', cell: [1, 0] },
      ],
    },
  ],
  edges: [
    // The trigger drives the query each cycle.
    { from: 'tr-microbatch', to: 'query' },
    // The left→right spine: sources append to the input table, the query reads it, produces the
    // result table, which is written to the sinks.
    { from: 'src', to: 'input' },
    { from: 'input', to: 'query' },
    { from: 'query', to: 'result' },
    { from: 'result', to: 'sink' },
    // The query keeps aggregations in the state store, which is persisted to the checkpoint.
    { from: 'query', to: 'state' },
    { from: 'state', to: 'checkpoint' },
  ],
}
