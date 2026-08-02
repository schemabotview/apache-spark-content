import { type SceneSpec, BLUE, GREEN, ORANGE, PURPLE, TEAL, RED, GRAY } from 'flow-engine'

// The `evolution` scene — a TALL, top-to-bottom timeline. A left spine of five era steps
// (Big data → Hadoop 1 → Hadoop 2/YARN → Spark 1 → Spark 2); each spine step sits beside a
// right-hand DETAIL band that expands that era's architecture. The course's per-section
// camera zooms to one band at a time as it travels down the spine — so this canvas is much
// taller than the pane, and whole-scene framing is never used at play time.
//
// Every node is authored here (the ghost skeleton); the beats in content/courses/evolution.ts
// solidify each band as its section plays. Node ids are grouped `spine-*`, `p-*`, `h1-*`,
// `h2-*`, `s1-*`, `s2-*` so a beat's solidify targets read as "this era's cluster".
export const evolution: SceneSpec = {
  id: 'evolution',
  title: 'The road to Spark',
  canvas: { width: 1040, height: 1600 },
  // Two columns — a narrow spine and a wide detail column — over five era rows.
  grid: { cols: [1, 2.6], rows: [0.8, 1.2, 1.2, 1.2, 1.35], gap: 0.35, padding: 0.4 },
  nodes: [
    // ── the left spine: five timeline steps, wired top→bottom into a single line ──
    { id: 'spine-problem', label: 'Big data', kind: 'symbol', color: GRAY, icon: 'database', cell: [0, 0] },
    { id: 'spine-h1', label: 'Hadoop 1', sub: '2006', kind: 'symbol', color: GRAY, icon: 'server', cell: [0, 1] },
    { id: 'spine-h2', label: 'Hadoop 2 / YARN', sub: '2013', kind: 'symbol', color: GRAY, icon: 'workflow', cell: [0, 2] },
    { id: 'spine-s1', label: 'Spark 1', sub: '2014', kind: 'symbol', color: GRAY, icon: 'engine', cell: [0, 3] },
    { id: 'spine-s2', label: 'Spark 2', sub: '2016', kind: 'symbol', color: GRAY, icon: 'layers', cell: [0, 4] },

    // ── band ①: the problem ──
    {
      id: 'prob', label: 'The problem', kind: 'container', color: GRAY, cell: [1, 0],
      layout: { cols: [1, 1], rows: 1, gap: 0.35, padding: 0.5 },
      children: [
        { id: 'p-bigdata', label: 'Data > one machine', kind: 'symbol', color: ORANGE, cell: [0, 0] },
        { id: 'p-scaleout', label: 'Scale out on commodity HW', kind: 'symbol', color: GREEN, cell: [1, 0] },
      ],
    },

    // ── band ②: Hadoop 1 — HDFS + MapReduce, driven by one JobTracker ──
    {
      id: 'h1', label: 'Hadoop 1', kind: 'container', color: BLUE, cell: [1, 1],
      layout: { cols: [1, 1], rows: [1, 1, 0.75], gap: 0.3, padding: 0.5 },
      children: [
        {
          id: 'h1-hdfs', label: 'HDFS', kind: 'container', color: ORANGE, icon: 'database', cell: [0, 0],
          layout: { cols: [1, 1], rows: 1, gap: 0.3, padding: 0.5 },
          children: [
            { id: 'h1-namenode', label: 'NameNode', kind: 'symbol', color: BLUE, cell: [0, 0] },
            { id: 'h1-datanodes', label: 'DataNodes', kind: 'symbol', color: ORANGE, icon: 'server', cell: [1, 0] },
          ],
        },
        { id: 'h1-mapreduce', label: 'MapReduce', sub: 'compute model', kind: 'symbol', color: GREEN, icon: 'gears', cell: [1, 0] },
        { id: 'h1-jobtracker', label: 'JobTracker', kind: 'symbol', color: BLUE, icon: 'workflow', cell: [0, 1] },
        { id: 'h1-tasktrackers', label: 'TaskTrackers', kind: 'symbol', color: GREEN, cell: [1, 1] },
        { id: 'h1-limit', label: 'JobTracker does scheduling + resources', sub: 'bottleneck · MapReduce-only · disk-heavy', kind: 'symbol', color: RED, cell: [0, 2, 2, 1] },
      ],
    },

    // ── band ③: Hadoop 2 — YARN splits resource management from compute ──
    {
      id: 'h2', label: 'Hadoop 2 · YARN', kind: 'container', color: BLUE, cell: [1, 2],
      layout: { cols: [1, 1, 1], rows: [1, 0.8], gap: 0.3, padding: 0.5 },
      children: [
        { id: 'h2-rm', label: 'ResourceManager', kind: 'symbol', color: BLUE, icon: 'workflow', cell: [0, 0] },
        { id: 'h2-am', label: 'ApplicationMaster', kind: 'symbol', color: BLUE, cell: [1, 0] },
        { id: 'h2-nm', label: 'NodeManagers', kind: 'symbol', color: GREEN, icon: 'server', cell: [2, 0] },
        { id: 'h2-decouple', label: 'compute ⟂ resource mgmt', kind: 'symbol', color: TEAL, cell: [0, 1] },
        { id: 'h2-engines', label: 'many engines — not just MapReduce', kind: 'symbol', color: TEAL, icon: 'layers', cell: [1, 1, 2, 1] },
      ],
    },

    // ── band ④: Spark 1 — in-memory RDDs on a DAG scheduler, running on YARN ──
    {
      id: 's1', label: 'Spark 1', kind: 'container', color: GREEN, cell: [1, 3],
      layout: { cols: [1, 1, 1], rows: [1, 0.8], gap: 0.3, padding: 0.5 },
      children: [
        { id: 's1-driver', label: 'Driver', kind: 'symbol', color: BLUE, icon: 'brain', cell: [0, 0] },
        { id: 's1-rdd', label: 'RDD', sub: 'in-memory dataset', kind: 'symbol', color: GREEN, icon: 'layers', cell: [1, 0] },
        { id: 's1-dag', label: 'DAG Scheduler', kind: 'symbol', color: TEAL, icon: 'workflow', cell: [2, 0] },
        { id: 's1-onyarn', label: 'runs on YARN', kind: 'symbol', color: GRAY, cell: [0, 1] },
        { id: 's1-fast', label: '10–100× faster for iterative / interactive', kind: 'symbol', color: GREEN, cell: [1, 1, 2, 1] },
      ],
    },

    // ── band ⑤: Spark 2 — the unified, optimized engine ──
    {
      id: 's2', label: 'Spark 2', kind: 'container', color: PURPLE, cell: [1, 4],
      layout: { cols: [1, 1, 1], rows: [1, 1], gap: 0.3, padding: 0.5 },
      children: [
        { id: 's2-session', label: 'SparkSession', kind: 'symbol', color: BLUE, cell: [0, 0] },
        { id: 's2-df', label: 'DataFrame / Dataset', kind: 'symbol', color: PURPLE, icon: 'layers', cell: [1, 0] },
        { id: 's2-catalyst', label: 'Catalyst optimizer', kind: 'symbol', color: TEAL, icon: 'brain', cell: [2, 0] },
        { id: 's2-tungsten', label: 'Tungsten', sub: 'codegen · off-heap', kind: 'symbol', color: GREEN, icon: 'memory', cell: [0, 1] },
        { id: 's2-streaming', label: 'Structured Streaming', kind: 'symbol', color: TEAL, icon: 'stream', cell: [1, 1] },
        { id: 's2-unified', label: 'one engine: batch · SQL · ML · stream', kind: 'symbol', color: PURPLE, cell: [2, 1] },
      ],
    },
  ],
  edges: [
    // the spine timeline, top→bottom
    { from: 'spine-problem', to: 'spine-h1' },
    { from: 'spine-h1', to: 'spine-h2' },
    { from: 'spine-h2', to: 'spine-s1' },
    { from: 'spine-s1', to: 'spine-s2' },
    // band ②: HDFS blocks + JobTracker assigns TaskTrackers
    { from: 'h1-namenode', to: 'h1-datanodes', label: 'blocks' },
    { from: 'h1-jobtracker', to: 'h1-tasktrackers', label: 'assign' },
    // band ③: RM negotiates AM, launches containers on NodeManagers
    { from: 'h2-rm', to: 'h2-am', label: 'negotiate' },
    { from: 'h2-rm', to: 'h2-nm', label: 'containers' },
    // band ④: driver → RDD → DAG, and Spark runs ON YARN (edge back up to band ③)
    { from: 's1-driver', to: 's1-rdd' },
    { from: 's1-rdd', to: 's1-dag' },
    { from: 's1-onyarn', to: 'h2-rm', label: 'submit' },
    // band ⑤: session → DataFrame → Catalyst → Tungsten
    { from: 's2-session', to: 's2-df' },
    { from: 's2-df', to: 's2-catalyst', label: 'optimize' },
    { from: 's2-catalyst', to: 's2-tungsten' },
  ],
}
