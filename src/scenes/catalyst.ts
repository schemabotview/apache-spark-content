import { type SceneSpec, BLUE, GREEN, ORANGE, PURPLE, TEAL, GRAY } from 'flow-engine'

// The `catalyst` scene — the second scene of the `spark-api` course. Where `api-stack` shows the
// STACK of altitudes, this unpacks the engine band (§4) into Catalyst's compile-down PIPELINE:
// how any structured query — DataFrame, Dataset, or SQL — becomes RDDs. Read left→right, in two
// bands that map to the two focus sections that follow:
//
//   LOGICAL  │ Query → Unresolved → Analyzed → Optimized      (§6: analysis + logical opt)
//            │           (catalog feeds analysis)
//   PHYSICAL │ Physical Plans → Cost Model → Selected → Codegen → RDDs   (§7: physical + Tungsten)
//
// Like the other Spark scenes it's a SOLID TOUR: §5 (the scene-switch overview) solidifies the
// whole pipeline framed whole; §6 lights the top LOGICAL band, §7 the bottom PHYSICAL band. Node
// ids group by band — logical `q/ulp/alp/olp/catalog`, physical `pp/cost/spp/codegen/rdds`.
export const catalyst: SceneSpec = {
  id: 'catalyst',
  title: 'Catalyst: how a query compiles',
  // Wide-and-short, two stacked bands (logical planning over physical planning).
  canvas: { width: 1360, height: 900 },
  grid: { cols: [1], rows: [1.12, 1], gap: 0.3, padding: 0.35 },
  nodes: [
    // ── band ①: LOGICAL planning — query → unresolved → analyzed → optimized (catalog feeds
    //    analysis). This is the "what to do" half; §6 frames it. ──
    {
      id: 'logical', label: 'Logical planning — what to do', kind: 'container', color: TEAL, cell: [0, 0],
      layout: { cols: [1, 1, 1, 1], rows: [1, 0.5], gap: 0.28, padding: 0.4 },
      children: [
        { id: 'q', label: 'Query', sub: 'DataFrame · Dataset · SQL', kind: 'symbol', color: BLUE, icon: 'terminal', cell: [0, 0] },
        { id: 'ulp', label: 'Unresolved Plan', sub: 'shape · names not bound', kind: 'symbol', color: GRAY, icon: 'workflow', cell: [1, 0] },
        { id: 'alp', label: 'Analyzed Plan', sub: 'names & types resolved', kind: 'symbol', color: TEAL, icon: 'brain', cell: [2, 0] },
        { id: 'olp', label: 'Optimized Plan', sub: 'rules applied', kind: 'symbol', color: GREEN, icon: 'gears', cell: [3, 0] },
        { id: 'catalog', label: 'Catalog', sub: 'tables · columns · types', kind: 'symbol', color: ORANGE, icon: 'database', cell: [2, 1] },
      ],
    },

    // ── band ②: PHYSICAL planning + codegen — candidate plans → cost model → selected → Tungsten
    //    codegen → RDDs. This is the "how to run it" half; §7 frames it. ──
    {
      id: 'physical', label: 'Physical planning & codegen — how to run it', kind: 'container', color: PURPLE, cell: [0, 1],
      layout: { cols: [1, 1, 1, 1, 1], rows: 1, gap: 0.28, padding: 0.4 },
      children: [
        { id: 'pp', label: 'Physical Plans', sub: 'candidate strategies', kind: 'symbol', color: PURPLE, icon: 'workflow', cell: [0, 0] },
        { id: 'cost', label: 'Cost Model', sub: 'estimate each', kind: 'symbol', color: GRAY, icon: 'barChart', cell: [1, 0] },
        { id: 'spp', label: 'Selected Plan', sub: 'the cheapest', kind: 'symbol', color: BLUE, icon: 'gears', cell: [2, 0] },
        { id: 'codegen', label: 'Whole-stage Codegen', sub: 'Tungsten · JVM bytecode', kind: 'symbol', color: GREEN, icon: 'memory', cell: [3, 0] },
        { id: 'rdds', label: 'RDDs', sub: 'run on the cluster', kind: 'symbol', color: ORANGE, icon: 'layers', cell: [4, 0] },
      ],
    },
  ],
  edges: [
    // Left→right flow within each band, plus the one wrap from the optimized logical plan down
    // into physical planning. Edge labels omitted (tight boxes tuck a wire label behind a node —
    // the evolution/cluster-topology precedent); the slides name each transition.
    { from: 'q', to: 'ulp' },
    { from: 'ulp', to: 'alp' },
    { from: 'catalog', to: 'alp' },
    { from: 'alp', to: 'olp' },
    // the logical → physical hand-off (the snake wrap).
    { from: 'olp', to: 'pp' },
    { from: 'pp', to: 'cost' },
    { from: 'cost', to: 'spp' },
    { from: 'spp', to: 'codegen' },
    { from: 'codegen', to: 'rdds' },
  ],
}
