import type { Course } from 'flow-engine'

// Course: "The stream is a table" — Structured Streaming, the course the `spark-api` closer teed
// up ("Structured Streaming takes this same stack to live data"). Its whole thesis: a stream is
// an UNBOUNDED TABLE, and you run the SAME DataFrame/SQL query over it — Spark executes it
// incrementally. Built on the `streaming-model` scene (the dataflow spine, like `cluster-topology`
// / `api-stack`), with a detour to the sibling `event-time` scene for windowing + watermarks (the
// part that makes streaming genuinely different from batch).
//
// Rhythm mirrors the other courses: an opening whole-scene overview (drawn solid, framed whole via
// `focus: []`), then the camera travels band by band — every section is a 1-beat MAP that lights
// its region and dims the rest (Spark's locked solid-tour model). Camera path A→B→A, like the
// architecture course (topology→execution→topology).
//
// Sections (two scenes: `streaming-model` spine, `event-time` detour):
//   1. overview            streaming-model  focus:[]
//   2. unbounded-table     streaming-model  focus input·query·result (the heart)
//   3. sources             streaming-model  focus sources band
//   4. trigger             streaming-model  focus trigger band (micro-batch vs continuous)
//   5. result-and-modes    streaming-model  focus result + output modes
//   6. sinks               streaming-model  focus sinks band (+ exactly-once teaser)
//   7. event-time-windows  event-time       focus events+windows (scene switch)
//   8. watermarks          event-time       focus watermark band (late data)
//   9. state-and-checkpoints streaming-model focus durability band (back to A)
//  10. closer              streaming-model  focus:[] — same API as batch, now continuous
//
// STATUS: COMPLETE — all 10 sections authored across two scenes. Next for this course: regen
// `audio-manifest.json` (npm run gen:audio) + generate wavs on Colab.
// The whole `streaming-model` pipeline band (the container + every child). Several sections
// FRAME this — camera holds the full Sources → Input → Query → Result → Sinks dataflow (context
// kept) while the slide/narration walks one part of it. Per the owner's "zoom to the band, don't
// crop to a node": because `focus` drives both the camera AND the lit set, framing the band lights
// the whole band (no single-node spotlight) — the slide carries which part each section is about.
const PIPELINE_BAND = [
  'pipeline',
  'src', 'src-kafka', 'src-files', 'src-socket', 'src-rate',
  'input', 'query', 'result',
  'sink', 'sink-kafka', 'sink-files', 'sink-console', 'sink-foreach',
  'state', 'outmode', 'om-append', 'om-update', 'om-complete',
]

