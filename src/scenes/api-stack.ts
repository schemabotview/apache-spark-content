import { type SceneSpec, BLUE, GREEN, ORANGE, PURPLE, TEAL, GRAY } from 'flow-engine'

// The `api-stack` scene — the SPINE of the `spark-api` course ("The layers you write against").
// A tall, top-to-bottom STACK of altitudes: the higher a band sits, the higher-level and more
// declarative the thing you write; the lower it sits, the closer to the physical core. Two
// stories are drawn in one picture:
//
//   ┌ LIBRARIES ─ Structured Streaming · MLlib · GraphX ┐   the WORKLOADS (horizontal)
//   ├ STRUCTURED APIs ─ DataFrame · Dataset · Spark SQL ┤   what you write (declarative)
//   ├ THE ENGINE ─ Catalyst optimizer · Tungsten        ┤   plans + compiles your query
//   └ RDD ─ the low-level core (resilient · partitioned) ┘   the physical layer it runs on
//
// The vertical read is the course's thesis: every structured query compiles DOWN through the
// engine to RDDs — the same core the `spark-architecture` course runs across. The top LIBRARIES
// band is a teaser (it's lit in the overview + closer, never its own taught section) — each of
// those libraries is its own future course; here we build the foundation they stand on. Note
// Spark SQL is deliberately NOT repeated in the top band: it IS the structured layer (band ①),
// not a library sitting on the engine.
//
// Like the other Spark scenes this is a SOLID TOUR: the overview solidifies the whole stack, then
// each section lights one band as the camera travels (RDD core → structured APIs → the engine),
// detouring to the sibling `catalyst` scene for the compile-down pipeline. Node ids are grouped
// by band — `lib-*`, `sa-*`, `eng-*`, `rdd-*` — so a beat's solidify targets read as "this band".
export const apiStack: SceneSpec = {
  id: 'api-stack',
  title: 'The layers you write against',
  // Wide-and-short (like cluster-topology): the overview frames the whole canvas, so a squarer
  // canvas lets the per-band camera zoom in more → larger on-screen labels.
  canvas: { width: 1300, height: 1320 },
  // One column, four stacked bands: a thin libraries strip on top, the tall structured-API band,
  // a medium engine band, then the RDD core. Tight gaps to minimise whitespace.
  grid: { cols: [1], rows: [0.62, 1.12, 0.72, 0.9], gap: 0.28, padding: 0.35 },
  nodes: [
    // ── band ⓪: the LIBRARIES — the workloads built ON the structured core (teaser band) ──
    {
      id: 'libs', label: 'Libraries — the workloads you build', kind: 'container', color: GRAY, cell: [0, 0],
      layout: { cols: [1, 1, 1], rows: 1, gap: 0.28, padding: 0.45 },
      children: [
        { id: 'lib-streaming', label: 'Structured Streaming', sub: 'unbounded data', kind: 'symbol', color: TEAL, icon: 'stream', cell: [0, 0] },
        { id: 'lib-mllib', label: 'MLlib', sub: 'machine learning', kind: 'symbol', color: GREEN, icon: 'brain', cell: [1, 0] },
        { id: 'lib-graphx', label: 'GraphX / GraphFrames', sub: 'graphs', kind: 'symbol', color: BLUE, icon: 'branch', cell: [2, 0] },
      ],
    },

    // ── band ①: the STRUCTURED APIs — what you actually write, declaratively ──
    {
      id: 'sa', label: 'Structured APIs — what you write', kind: 'container', color: PURPLE, cell: [0, 1],
      layout: { cols: [1, 1, 1], rows: 1, gap: 0.28, padding: 0.45 },
      children: [
        { id: 'sa-dataframe', label: 'DataFrame', sub: 'table of Rows · untyped cols', kind: 'symbol', color: BLUE, icon: 'table', cell: [0, 0] },
        { id: 'sa-dataset', label: 'Dataset[T]', sub: 'typed JVM objects', kind: 'symbol', color: PURPLE, icon: 'layers', cell: [1, 0] },
        { id: 'sa-sql', label: 'Spark SQL', sub: 'SQL text · catalog · views', kind: 'symbol', color: TEAL, icon: 'terminal', cell: [2, 0] },
      ],
    },

    // ── band ②: THE ENGINE — Catalyst plans the query, Tungsten compiles it (unpacked in the
    //    sibling `catalyst` scene). Sits between what you declare and how it physically runs. ──
    {
      id: 'eng', label: 'The engine — plans & compiles your query', kind: 'container', color: TEAL, cell: [0, 2],
      layout: { cols: [1, 1], rows: 1, gap: 0.28, padding: 0.45 },
      children: [
        { id: 'eng-catalyst', label: 'Catalyst', sub: 'query optimizer', kind: 'symbol', color: TEAL, icon: 'brain', cell: [0, 0] },
        { id: 'eng-tungsten', label: 'Tungsten', sub: 'codegen · off-heap', kind: 'symbol', color: GREEN, icon: 'memory', cell: [1, 0] },
      ],
    },

    // ── band ③: the RDD core — the low-level foundation everything compiles to (and the
    //    escape-hatch API you can write directly, bypassing the optimizer). ──
    {
      id: 'rdd', label: 'RDD — the low-level core', kind: 'container', color: ORANGE, cell: [0, 3],
      layout: { cols: [1, 1, 1], rows: 1, gap: 0.28, padding: 0.45 },
      children: [
        { id: 'rdd-resilient', label: 'resilient', sub: 'lineage · fault-tolerant', kind: 'symbol', color: GREEN, cell: [0, 0] },
        { id: 'rdd-partitioned', label: 'partitioned', sub: 'a distributed collection', kind: 'symbol', color: ORANGE, icon: 'layers', cell: [1, 0] },
        { id: 'rdd-physical', label: 'the physical layer', sub: 'what everything runs on', kind: 'symbol', color: GRAY, icon: 'server', cell: [2, 0] },
      ],
    },
  ],
  edges: [
    // The compile-down spine, straight down the middle: libraries rest on the structured APIs,
    // structured queries enter the engine, the engine compiles them to RDDs. Kept minimal (one
    // representative wire per hop) — the h1/h2-style tight bands make extra edges tuck behind
    // nodes, so the slides carry the finer relationships. (evolution/cluster-topology precedent.)
    { from: 'lib-mllib', to: 'sa-dataframe' },
    { from: 'sa-dataset', to: 'eng-catalyst' },
    { from: 'eng-catalyst', to: 'eng-tungsten' },
    { from: 'eng-tungsten', to: 'rdd-partitioned' },
  ],
}
