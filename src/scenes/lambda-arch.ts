import { type SceneSpec, BLUE, GREEN, ORANGE, PURPLE, TEAL, GRAY } from 'flow-engine'

// The `lambda-arch` scene — the master map of the `capstone` course ("Everything, end to end").
// It shows the whole LAMBDA-architecture pipeline the project builds toward: one clickstream, fed
// into two layers, merged for serving, and run on a cluster. Shape (a branch → merge diamond):
//
//        ┌──────────── SOURCES ────────────┐   (Data Lake files · Kafka real-time)
//        └──────┬────────────────────┬──────┘
//         BATCH LAYER (nightly)   SPEED LAYER (stream)
//         read▸clean▸agg▸view     read▸enrich▸window▸view
//               └────────┬───────────┘
//               SERVING LAYER  (merge history + recent → one answer)
//        ── RUN IT: spark-submit · cluster · Spark UI ──
//
// This ONE scene carries the WHOLE capstone (no separate code-walk scenes): the overview (§1),
// serving (§10) and closer (§13) frame it whole; every build section stays on this map and
// highlights its stage node (`focus: [<band>, <stage>]` → camera frames the band, only the stage
// lights, the rest dims) while the RIGHT slide carries that stage's code. Batch is on the LEFT,
// speed on the RIGHT. Node ids: `src-*`, `ba-*` batch, `sp-*` speed, `sv-*` serving, `run-*` deploy.
export const lambdaArch: SceneSpec = {
  id: 'lambda-arch',
  title: 'Everything, end to end',
  canvas: { width: 1440, height: 1220 },
  // Two columns so the speed + batch layers sit side by side; sources/serving/deploy span both.
  grid: { cols: [1, 1], rows: [0.5, 1.6, 0.6, 0.42], gap: 0.24, padding: 0.12 },
  nodes: [
    // ── SOURCES — one event stream, two entry points (real-time + the lake) ──
    {
      id: 'sources', label: 'Sources — one event stream, two entry points', kind: 'container', color: GRAY, cell: [0, 0, 2, 1],
      layout: { cols: [1, 1], rows: 1, gap: 0.28, padding: 0.4 },
      children: [
        // Left column feeds the batch layer (the lake); right column feeds the speed layer (Kafka).
        { id: 'src-lake', label: 'Data Lake', sub: 'raw events as Parquet files', kind: 'symbol', color: ORANGE, icon: 'lake', cell: [0, 0] },
        { id: 'src-kafka', label: 'Kafka', sub: 'real-time events', kind: 'symbol', color: BLUE, icon: 'stream', cell: [1, 0] },
      ],
    },

    // ── SPEED LAYER (RIGHT) — Structured Streaming: low-latency, approximate "what's happening now" ──
    {
      id: 'speed', label: 'Speed layer — streaming · low latency', kind: 'container', color: TEAL, cell: [1, 1],
      layout: { cols: [1], rows: [1, 1, 1, 1], gap: 0.28, padding: 0.42 },
      children: [
        { id: 'sp-read', label: 'readStream', sub: 'from Kafka', kind: 'symbol', color: TEAL, icon: 'stream', cell: [0, 0] },
        { id: 'sp-enrich', label: 'enrich', sub: 'broadcast-join product dim', kind: 'symbol', color: BLUE, icon: 'share', cell: [0, 1] },
        { id: 'sp-window', label: 'window + watermark', sub: 'revenue per 5-min · per category', kind: 'symbol', color: PURPLE, icon: 'clock', cell: [0, 2] },
        { id: 'sp-view', label: 'real-time view', sub: 'writeStream + checkpoint', kind: 'symbol', color: GREEN, icon: 'table', cell: [0, 3] },
      ],
    },

    // ── BATCH LAYER (LEFT) — a nightly job: accurate, reprocesses the full history ──
    {
      id: 'batch', label: 'Batch layer — nightly · accurate', kind: 'container', color: BLUE, cell: [0, 1],
      layout: { cols: [1], rows: [1, 1, 1, 1], gap: 0.28, padding: 0.42 },
      children: [
        { id: 'ba-read', label: 'read the lake', sub: 'Parquet · pushdown', kind: 'symbol', color: ORANGE, icon: 'database', cell: [0, 0] },
        { id: 'ba-clean', label: 'clean + dedup', sub: 'filter · withColumn', kind: 'symbol', color: TEAL, icon: 'funnel', cell: [0, 1] },
        { id: 'ba-agg', label: 'join + aggregate', sub: 'sort-merge · groupBy', kind: 'symbol', color: BLUE, icon: 'gears', cell: [0, 2] },
        { id: 'ba-view', label: 'batch view', sub: 'partitioned write', kind: 'symbol', color: GREEN, icon: 'table', cell: [0, 3] },
      ],
    },

    // ── SERVING LAYER — merge the accurate history with the latest real-time slice ──
    {
      id: 'serving', label: 'Serving layer — merge the two views', kind: 'container', color: PURPLE, cell: [0, 2, 2, 1],
      layout: { cols: [1, 1], rows: 1, gap: 0.28, padding: 0.4 },
      children: [
        { id: 'sv-merge', label: 'merge', sub: 'batch history + recent stream', kind: 'symbol', color: PURPLE, icon: 'share', cell: [0, 0] },
        { id: 'sv-answer', label: 'the answer', sub: 'revenue by category, up to now', kind: 'symbol', color: GREEN, icon: 'barChart', cell: [1, 0] },
      ],
    },

    // ── RUN IT — the whole thing packaged, submitted, and watched (foundation strip) ──
    {
      id: 'deploy', label: 'Run it — package · submit · watch', kind: 'container', color: GRAY, cell: [0, 3, 2, 1],
      layout: { cols: [1, 1, 1], rows: 1, gap: 0.26, padding: 0.4 },
      children: [
        { id: 'run-submit', label: 'spark-submit', sub: 'deploy mode · config', kind: 'symbol', color: BLUE, icon: 'terminal', cell: [0, 0] },
        { id: 'run-cluster', label: 'on a cluster', sub: 'driver + executors', kind: 'symbol', color: GREEN, icon: 'server', cell: [1, 0] },
        { id: 'run-tune', label: 'observe + tune', sub: 'Spark UI · AQE · cache', kind: 'symbol', color: ORANGE, icon: 'barChart', cell: [2, 0] },
      ],
    },
  ],
  edges: [
    // Sources fan into the two layers: Kafka feeds the speed layer, the lake feeds the batch layer.
    { from: 'src-kafka', to: 'sp-read' },
    { from: 'src-lake', to: 'ba-read' },
    // Speed layer, top→bottom.
    { from: 'sp-read', to: 'sp-enrich' },
    { from: 'sp-enrich', to: 'sp-window' },
    { from: 'sp-window', to: 'sp-view' },
    // Batch layer, top→bottom.
    { from: 'ba-read', to: 'ba-clean' },
    { from: 'ba-clean', to: 'ba-agg' },
    { from: 'ba-agg', to: 'ba-view' },
    // Both layers merge in the serving layer, which yields the one answer.
    { from: 'sp-view', to: 'sv-merge' },
    { from: 'ba-view', to: 'sv-merge' },
    { from: 'sv-merge', to: 'sv-answer' },
    // The deploy strip is the foundation the whole pipeline runs on — carried in narration, no
    // spine edge (like the streaming durability band).
  ],
}