export const sparkStreaming: Course = {
  id: 'spark-streaming',
  title: 'The stream is a table',
  sections: [
    {
      // ── overview (SOLID TOUR): the whole model drawn solid up front, framed whole (delta
      //    solidifies every scene node → all edges auto-solidify since both endpoints are
      //    revealed; empty focus → nothing dimmed, so the opener is a full-brightness overview).
      //    Every later section rides the same scene — nothing re-ghosts; each just lights its own
      //    region (focus) and dims the rest. ──
      id: 'overview',
      heading: 'The stream is a table',
      scene: 'streaming-model',
      focus: [],
      slide: {
        title: 'The stream is a table',
        body: [
          'The one idea to hold onto: a stream is an **unbounded table** — and you query it with the *same* DataFrame/SQL you’d use on a static one.',
          '',
          '### The dataflow, end to end',
          '- **Sources** — Kafka, files, a socket — append new rows to an **input table** that never ends',
          '- **Your query** runs **incrementally** — each trigger processes only what’s new',
          '- Results land in a **result table**, written through an **output mode** to a **sink**',
          '',
          '### What makes it tick',
          '- A **trigger** clock decides how often to run — **micro-batch** (default) or **continuous**',
          '- A **state store** carries aggregations across triggers — counts, joins, dedup',
          '',
          '### Why you can trust it',
          '- **Checkpoints** record source offsets + state → restart exactly where it left off',
          '- Replay + idempotent sinks give **end-to-end exactly-once**',
          '',
          'Same engine, same API as batch — just pointed at data that never stops. We’ll build it left to right.',
        ].join('\n'),
      },
      beats: [
        {
          line: 'In the last course we ended on a promise: that the structured APIs you learned — DataFrames and SQL — carry straight over to live, streaming data. This is how. And there’s really just one idea to hold onto, so hold onto it: a stream is an unbounded table. Instead of a fixed set of rows, you have a table that new data keeps getting appended to, forever — and the beautiful part is that you write exactly the same DataFrame or SQL query you’d write against a static table. Spark takes care of running it incrementally. Here’s the whole machine at a glance. On the left, sources — like Kafka, files, or a socket — append new rows to an input table that never ends. Your query reads that table, but each time it runs it only processes what’s new, and its output lands in a result table, which is written out through an output mode to a sink on the right. Driving the whole cycle from the top is a trigger — a clock that decides how often the query runs, either in small micro-batches, which is the default, or in a low-latency continuous mode. Underneath the query sits a state store, which remembers things across triggers — running counts, joins, deduplication. And holding it all up from below is durability: Spark checkpoints the source offsets and the state, so if it crashes it restarts exactly where it left off, and together with idempotent sinks that gives you end-to-end exactly-once guarantees. So it’s the same engine and the same API as batch — just pointed at data that never stops arriving. We’ll build this picture up left to right, starting with that one core idea: the unbounded table.',
          // Solidify every node so the whole model is drawn solid for this overview. Edges need no
          // explicit draw — each goes solid once both endpoints are revealed.
          delta: [
            {
              kind: 'solidify',
              ids: [
                'trigger', 'tr-microbatch', 'tr-continuous',
                'pipeline',
                'src', 'src-kafka', 'src-files', 'src-socket', 'src-rate',
                'input', 'query', 'result',
                'sink', 'sink-kafka', 'sink-files', 'sink-console', 'sink-foreach',
                'state', 'outmode', 'om-append', 'om-update', 'om-complete',
                'durability', 'checkpoint', 'exactly-once',
              ],
            },
          ],
        },
      ],
    },
    {
      // ── the HEART: the unbounded-table model. Frames the whole `pipeline` band (PIPELINE_BAND)
      //    so the entire dataflow stays in view; the input→query→result story is narrated over it.
      //    Only the trigger strip above and durability strip below dim. ──
      id: 'unbounded-table',
      heading: 'The unbounded table',
      scene: 'streaming-model',
      focus: PIPELINE_BAND,
      slide: {
        title: 'The unbounded table',
        body: [
          'This is the whole trick: model the stream as a table that only ever **grows**, and let Spark run your **batch query** over it incrementally.',
          '',
          '### The mental model',
          '- The **input table** starts empty and gains **new rows** as data arrives — it never ends',
          '- You write a normal query against it — `select`, `groupBy`, `join` — as if it were static',
          '- Each **trigger**, Spark runs that query over the new rows and updates a **result table**',
          '',
          '### Incremental, not re-run',
          '- Spark doesn’t re-scan all of history each trigger — it processes **only what’s new**',
          '- It keeps just enough **state** between triggers to match a full re-run’s answer',
          '',
          '### Why it matters',
          '- **One programming model** for batch and streaming — the same DataFrame code either way',
          '- You reason about *what the answer should be*; Spark handles the incremental *how*',
          '',
          'So the query is the easy part — it’s your batch query. Everything else is plumbing around this table.',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Let’s zoom into the middle, because this is the idea the whole course rests on. Picture an ordinary table — but instead of holding a fixed set of rows, this one starts empty and keeps gaining new rows as data streams in. It never ends; that’s why we call it the unbounded input table. Now here’s the move that makes Structured Streaming so elegant: you write an ordinary query against that table — a select, a groupBy, a join — exactly as if it were a normal static table sitting in a database. You don’t write special streaming code. Then, on each trigger, Spark runs your query and updates a result table with the answer. The crucial subtlety is the word incrementally. Spark does not re-read your entire history every trigger — that would get slower and slower forever. Instead it processes only the new rows that arrived, and it keeps just enough state between triggers to produce exactly the same answer a full re-run would have given. So conceptually you can always think, "the result table is what my query would return over all the data seen so far," while under the hood Spark is doing the efficient, incremental thing. And the payoff is huge: it’s one single programming model for both batch and streaming. The very same DataFrame code you’d run once over a static file will run continuously over a stream — you reason about what the answer should be, and Spark works out the incremental how. Which means the query itself is the easy part; it’s just your batch query. Everything else in this picture — sources, triggers, output modes, state, checkpoints — is really just plumbing arranged around this one growing table.',
          delta: [{ kind: 'solidify', ids: ['input', 'query', 'result'] }],
        },
      ],
    },
    {
      // ── SOURCES — what appends rows to the input table. Frames the whole `pipeline` band
      //    (PIPELINE_BAND) so the dataflow stays in view; the slide/narration is about the sources
      //    on the left. (Owner's call: band framing over cropping to the `src` node.) ──
      id: 'sources',
      heading: 'Sources: where the rows come from',
      scene: 'streaming-model',
      focus: PIPELINE_BAND,
      slide: {
        title: 'Sources: where the rows come from',
        body: [
          'A **source** is what appends rows to the input table — and each one tracks its own **progress** so Spark can replay after a crash.',
          '',
          '### The built-in sources',
          '- **Kafka** — the workhorse for production streams; partitioned and replayable',
          '- **Files** — a directory Spark watches; each new file arrives as a batch of rows',
          '- **Socket** — a raw TCP text stream — for demos only, *not* fault-tolerant',
          '- **Rate** — a synthetic source emitting N rows/sec — for benchmarks and examples',
          '',
          '### Offsets = replayable progress',
          '- Each source exposes **offsets** — how far it has read (Kafka offsets, file names)',
          '- Spark records those offsets in the checkpoint, so after a crash it **resumes** — no rows lost',
          '',
          'Kafka is what you’ll use in anger; the rest earn their keep in tests and demos.',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Let’s follow the data from the very left, starting with the sources — the things that actually append rows to that input table. Spark ships with a handful. By far the most important in production is Kafka: it’s a distributed, partitioned log, and crucially it’s replayable, which as we’ll see is the key to fault tolerance. Then there’s the file source, where you point Spark at a directory and every new file that lands there is picked up as a fresh batch of rows — handy for data dropped by other systems. The socket source reads a plain TCP text stream; it’s perfect for quick demos and the classic word-count example, but it can’t recover after a failure, so you never use it in production. And the rate source just generates a steady stream of synthetic rows per second — it exists purely for benchmarks and examples. Now, the property that ties every real source together is the offset. An offset is simply a marker of how far Spark has read into that source — for Kafka it’s the literal partition offsets, for the file source it’s which files have been consumed. On every trigger, Spark writes the offsets it has processed into the checkpoint. That’s what lets it survive a crash: when it restarts, it reads back the last committed offsets and resumes from exactly there, so nothing is skipped and nothing is lost. That replayability is why sources like Kafka and files are fault-tolerant while the socket source isn’t. In practice Kafka is what you’ll reach for in anger; the others earn their keep in testing and demos.',
          delta: [{ kind: 'solidify', ids: ['src', 'src-kafka', 'src-files', 'src-socket', 'src-rate'] }],
        },
      ],
    },
    {
      // ── band ①: the TRIGGER — the clock driving each incremental run. Focus defaults to the
      //    solidified `trigger` band → the camera lifts to the top strip; the rest dims. ──
      id: 'trigger',
      heading: 'Triggers: how often the query runs',
      scene: 'streaming-model',
      slide: {
        title: 'Triggers: how often the query runs',
        body: [
          'The **trigger** is the clock — it decides when each incremental run fires, trading **latency** against **efficiency**.',
          '',
          '### Micro-batch — the default',
          '- Spark runs the query in small **batches** on a schedule — the default engine',
          '- **Fixed interval** (say every 10s), or **as fast as possible** (next batch when the last ends)',
          '- **AvailableNow / once** — drain all data waiting, then stop — ideal for scheduled jobs',
          '',
          '### Continuous — low latency',
          '- A separate engine that processes records **one at a time**, ~**1 ms** latency',
          '- Experimental, with a limited operation set — micro-batch covers almost everything',
          '',
          '### The trade-off',
          '- Bigger batches = higher **throughput** but higher **latency**; smaller = the reverse',
          '',
          'Almost everyone runs micro-batch; reach for continuous only when milliseconds truly matter.',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Now look up at the top of the picture, because something has to decide when all of this actually runs — and that’s the trigger. Think of it as the clock for your stream. By default, Spark uses a micro-batch engine: rather than truly processing one record at a time, it collects the data that has arrived and processes it in small batches, one after another. You get to control the rhythm. You can set a fixed interval — run a batch every ten seconds, say — or you can leave it unset, in which case Spark simply starts the next batch the instant the previous one finishes, going as fast as it can. There’s also a very useful availableNow, or once, trigger: it processes all the data currently waiting and then stops, which turns your streaming query into a neat scheduled job you can run every hour and shut down. Alongside micro-batch there’s a second, low-latency engine called continuous processing, which handles records individually and can push end-to-end latency down to around a millisecond. But it’s experimental, it only supports a limited set of operations, and honestly micro-batch is fast enough for the overwhelming majority of use cases. The reason there’s a choice at all is the fundamental trade-off underneath: larger batches give you higher throughput but add latency, while smaller, more frequent batches cut latency at the cost of some efficiency. The trigger is simply the dial you turn to sit where you want on that curve. In practice, almost everyone runs micro-batch and just tunes the interval — you only reach for continuous when single-digit milliseconds genuinely matter.',
          delta: [{ kind: 'solidify', ids: ['trigger', 'tr-microbatch', 'tr-continuous'] }],
        },
      ],
    },
    {
      // ── the RESULT TABLE + OUTPUT MODES. Frames the whole `pipeline` band (PIPELINE_BAND) so the
      //    dataflow stays in view; the slide/narration is about the result table + output modes. ──
      id: 'result-and-modes',
      heading: 'The result table & output modes',
      scene: 'streaming-model',
      focus: PIPELINE_BAND,
      slide: {
        title: 'The result table & output modes',
        body: [
          'Each trigger updates a **result table** — the **output mode** decides how much of it gets written out.',
          '',
          '### The result table',
          '- Conceptually, the answer your query would give **if run over all data so far**',
          '- For an aggregation it holds one row **per group** — per key, per window',
          '',
          '### Three output modes',
          '- **Append** — only **brand-new** rows are emitted; past rows can’t change (non-aggregates, finalized windows)',
          '- **Update** — only rows that **changed** this trigger are emitted (efficient for running aggregates)',
          '- **Complete** — the **whole** result table is rewritten every trigger (small aggregates only)',
          '',
          '### Which you can use',
          '- Depends on the query — an un-windowed aggregate can’t use **append**; Spark enforces the valid set',
          '',
          'Mode is about *how* the answer is emitted; the **sink** is where it lands — that’s next.',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Follow the arrow to the right and we reach the result table, and the choice that sits under it. The result table is just the output of your query — and the clean way to think about it is that, at any moment, it holds whatever answer your query would produce if it were run over all the data seen so far. If your query is an aggregation — say, a count per user — then the result table has one row per group: one per key, and if you’re windowing, one per window. Now, on most triggers only a little of that table actually changes, so Spark makes you declare an output mode, which controls how much of the result gets written out each time. There are three. Append mode emits only brand-new rows and promises never to change a row it’s already written — that fits non-aggregating queries, and windowed aggregations once a window is finalized. Update mode emits just the rows that changed on this trigger, which is the efficient, natural choice for running aggregates that keep ticking up. And complete mode rewrites the entire result table every single trigger — only practical when the result is small, like a top-level dashboard count. The important catch is that you can’t freely pick any mode for any query: an aggregation without a watermark, for instance, can never use append, because an old row might still change later. Spark knows the rules and will reject an invalid combination up front. So the output mode is about how your answer is emitted each trigger — and where that emitted answer actually lands is the sink, which is exactly where we go next.',
          delta: [{ kind: 'solidify', ids: ['result', 'outmode', 'om-append', 'om-update', 'om-complete'] }],
        },
      ],
    },
    {
      // ── the SINKS. Frames the whole `pipeline` band (PIPELINE_BAND) so the dataflow stays in
      //    view; the slide/narration is about the sinks on the right. Teases exactly-once (§9). ──
      id: 'sinks',
      heading: 'Sinks: where results land',
      scene: 'streaming-model',
      focus: PIPELINE_BAND,
      slide: {
        title: 'Sinks: where results land',
        body: [
          'A **sink** is the destination for the result stream — and the sink’s guarantees decide your **end-to-end** correctness.',
          '',
          '### The built-in sinks',
          '- **Kafka** — publish the result stream downstream; the production default',
          '- **Files** — write Parquet / JSON to a directory; append-only, partitioned',
          '- **Console** — print each batch to stdout — for debugging',
          '- **Foreach / ForeachBatch** — custom logic per row or per batch — write *anywhere*',
          '',
          '### Delivery guarantees',
          '- Replayable source + checkpointed progress → the same data is re-processed after a crash',
          '- If the sink is **idempotent** or transactional (like files), that becomes **exactly-once**',
          '',
          'Replay handles the input; an idempotent sink handles the output — together, exactly-once.',
        ].join('\n'),
      },
      beats: [
        {
          line: 'At the far right of the pipeline sit the sinks — the destinations where your results are written. As with sources, Spark gives you a set to choose from. The Kafka sink publishes your result stream back out to another topic, so downstream systems can consume it — that’s the common production choice. The file sink writes results as Parquet or JSON into a directory, append-only and partitioned, which is great for building up a data lake. The console sink just prints each batch to standard out, which is invaluable while you’re developing. And the most flexible option, foreachBatch — and its per-row cousin foreach — hands you each micro-batch as an ordinary DataFrame and lets you run any code you like, so you can write to a database, an API, or any store that doesn’t have a built-in connector. But here’s the part that really matters about sinks: they’re where your end-to-end correctness guarantee is ultimately decided. Remember that replayable sources plus checkpointing mean that, after a crash, Spark will re-process some data — it guarantees at-least-once by design. To turn that into exactly-once, the sink has to cooperate: it needs to be idempotent, so that writing the same result twice has the same effect as writing it once, or transactional, like the file sink, which commits a batch atomically so a replayed batch doesn’t duplicate. When that’s true, the replay on the input side and the idempotence on the output side line up, and the whole pipeline delivers exactly-once. So think of it as two halves of one guarantee — replay protects the input, an idempotent sink protects the output — and we’ll see the machinery that makes it hold in a couple of sections.',
          delta: [{ kind: 'solidify', ids: ['sink', 'sink-kafka', 'sink-files', 'sink-console', 'sink-foreach'] }],
        },
      ],
    },
    {
      // ── SCENE SWITCH → `event-time`. Switching scenes resets the reveal, so this section
      //    SOLIDIFIES the whole scene in one beat (solid tour), then frames the top two bands
      //    (events + windows) with explicit focus; the watermark band stays solid but dimmed &
      //    off-frame until §8 pans down to it. ──
      id: 'event-time-windows',
      heading: 'Event time & windows',
      scene: 'event-time',
      focus: [
        'events', 'ev-1', 'ev-2', 'ev-3', 'ev-late', 'ev-drop',
        'windows', 'wt', 'wt-1', 'wt-2', 'wt-3', 'wt-4', 'ws', 'ws-1', 'ws-2', 'ws-3', 'wg', 'wg-1', 'wg-2', 'wg-3',
      ],
      slide: {
        title: 'Event time & windows',
        body: [
          'Now the hard part batch never had: when your data carries its **own timestamp**, you must reason over *event time*, not when it arrived.',
          '',
          '### Event time vs processing time',
          '- **Event time** — when the thing actually happened, recorded *in* the event',
          '- **Processing time** — when Spark happened to see it — skewed by delays & retries',
          '- Correct answers depend on **event time**; arrival order is unreliable',
          '',
          '### Windowed aggregations',
          '- Group events into **windows** over their event time — e.g. a count per 5-minute bucket',
          '- **Tumbling** (fixed, non-overlapping) · **sliding** (overlapping) · **session** (activity gaps)',
          '- Each window’s running aggregate lives in the **state store**, across triggers',
          '',
          'But if events can arrive late, when is a window ever *done*? That’s what the watermark answers.',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Let’s step over to the side of streaming that has no equivalent in batch, because it’s where most of the real difficulty lives. The moment your events carry their own timestamp — a sensor reading stamped when it was taken, a click stamped when it happened — you have to be careful about which time you mean. There are two. Event time is when the thing actually occurred, and it’s baked into the record itself. Processing time is simply when Spark got around to seeing it. In a perfect world those would line up, but in reality they don’t: events get delayed in the network, buffered in Kafka, retried after failures, so a reading from ten-oh-one might not reach Spark until ten-oh-four, arriving after events that happened later. That’s why, if you want correct answers — an accurate count of what happened in each minute — you have to group by event time, not by arrival order, because arrival order is unreliable. The way you do that grouping is a windowed aggregation: you slice the event-time line into windows and aggregate within each one — for example, a count of events per five-minute bucket. Those windows come in a few shapes: tumbling windows are fixed and non-overlapping, sliding windows overlap so each event can land in several, and session windows are defined by gaps of inactivity rather than a fixed size. And because a window keeps accumulating as more of its events trickle in over many triggers, its running total has to be remembered between triggers — which is exactly what the state store holds. But that raises the obvious, nagging question: if a straggler from ten-oh-one can always show up later, when is a window ever actually finished and safe to emit? Answering that is the whole job of the watermark, and that’s next.',
          delta: [
            {
              kind: 'solidify',
              ids: [
                'events', 'ev-1', 'ev-2', 'ev-3', 'ev-late', 'ev-drop',
                'windows',
                'wt', 'wt-1', 'wt-2', 'wt-3', 'wt-4',
                'ws', 'ws-1', 'ws-2', 'ws-3',
                'wg', 'wg-1', 'wg-2', 'wg-3',
                'watermark', 'wm-threshold', 'wm-evict', 'wm-drop',
              ],
            },
          ],
        },
      ],
    },
    {
      // ── band ③ of `event-time`: the WATERMARK. Consecutive same-scene section → reveal still
      //    solid; focus defaults to the solidified watermark band → the camera pans down to it,
      //    the events + windows above dim. ──
      id: 'watermarks',
      heading: 'Watermarks: bounding late data',
      scene: 'event-time',
      slide: {
        title: 'Watermarks: bounding late data',
        body: [
          'A **watermark** is Spark’s moving guess at *“we’ve probably seen everything up to here”* — it lets a window finalize and frees its state.',
          '',
          '### How it’s set',
          '- **Watermark = max event time seen − a threshold** you choose (e.g. “10 minutes late”)',
          '- It only moves **forward**, as newer events raise the max',
          '',
          '### What it does',
          '- A window whose end is **older than the watermark** is **finalized and evicted** from state',
          '- An event **later than the watermark** is **too late** — dropped, not counted',
          '',
          '### The trade-off you’re choosing',
          '- A **bigger** threshold tolerates later data but holds **more state, longer**',
          '- A **smaller** one frees state fast but drops more stragglers — you pick the balance',
          '',
          'Watermarks are what make unbounded, stateful streaming actually **bounded** in memory.',
        ].join('\n'),
      },
      beats: [
        {
          line: 'The watermark is Spark’s answer to “when is a window done?”, and it’s a beautifully simple idea. As events flow in, Spark keeps track of the largest event-time it has seen so far. The watermark is just that maximum, minus a threshold you choose — a grace period for lateness. If you set the threshold to ten minutes, you’re telling Spark: I’m willing to wait up to ten minutes for stragglers; once the newest data I’ve seen is from ten-fifteen, I’ll assume everything up to ten-oh-five has now arrived. Critically, the watermark only ever moves forward — a late event can’t drag it backward — so it’s a monotonic, ratcheting sense of time’s progress. That single line then does two jobs. First, any window whose end is now older than the watermark is considered complete: Spark finalizes it, emits its result, and — this is the important part — evicts its state, freeing the memory it was holding. Second, any brand-new event that arrives with a timestamp older than the watermark is simply too late; it’s dropped and not counted, because its window has already been closed and forgotten. And that framing exposes the real decision you’re making. A larger threshold is more forgiving of late data, but it forces Spark to keep every open window in state for longer, using more memory. A smaller threshold reclaims memory quickly but throws away more stragglers. You’re choosing where to sit on that accuracy-versus-memory trade-off. And that’s the deeper reason watermarks exist at all: without them, an unbounded stream of events would mean an unbounded pile of never-closing windows in state. The watermark is precisely what keeps stateful streaming bounded in memory — which brings us right to state and how it survives failure.',
          delta: [{ kind: 'solidify', ids: ['watermark', 'wm-threshold', 'wm-evict', 'wm-drop'] }],
        },
      ],
    },
    {
      // ── SCENE SWITCH BACK → `streaming-model`. Returning resets the reveal, so re-solidify the
      //    whole model in this beat, then frame the durability band (explicit focus) → the camera
      //    drops to the bottom strip; the pipeline above dims. ──
      id: 'state-and-checkpoints',
      heading: 'State, checkpoints & exactly-once',
      scene: 'streaming-model',
      focus: ['durability', 'checkpoint', 'exactly-once'],
      slide: {
        title: 'State, checkpoints & exactly-once',
        body: [
          'Streaming keeps **state** between triggers — and **checkpointing** is what makes that state survive a crash, giving **exactly-once**.',
          '',
          '### The state store',
          '- Aggregations, joins and dedup keep **running state** across triggers, per key',
          '- Held on the executors, backed by the checkpoint (RocksDB, or in-JVM)',
          '',
          '### Checkpointing',
          '- Every trigger, Spark durably records **source offsets + state** to the checkpoint location',
          '- On restart it reloads them and **resumes exactly** — no rows lost, none double-counted',
          '',
          '### End-to-end exactly-once',
          '- Replayable source + checkpointed state + **idempotent / transactional sink** = exactly-once',
          '- Point the query at a stable `checkpointLocation` — that directory *is* the query’s identity',
          '',
          'This is the guarantee that lets you run a streaming query for months and trust its numbers.',
        ].join('\n'),
      },
      beats: [
        {
          line: 'We’re back on the full model now, at the layer holding the whole thing up: durability. We’ve seen that streaming keeps state — a windowed count, the running side of a join, the set of keys seen for deduplication — and that this state lives across triggers, per key, on the executors. The question is what happens when an executor, or the whole job, crashes with all that state in memory. The answer is checkpointing. On every single trigger, before it commits, Spark durably writes two things to a checkpoint location you configure: the source offsets it has processed, and the current contents of the state store. Because both are saved together, atomically, a restart is clean — Spark reads back the last committed offsets and the matching state, and resumes from exactly that point. Nothing is skipped, because the offsets tell it where it was; nothing is double-counted, because the state it restores already reflects everything up to those offsets. Now put that together with the two things we saw earlier. The source is replayable, so Spark can re-read any data after the last checkpoint. The state is checkpointed, so the running totals survive. And if the sink is idempotent or transactional, re-writing a replayed batch doesn’t duplicate anything downstream. Those three properties together are what deliver end-to-end exactly-once — genuinely exactly-once, not just at-least-once. One very practical note: that checkpoint directory effectively is your query’s identity. Keep pointing a query at the same stable checkpointLocation and it continues where it left off; change or delete it and Spark thinks it’s a brand-new query starting from scratch. This is the machinery that lets you leave a streaming job running for months and still trust every number it produces.',
          delta: [
            {
              kind: 'solidify',
              ids: [
                'trigger', 'tr-microbatch', 'tr-continuous',
                'pipeline',
                'src', 'src-kafka', 'src-files', 'src-socket', 'src-rate',
                'input', 'query', 'result',
                'sink', 'sink-kafka', 'sink-files', 'sink-console', 'sink-foreach',
                'state', 'outmode', 'om-append', 'om-update', 'om-complete',
                'durability', 'checkpoint', 'exactly-once',
              ],
            },
          ],
        },
      ],
    },
    {
      // ── CLOSER: still on `streaming-model`, framed WHOLE (`focus: []` → nothing dimmed, full
      //    brightness). One beat that ties the streaming picture together AND closes the whole
      //    four-course arc (evolution → architecture → api → streaming). Re-solidify the whole
      //    model so the fully-wired machine lights at once. ──
      id: 'closer',
      heading: 'One API, batch and stream',
      scene: 'streaming-model',
      focus: [],
      slide: {
        title: 'One API, batch and stream',
        body: [
          'Step back: everything here is the **batch engine you already know**, made incremental — the stream really is just a table.',
          '',
          '### What you actually changed',
          '- `read` → `readStream`, `write` → `writeStream` + a **trigger**, an **output mode**, a **checkpoint**',
          '- The query in the middle — your DataFrame / SQL — is **unchanged** from batch',
          '',
          '### What Spark added underneath',
          '- Incremental execution over an unbounded table, driven by the trigger',
          '- **Event-time windows + watermarks** for correctness over late data',
          '- **Checkpointed state** for fault-tolerant, exactly-once results',
          '',
          '### Where it sits',
          '- This is **Structured Streaming** from the API course — the same Catalyst/Tungsten core, now continuous',
          '',
          'From the road to Spark, to how a job runs, to the layers you write, to streaming them live — that’s Apache Spark, end to end.',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Let’s pull all the way back and take in the whole picture. Here’s the punchline of the entire course: almost everything you’ve seen is the ordinary batch engine you already knew, quietly made incremental. The stream really is just a table. Look at what you actually change to go from batch to streaming: you swap read for readStream and write for writeStream, and you attach three things — a trigger to say how often, an output mode to say what to emit, and a checkpoint location to make it durable. That’s it. The query sitting in the middle — your DataFrames, your SQL, your joins and aggregations — is exactly the same code you’d run over a static dataset. What Spark quietly adds underneath is everything we walked through: it runs that query incrementally over an unbounded input table, driven by the trigger; it gives you event-time windows and watermarks so your answers stay correct even when data shows up late and out of order; and it checkpoints your progress and your state so the whole thing is fault-tolerant and exactly-once. And notice where this lands: this is the Structured Streaming box that sat on top of the stack back in the API course — the very same Catalyst and Tungsten engine, the same RDD core underneath, just pointed at data that never stops arriving. So that closes the loop on our whole journey through Spark. We traced the road that led to it, from Hadoop to the unified engine. We took apart how a single job runs across the driver, the cluster manager, and the executors. We climbed the layered API, from RDDs up through DataFrames and SQL, and watched Catalyst compile it all back down. And now we’ve taken that exact stack and set it loose on live, unbounded data. That — end to end — is Apache Spark.',
          delta: [
            {
              kind: 'solidify',
              ids: [
                'trigger', 'tr-microbatch', 'tr-continuous',
                'pipeline',
                'src', 'src-kafka', 'src-files', 'src-socket', 'src-rate',
                'input', 'query', 'result',
                'sink', 'sink-kafka', 'sink-files', 'sink-console', 'sink-foreach',
                'state', 'outmode', 'om-append', 'om-update', 'om-complete',
                'durability', 'checkpoint', 'exactly-once',
              ],
            },
          ],
        },
      ],
    },
  ],
}
