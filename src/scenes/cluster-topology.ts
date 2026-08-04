import { type SceneSpec, BLUE, GREEN, ORANGE, PURPLE, TEAL, GRAY } from 'flow-engine'

// The `cluster-topology` scene — the SPINE of the `spark-architecture` course. A tall,
// top-to-bottom picture of the three processes a Spark job runs across:
//
//     DRIVER  (your program: plans + coordinates)
//        │  "I need N executors"
//     CLUSTER MANAGER  (hands out machines)
//        │  launches
//     WORKER NODES  (executors: run tasks · hold cached data)
//
// It opens whole-ghosted (the overview section), then each section lights one band as the
// camera travels down: driver → deploy modes → cluster manager → workers. Sections 9–10 come
// BACK to the workers band (tasks landing on slots, caching). The job → stage → task
// decomposition lives in the sibling `execution` scene, not here.
//
// Node ids are grouped by band — `d-*` driver, `dm-*` deploy mode, `cm-*` cluster manager,
// `w{1,2,3}-*` the three workers — so a beat's solidify targets read as "this band's cluster".
// Colors follow the canonical role palette: blue driver · purple coordinator · green executor
// · teal compute-slots · orange storage/memory.
export const clusterTopology: SceneSpec = {
  id: 'cluster-topology',
  title: 'How a Spark job runs',
  // Deliberately WIDE-and-short (not tall-and-thin): the overview frames the whole canvas, so
  // a squarer canvas lets the camera zoom in more → larger on-screen labels. (A tall column
  // reads tiny at whole-scene fit.)
  canvas: { width: 1300, height: 1360 },
  // One column, four stacked bands: the driver, a thin deploy-mode strip, the cluster manager,
  // then the widest band — the three worker nodes. Tight gaps/padding to minimise whitespace.
  grid: { cols: [1], rows: [1.05, 0.42, 0.85, 1.5], gap: 0.28, padding: 0.35 },
  nodes: [
    // ── band ②③: the DRIVER — your program's process; plans the work, coordinates it ──
    {
      id: 'd', label: 'Driver', sub: 'your program', kind: 'container', color: BLUE, cell: [0, 0],
      layout: { cols: [1, 1, 1], rows: [0.75, 1], gap: 0.28, padding: 0.45 },
      children: [
        { id: 'd-session', label: 'SparkSession', sub: 'the entry point', kind: 'symbol', color: BLUE, icon: 'terminal', cell: [0, 0, 3, 1] },
        { id: 'd-dag', label: 'DAG Scheduler', sub: 'code → stages', kind: 'symbol', color: TEAL, icon: 'workflow', cell: [0, 1] },
        { id: 'd-task', label: 'Task Scheduler', sub: 'stages → tasks', kind: 'symbol', color: BLUE, icon: 'gears', cell: [1, 1] },
        { id: 'd-track', label: 'tracks executors', sub: 'heartbeats', kind: 'symbol', color: GRAY, icon: 'clock', cell: [2, 1] },
      ],
    },

    // ── band ④: DEPLOY MODE — where does the driver process actually run? ──
    {
      id: 'deploy', label: 'Where does the driver run?', kind: 'container', color: GRAY, cell: [0, 1],
      layout: { cols: [1, 1], rows: 1, gap: 0.28, padding: 0.45 },
      children: [
        { id: 'dm-client', label: 'client mode', sub: 'driver on the submit host', kind: 'symbol', color: GRAY, cell: [0, 0] },
        { id: 'dm-cluster', label: 'cluster mode', sub: 'driver inside the cluster', kind: 'symbol', color: GRAY, cell: [1, 0] },
      ],
    },

    // ── band ⑤: the CLUSTER MANAGER — owns the machines, launches executors on request ──
    {
      id: 'cm', label: 'Cluster Manager', kind: 'container', color: PURPLE, cell: [0, 2],
      layout: { cols: [1, 1, 1, 1], rows: [0.8, 1], gap: 0.28, padding: 0.45 },
      children: [
        { id: 'cm-alloc', label: 'allocates resources', sub: 'grants containers to the driver', kind: 'symbol', color: PURPLE, icon: 'workflow', cell: [0, 0, 4, 1] },
        { id: 'cm-standalone', label: 'Standalone', kind: 'symbol', color: GRAY, cell: [0, 1] },
        { id: 'cm-yarn', label: 'YARN', kind: 'symbol', color: GRAY, cell: [1, 1] },
        { id: 'cm-k8s', label: 'Kubernetes', kind: 'symbol', color: GRAY, cell: [2, 1] },
        { id: 'cm-mesos', label: 'Mesos', kind: 'symbol', color: GRAY, cell: [3, 1] },
      ],
    },

    // ── band ⑥: the WORKER NODES — each hosts an executor (a JVM) that runs tasks in its
    //    slots and caches data in its memory. Drawn as three identical workers. ──
    {
      id: 'workers', label: 'Worker Nodes', kind: 'container', color: GREEN, cell: [0, 3],
      layout: { cols: [1, 1, 1], rows: 1, gap: 0.3, padding: 0.3 },
      children: [
        {
          id: 'w1', label: 'Worker Node', kind: 'container', color: GREEN, cell: [0, 0],
          layout: { cols: [1], rows: [1, 0.85, 0.85], gap: 0.26, padding: 0.3 },
          children: [
            { id: 'w1-exec', label: 'Executor', sub: 'JVM', kind: 'symbol', color: GREEN, icon: 'box', cell: [0, 0] },
            { id: 'w1-slots', label: 'slots', sub: 'cores → tasks', kind: 'symbol', color: TEAL, icon: 'gears', cell: [0, 1] },
            { id: 'w1-cache', label: 'cache', sub: 'in-memory', kind: 'symbol', color: ORANGE, icon: 'memory', cell: [0, 2] },
          ],
        },
        {
          id: 'w2', label: 'Worker Node', kind: 'container', color: GREEN, cell: [1, 0],
          layout: { cols: [1], rows: [1, 0.85, 0.85], gap: 0.26, padding: 0.3 },
          children: [
            { id: 'w2-exec', label: 'Executor', sub: 'JVM', kind: 'symbol', color: GREEN, icon: 'box', cell: [0, 0] },
            { id: 'w2-slots', label: 'slots', sub: 'cores → tasks', kind: 'symbol', color: TEAL, icon: 'gears', cell: [0, 1] },
            { id: 'w2-cache', label: 'cache', sub: 'in-memory', kind: 'symbol', color: ORANGE, icon: 'memory', cell: [0, 2] },
          ],
        },
        {
          id: 'w3', label: 'Worker Node', kind: 'container', color: GREEN, cell: [2, 0],
          layout: { cols: [1], rows: [1, 0.85, 0.85], gap: 0.26, padding: 0.3 },
          children: [
            { id: 'w3-exec', label: 'Executor', sub: 'JVM', kind: 'symbol', color: GREEN, icon: 'box', cell: [0, 0] },
            { id: 'w3-slots', label: 'slots', sub: 'cores → tasks', kind: 'symbol', color: TEAL, icon: 'gears', cell: [0, 1] },
            { id: 'w3-cache', label: 'cache', sub: 'in-memory', kind: 'symbol', color: ORANGE, icon: 'memory', cell: [0, 2] },
          ],
        },
      ],
    },
  ],
  edges: [
    // Inside the driver: plan, then schedule.
    { from: 'd-dag', to: 'd-task' },
    // Driver → cluster manager: the request for resources.
    { from: 'd-task', to: 'cm-alloc' },
    // Cluster manager → workers: it launches an executor on each granted node.
    { from: 'cm-alloc', to: 'w1-exec' },
    { from: 'cm-alloc', to: 'w2-exec' },
    { from: 'cm-alloc', to: 'w3-exec' },
    // Task dispatch (drawn in section 9): the driver's Task Scheduler ships tasks straight to a
    // free slot on each executor. Long top→bottom edges, only drawn on the section that frames
    // this hand-off (task scheduler + slots lit, the bands between dimmed).
    { from: 'd-task', to: 'w1-slots' },
    { from: 'd-task', to: 'w2-slots' },
    { from: 'd-task', to: 'w3-slots' },
  ],
}
