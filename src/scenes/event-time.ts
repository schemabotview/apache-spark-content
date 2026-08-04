import { type SceneSpec, BLUE, GREEN, ORANGE, TEAL, RED, GRAY } from 'flow-engine'

// The `event-time` scene — the second scene of the `spark-streaming` course. Where
// `streaming-model` shows the dataflow (a stream is an unbounded table), this unpacks the part
// that makes streaming genuinely different from batch: reasoning over EVENT TIME when data
// arrives late and out of order. Three stacked bands, top→bottom:
//
//   EVENTS ── arrive out of order by event time (one late, one too-late)       (band ①)
//       │  bucket by EVENT TIME, not arrival time
//   WINDOWS ── three labelled mini-TIMELINES that SHOW each window kind:        (band ②)
//              Tumbling  [W1][W2][W3][W4]        contiguous, non-overlapping
//              Sliding   [W1 ][W3 ] / [ W2 ]     offset row → overlap
//              Session   [S1 ] [S2] [S3]         irregular widths + gaps
//       │  each window aggregates its events, held in state
//   WATERMARK ── max event-time seen − threshold                               (band ③)
//        → windows older than it finalize & evict · events later than it drop
//
// The windows band is drawn as time-bars (à la the canonical tumbling/sliding/session diagram)
// so the three kinds read INSTANTLY rather than as a text label. Solid tour like the other
// scenes: §7 (the scene switch) solidifies the whole scene and frames the top two bands (events
// + windows); §8 pans down to the watermark band. Node ids group by band — `ev-*` events,
// `wt-*`/`ws-*`/`wg-*` the three window kinds, `wm-*` watermark.
export const eventTime: SceneSpec = {
  id: 'event-time',
  title: 'Event time & watermarks',
  canvas: { width: 1340, height: 1300 },
  grid: { cols: [1], rows: [0.6, 2.0, 0.65], gap: 0.3, padding: 0.32 },
  nodes: [
    // ── band ①: the EVENTS — labelled by their EVENT TIME, arriving in a jumbled order (so the
    //    arrival order ≠ event time). One arrives late, one arrives too late to count. ──
    {
      id: 'events', label: 'Events — arrive out of order (labelled by event time)', kind: 'container', color: GRAY, cell: [0, 0],
      layout: { cols: [1, 1, 1, 1, 1], rows: 1, gap: 0.26, padding: 0.4 },
      children: [
        { id: 'ev-1', label: '10:07', sub: 'on time', kind: 'symbol', color: GREEN, cell: [0, 0] },
        { id: 'ev-2', label: '10:02', sub: 'on time', kind: 'symbol', color: GREEN, cell: [1, 0] },
        { id: 'ev-3', label: '10:06', sub: 'on time', kind: 'symbol', color: GREEN, cell: [2, 0] },
        { id: 'ev-late', label: '10:01', sub: 'late — still counts', kind: 'symbol', color: ORANGE, cell: [3, 0] },
        { id: 'ev-drop', label: '09:58', sub: 'too late — dropped', kind: 'symbol', color: RED, cell: [4, 0] },
      ],
    },

    // ── band ②: the WINDOWS — three labelled mini-timelines, one per kind, drawn as time-bars so
    //    the shapes read at a glance. Each timeline container's own title is its row label; the
    //    coloured bars inside are the windows over a shared 10:00–10:20 event-time axis. ──
    {
      id: 'windows', label: 'Windows — bucket by event time (three kinds)', kind: 'container', color: TEAL, cell: [0, 1],
      layout: { cols: [1], rows: [1, 1.25, 1], gap: 0.32, padding: 0.4 },
      children: [
        // Tumbling — fixed 5-min buckets, contiguous and non-overlapping. Alternating colours
        // (like the canonical diagram) so adjacent windows read apart at a glance.
        {
          id: 'wt', label: 'Tumbling · fixed 5-min · non-overlapping', kind: 'container', color: GRAY, cell: [0, 0],
          layout: { cols: [1, 1, 1, 1], rows: 1, gap: 0.14, padding: 0.32 },
          children: [
            { id: 'wt-1', label: 'W1', sub: '10:00–05', kind: 'symbol', color: BLUE, cell: [0, 0] },
            { id: 'wt-2', label: 'W2', sub: '10:05–10', kind: 'symbol', color: ORANGE, cell: [1, 0] },
            { id: 'wt-3', label: 'W3', sub: '10:10–15', kind: 'symbol', color: BLUE, cell: [2, 0] },
            { id: 'wt-4', label: 'W4', sub: '10:15–20', kind: 'symbol', color: ORANGE, cell: [3, 0] },
          ],
        },
        // Sliding — 10-min windows every 5-min. The middle window sits on an offset second row so
        // it visibly OVERLAPS the two on the top row (that overlap is the whole point).
        {
          id: 'ws', label: 'Sliding · 10-min, slide 5-min · overlapping', kind: 'container', color: GRAY, cell: [0, 1],
          layout: { cols: [1, 1, 1, 1, 1, 1, 1, 1], rows: [1, 1], gap: 0.14, padding: 0.32 },
          children: [
            { id: 'ws-1', label: 'W1', sub: '10:00–10', kind: 'symbol', color: BLUE, cell: [0, 0, 4, 1] },
            { id: 'ws-3', label: 'W3', sub: '10:10–20', kind: 'symbol', color: ORANGE, cell: [4, 0, 4, 1] },
            { id: 'ws-2', label: 'W2 — overlaps W1 & W3', sub: '10:05–15', kind: 'symbol', color: GREEN, cell: [2, 1, 4, 1] },
          ],
        },
        // Session — windows defined by gaps of inactivity, so they vary in width and have gaps
        // between them (empty columns).
        {
          id: 'wg', label: 'Session · gap-based · variable width', kind: 'container', color: GRAY, cell: [0, 2],
          layout: { cols: [1, 1, 1, 1, 1, 1, 1, 1], rows: 1, gap: 0.14, padding: 0.32 },
          children: [
            { id: 'wg-1', label: 'S1', sub: '10:00–07', kind: 'symbol', color: BLUE, cell: [0, 0, 3, 1] },
            { id: 'wg-2', label: 'S2', sub: '10:10–15', kind: 'symbol', color: ORANGE, cell: [4, 0, 2, 1] },
            { id: 'wg-3', label: 'S3', sub: '10:18–20', kind: 'symbol', color: BLUE, cell: [7, 0, 1, 1] },
          ],
        },
      ],
    },

    // ── band ③: the WATERMARK — the moving line that says "no more events older than this".
    //    Older windows finalize & evict from state; later-than-this events are dropped. ──
    {
      id: 'watermark', label: 'Watermark — the line for lateness', kind: 'container', color: BLUE, cell: [0, 2],
      layout: { cols: [1, 1, 1], rows: 1, gap: 0.28, padding: 0.4 },
      children: [
        { id: 'wm-threshold', label: 'watermark', sub: 'max event-time − threshold', kind: 'symbol', color: BLUE, icon: 'clock', cell: [0, 0] },
        { id: 'wm-evict', label: 'finalize & evict', sub: 'windows older than it', kind: 'symbol', color: GREEN, icon: 'gears', cell: [1, 0] },
        { id: 'wm-drop', label: 'drop too-late', sub: 'events later than it', kind: 'symbol', color: RED, icon: 'funnel', cell: [2, 0] },
      ],
    },
  ],
  edges: [
    // Events bucket into windows; windows are evaluated against the watermark, which drives both
    // eviction and dropping. Edge labels omitted (tight boxes) — the slides carry the detail.
    { from: 'events', to: 'windows' },
    { from: 'windows', to: 'wm-threshold' },
    { from: 'wm-threshold', to: 'wm-evict' },
    { from: 'wm-threshold', to: 'wm-drop' },
  ],
}
