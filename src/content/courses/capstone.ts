import type { Course } from 'flow-engine'

// Course: "Everything, end to end" — the CAPSTONE. One project that puts every concept from the
// four courses to work: a LAMBDA-architecture analytics pipeline over an e-commerce clickstream,
// built as a speed layer (Structured Streaming) AND a batch layer (nightly DataFrame job), merged
// for serving, then deployed and tuned on a cluster.
//
// DELIVERY MODEL (owner's call): the WHOLE capstone stays on the ONE `lambda-arch` scene — no
// separate code-walk scenes. Each build section HIGHLIGHTS its stage node on the map
// (`focus: [<band>, <stage>]` → the camera frames that layer's band, only the stage node lights,
// the rest dims) while the RIGHT slide carries that stage's real code block + an
// "Exercises: <concept> (which course)" tag. Practical gaps (joins, partitioning, data sources,
// deploy/ops, AQE) are taught INLINE here rather than as separate courses.
//
// Sections (all on `lambda-arch`; BATCH is LEFT — built first — and SPEED is RIGHT):
//   1.  the-plan          focus:[]                       overview (whole map)
//   2.  read-lake         focus:[batch, ba-read]          read Parquet · pushdown
//   3.  clean             focus:[batch, ba-clean]         clean + dedup + transform
//   4.  batch-aggregate   focus:[batch, ba-agg]           join dims + aggregate (sort-merge)
//   5.  partitioned-write focus:[batch, ba-view]          partitionBy write
//   6.  ingest            focus:[speed, sp-read]          readStream from Kafka
//   7.  enrich            focus:[speed, sp-enrich]        broadcast-join the product dim
//   8.  window            focus:[speed, sp-window]        watermark + windowed aggregate
//   9.  real-time-view    focus:[speed, sp-view]          writeStream + checkpoint
//   10. serving           focus:[serving, sv-*]           merge batch + speed → one answer
//   11. deploy            focus:[deploy, run-submit/cluster]  spark-submit both jobs · config
//   12. tune              focus:[deploy, run-tune]        Spark UI · AQE · cache · skew
//   13. closer            focus:[]                        the whole system + concept map
//
// STATUS: batch-first order. §1 + the speed §6 (ingest) authored; batch §2–§5 and §7–§13 next.
export const capstone: Course = {
  id: 'capstone',
  title: 'Everything, end to end',
  sections: [
    {
      // ── the PLAN (SOLID TOUR): the whole Lambda architecture drawn solid up front, framed whole
      //    (`focus: []` → nothing dimmed). Later sections switch to the per-layer scenes; §10 and
      //    §13 return here. ──
      id: 'the-plan',
      heading: 'Everything, end to end',
      scene: 'lambda-arch',
      focus: [],
      slide: {
        title: 'Everything, end to end',
        body: [
          'One project that puts every piece together — a **Lambda pipeline** over a live e-commerce clickstream, built two ways at once.',
          '',
          '### The data & the goal',
          '- A stream of **clickstream events** — views, add-to-carts, purchases (each with an event-time, user, product, amount)',
          '- Goal: answer **“revenue by category, up to this moment”** — accurately *and* in real time',
          '',
          '### Two layers, one dataset',
          '- **Batch layer** *(left)* — a nightly job: accurate, reprocesses the full history — the *source of truth*',
          '- **Speed layer** *(right)* — Structured Streaming: low-latency, approximate — *what’s happening now*',
          '- **Serving layer** — merges the two: batch history + the latest real-time slice',
          '',
          '### Why build it twice',
          '- Streaming alone can drift and miss late data; batch alone is hours stale',
          '- Lambda gives you **both** — and exercises **every concept** from the four courses',
          '',
          'We’ll build the **batch layer** first, then the speed layer, merge them, then deploy and tune it on a cluster.',
        ].join('\n'),
      },
      beats: [
        {
          line: 'This is the capstone — one project where everything we’ve learned finally comes together and runs. Here’s the whole thing at a glance. We’re building an analytics pipeline over a live e-commerce clickstream: a never-ending flow of events — people viewing products, adding them to carts, and buying — each stamped with an event-time, a user, a product, and an amount. The goal is a single, deceptively simple question: what’s the revenue by product category, right up to this moment? — and we want that answer both accurate and up-to-the-second. The trick is that no single approach gives you both, so we use a Lambda architecture and build the pipeline two ways over the same data. On the left is the batch layer: a nightly job that reprocesses the full history from the data lake and produces slow but perfectly accurate results — the source of truth. On the right is the speed layer: a Structured Streaming job that reads from Kafka and gives low-latency, approximate answers about what’s happening right now. And at the bottom, the serving layer merges them — the accurate batch history plus the latest real-time slice — into one answer. Why go to all this trouble? Because streaming alone can drift and miss late-arriving data, while batch alone is always hours behind; Lambda gets you the best of both. And building it this way is the point of a capstone: it forces us to use nearly every concept from the four courses — the DataFrame API and Catalyst, joins, partitioning, the streaming model, event-time and watermarks, deploy modes, and performance tuning. We’ll build the batch layer first — the accurate foundation on the left — then the speed layer on the right, merge them in the serving layer, and finally package the whole thing, submit it to a cluster, and tune it in the Spark UI.',
          delta: [
            {
              kind: 'solidify',
              ids: [
                'sources', 'src-kafka', 'src-lake',
                'speed', 'sp-read', 'sp-enrich', 'sp-window', 'sp-view',
                'batch', 'ba-read', 'ba-clean', 'ba-agg', 'ba-view',
                'serving', 'sv-merge', 'sv-answer',
                'deploy', 'run-submit', 'run-cluster', 'run-tune',
              ],
            },
          ],
        },
      ],
    },
    {
      // ── BATCH §2 (LEFT band). Map still solid from §1; focus frames the batch band and lights
      //    `ba-read` (the rest of the batch stages + the map dim). RIGHT slide = the read code. ──
      id: 'read-lake',
      heading: 'Batch layer · Read the lake',
      scene: 'lambda-arch',
      focus: ['batch', 'ba-read'],
      slide: {
        title: 'Batch · Read the lake',
        body: [
          'We build the **accurate** layer first. The batch job reprocesses a full day from the data lake — starting by reading the raw events as **Parquet**, and reading only what it needs.',
          '',
          '```python',
          'raw = (spark.read',
          '    .parquet("s3://lake/events/dt=2026-08-04")   # one day’s partition',
          '    .select("ts", "user_id", "product_id", "amount", "action")',
          '    .where(col("action") == "purchase"))         # pushed into the scan',
          '```',
          '',
          '### What’s happening',
          '- **Parquet** is columnar → only the **selected columns** are read (projection pushdown)',
          '- The `where` is **pushed into the scan** (predicate pushdown) — non-purchases never load',
          '- Reading one **date partition** (`dt=…`) skips the rest of the lake (partition pruning)',
          '',
          '**Exercises:** data sources & formats · predicate/projection pushdown · partition pruning',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Let’s build the pipeline, and we start on the left, with the batch layer — the accurate, source-of-truth half. Its job is to reprocess an entire day of history from the data lake and produce numbers we can fully trust. It begins by reading the raw events, and they’re stored as Parquet, which matters a lot. Parquet is a columnar format, so when we select just the handful of columns we care about — the timestamp, the user, the product, the amount, the action — Spark physically reads only those columns off disk and skips the rest; that’s projection pushdown. The filter matters just as much: because Parquet carries statistics, our where-clause for purchase events gets pushed all the way down into the scan, so rows that don’t match are never even loaded into Spark. And because the lake is laid out in folders by date, pointing at a single day’s partition means Spark prunes away every other day without looking at it — partition pruning. Put together, those three — column pruning, predicate pushdown, and partition pruning — mean this read touches a tiny fraction of the lake even though conceptually we asked for “the events.” That’s the payoff of using a real columnar format and a partitioned layout, and it’s exactly the kind of thing the structured APIs and Catalyst do for you. We now have a lean DataFrame of the day’s purchase events; next we clean it up.',
          delta: [{ kind: 'solidify', ids: ['batch', 'ba-read'] }],
        },
      ],
    },
    {
      // ── BATCH §3. Frame the batch band, light `ba-clean`. ──
      id: 'clean',
      heading: 'Batch layer · Clean & prepare',
      scene: 'lambda-arch',
      focus: ['batch', 'ba-clean'],
      slide: {
        title: 'Batch · Clean & prepare',
        body: [
          'Raw events are messy — the batch layer removes **replays** and derives the columns the rollup will need.',
          '',
          '```python',
          'clean = (raw',
          '    .dropDuplicates(["event_id"])       # kill at-least-once replays',
          '    .withColumn("ts", to_timestamp("ts"))',
          '    .withColumn("day", to_date("ts"))',
          '    .filter(col("amount") > 0))',
          '```',
          '',
          '### What’s happening',
          '- `dropDuplicates` removes **replayed** rows — the source can deliver the same event twice',
          '- `withColumn` derives clean, typed fields — a real `ts`, a `day` bucket to group by',
          '- These are all **lazy transformations** — they just extend the plan; nothing runs yet',
          '',
          '**Exercises:** DataFrame operations · lazy transformations (`spark-api` §3) · dedup',
        ].join('\n'),
      },
      beats: [
        {
          line: 'With the raw events in hand, the next stage cleans them up, because real data is never tidy. The first problem is duplicates. Upstream systems, and Spark’s own recovery, both work on at-least-once delivery, which means the exact same event can show up more than once — so we call dropDuplicates on a unique event id to collapse those replays down to one. Then we shape the data into what the rollup needs: we parse the raw timestamp into a proper timestamp type, and we derive a day column from it that we’ll group by later. And we drop any nonsense rows, like non-positive amounts. The key thing to notice — and it’s a direct callback to the API course — is that not one of these operations has actually run yet. dropDuplicates, withColumn, filter: they’re all transformations, and transformations are lazy. Each call just adds another node to the logical plan; Spark won’t touch a single row until an action forces it. That laziness is exactly what lets Catalyst see the whole chain at once and optimize it — for instance, folding this filter together with the pushdown from the read. So at this point we’ve described a clean, deduplicated, well-typed dataset, without having computed anything. Next we join in product details and aggregate.',
          delta: [{ kind: 'solidify', ids: ['batch', 'ba-clean'] }],
        },
      ],
    },
    {
      // ── BATCH §4. Frame the batch band, light `ba-agg`. The heavy stage: a sort-merge join +
      //    a wide groupBy. Contrasts with the speed layer's broadcast join (§7). ──
      id: 'batch-aggregate',
      heading: 'Batch layer · Join & aggregate',
      scene: 'lambda-arch',
      focus: ['batch', 'ba-agg'],
      slide: {
        title: 'Batch · Join & aggregate',
        body: [
          'Join each event to its product’s **category**, then roll up **revenue per category, per day** — the accurate batch view.',
          '',
          '```python',
          'rollup = (clean',
          '    .join(products, "product_id")        # both large → sort-merge join',
          '    .groupBy("day", "category")',
          '    .agg(sum("amount").alias("revenue"),',
          '         countDistinct("user_id").alias("buyers")))',
          '```',
          '',
          '### What’s happening',
          '- Both sides are large, so Catalyst picks a **sort-merge join** (not broadcast)',
          '- `groupBy … agg` is a **wide** transformation → a **shuffle** cuts a new stage',
          '- You declare *what* to compute; **Catalyst** plans *how* and **Tungsten** runs it',
          '',
          '**Exercises:** sort-merge join · wide transform / shuffle · Catalyst (`spark-api` §6–7, `architecture` §7–8)',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Now the heavy lifting: joining and aggregating. Each event only carries a product id, but we want to report by category, so we join our events against a products table to pull in each product’s category. Here’s a detail worth pausing on: in the batch layer both sides of this join are large — a full day of events against the whole product catalog — so Catalyst chooses a sort-merge join, sorting both sides and merging them, which involves shuffling data across the cluster. Keep that in mind, because when we build the speed layer we’ll join the very same products table a completely different way. Once enriched, we roll the data up: group by day and category, and aggregate — summing the amount into revenue and counting distinct users as buyers. That groupBy is a wide transformation, so it forces a shuffle, and remember from the architecture course that a shuffle is exactly where one stage ends and the next begins. What’s elegant is how little we’ve said about mechanics: we declared what we want — a join and a grouped aggregation — and Catalyst worked out the physical plan, chose the join strategy, and Tungsten compiled it to run fast. That’s the whole promise of the structured APIs, doing real work here. We now have the accurate daily rollup; the last batch step is to write it out.',
          delta: [{ kind: 'solidify', ids: ['batch', 'ba-agg'] }],
        },
      ],
    },
    {
      // ── BATCH §5. Frame the batch band, light `ba-view`. Partitioned write → the batch view. ──
      id: 'partitioned-write',
      heading: 'Batch layer · Write the batch view',
      scene: 'lambda-arch',
      focus: ['batch', 'ba-view'],
      slide: {
        title: 'Batch · Write the batch view',
        body: [
          'Write the rollup as the **accurate batch view** — shaped, partitioned, and written as a **Delta** table so downstream reads are fast and safe.',
          '',
          '```python',
          '(rollup',
          '    .repartition("day")                  # sane file count per day (no small-files)',
          '    .write.mode("overwrite")',
          '    .partitionBy("day")                  # one folder per day → readers prune by date',
          '    .format("delta")                     # ACID + time-travel (Parquet underneath)',
          '    .save("s3://lake/views/revenue"))',
          '```',
          '',
          '### What’s happening',
          '- `repartition("day")` controls **how many files** per partition — dodges the small-files problem (`coalesce` shrinks *without* a shuffle; **bucketing** pre-sorts for repeated joins)',
          '- `partitionBy("day")` writes **one folder per day** → later reads prune by date',
          '- **Delta** gives an **ACID** table with **time-travel** — a half-run can’t corrupt it; it’s Parquet underneath, so swap `.format("parquet")` for a plain lake',
          '- This is the **source of truth** — accurate, but only as fresh as the last nightly run',
          '',
          '**Exercises:** partitioning (partitionBy · repartition/coalesce · bucketing) · file formats · Delta/lakehouse',
        ].join('\n'),
      },
      beats: [
        {
          line: 'The final batch step writes our rollup out as the batch view — the trusted, accurate table the serving layer will read. How we write it matters as much as what we write, and there are three decisions here. First, layout: we partition the output by day, which physically lays the data out as one folder per day, so any later read for a given date opens just that folder and prunes the rest — the same partition pruning we exploited on the way in, now built into our own output. Second, the number of files: we repartition by day so each day’s folder ends up with a sensible file count, which heads off the classic small-files problem, where thousands of tiny files cripple later reads. When you only want to reduce partitions without paying for a shuffle you’d reach for coalesce instead, and if this view were joined constantly you might even bucket it, pre-sorting the data so those joins skip the shuffle. Third, the format: we write it as a Delta table rather than plain Parquet. Delta layers an ACID transaction log over Parquet, so a half-finished nightly run can never leave the view in a corrupt state, and it gives us time-travel — we can query yesterday’s version if today’s looks wrong. Underneath it’s still columnar Parquet, so serving reads stay fast, and dropping to a plain Parquet lake is a one-word change to the format. Now, step back and see what the batch layer gives us and what it doesn’t. It gives us numbers we can completely trust — a full, deduplicated, correctly aggregated view of history. But it has one built-in limitation: it’s only as fresh as the last time the nightly job ran. If it ran at 2 a.m., then by mid-afternoon it knows nothing about the last twelve hours of activity. For a dashboard that’s supposed to say “revenue up to now,” that staleness is a real gap. And filling that gap — covering what’s happened since the last batch run — is exactly the job of the speed layer, which we build next.',
          delta: [{ kind: 'solidify', ids: ['batch', 'ba-view'] }],
        },
      ],
    },
    {
      // ── SPEED §6 (RIGHT band). The batch view is accurate but stale; the speed layer covers
      //    "right now". Frame the speed band, light `sp-read` (readStream); §7–§9 advance the lit
      //    stage (enrich → window → view). RIGHT slide carries the code. ──
      id: 'ingest',
      heading: 'Speed layer · Ingest from Kafka',
      scene: 'lambda-arch',
      focus: ['speed', 'sp-read'],
      slide: {
        title: 'Speed · Ingest from Kafka',
        body: [
          'The speed layer is a Structured Streaming job in **four calls**. Stage one reads the clickstream from Kafka as an **unbounded table**.',
          '',
          '```python',
          'events = (spark.readStream',
          '    .format("kafka")',
          '    .option("subscribe", "clicks")',
          '    .load()                             # raw Kafka rows',
          '    .select(from_json(col("value"), schema).alias("e"))',
          '    .select("e.*"))     # → ts · user_id · product_id · amount',
          '```',
          '',
          '### What’s happening',
          '- `readStream` opens Kafka as a **source** — the input table that never ends',
          '- Each Kafka record → one event row; the JSON `value` is parsed into **typed columns**',
          '- Kafka **offsets** are replayable → the job recovers *exactly* after a crash',
          '',
          '**Exercises:** streaming source & offsets (`spark-streaming` §3) · the unbounded input table (§2)',
        ].join('\n'),
      },
      beats: [
        {
          line: 'With the accurate batch view in place, we turn to the speed layer — the real-time half, over on the right, whose whole job is to cover what’s happened since the last batch run. It’s just an ordinary Structured Streaming job, and it’s only four calls long: read the stream, enrich it, aggregate it in windows, and write it out. Those four stages are laid out on the right; we’ll walk them one at a time, and this first one is the ingest. Reading from Kafka is a single call: spark dot readStream, format kafka, subscribe to the clicks topic, and load. Remember the core idea from the streaming course — this gives us an unbounded input table that new events are appended to forever, and we get to treat it exactly like a static DataFrame. Kafka hands us each record with the real payload sitting in a raw value column, so we parse that JSON against a known schema and flatten it out into proper typed columns: the event timestamp, the user id, the product id, and the amount. Two things make Kafka the right source here. Its offsets are replayable, so if the job crashes Spark can rewind to exactly where it left off and lose nothing — that’s the foundation of the exactly-once guarantee we’ll rely on later. And it’s partitioned, so this read scales straight across the executors. At this point we have a live, typed DataFrame of clickstream events streaming in. The next stage enriches each event with details about the product it refers to.',
          // Map already solid from §1 (same scene); this just re-solidifies the focused stage
          // (idempotent). The highlight comes from `focus`, the code from the slide.
          delta: [{ kind: 'solidify', ids: ['speed', 'sp-read'] }],
        },
      ],
    },
    {
      // ── SPEED §7. Frame the speed band, light `sp-enrich`. The SAME products join as §4 batch,
      //    but a broadcast join here (small dim, no shuffle) — a deliberate contrast. ──
      id: 'enrich',
      heading: 'Speed layer · Enrich with a broadcast join',
      scene: 'lambda-arch',
      focus: ['speed', 'sp-enrich'],
      slide: {
        title: 'Speed · Enrich with a broadcast join',
        body: [
          'Each event carries only a `product_id` — join the small **product dimension** to get its category, using a **broadcast join**.',
          '',
          '```python',
          'prod = spark.read.parquet("dim/products")   # small — fits in memory',
          'enriched = events.join(',
          '    broadcast(prod), "product_id")          # ship dim to every executor',
          '```',
          '',
          '### What’s happening',
          '- The product dim is **small**, so `broadcast` ships a copy to **every executor**',
          '- Each event is enriched **locally** — **no shuffle**, unlike the batch sort-merge join',
          '- It’s the *same* DataFrame `join` API as batch — it just runs on the stream',
          '',
          '**Exercises:** broadcast-hash join · joins on streams (`spark-api` §7; contrast §4’s batch join)',
        ].join('\n'),
      },
      beats: [
        {
          line: 'The second speed stage enriches each streaming event with its product’s category — and this is the moment I asked you to remember from the batch layer. We’re joining against the very same products table, but here we do it a completely different way: a broadcast join. The reason is the shape of the data. In the batch layer both sides were huge, so a shuffle-heavy sort-merge join made sense. But in the speed layer, one side — the product dimension — is small enough to fit in memory, so we wrap it in broadcast, and Spark ships a full copy of that little table out to every executor. Now each executor can enrich its stream of events entirely locally, matching each product id against its in-memory copy, with no shuffle at all. That’s a big deal for streaming, where every shuffle adds latency you can’t afford. Two things are worth taking away. First, broadcast joins are the single most important join optimization in Spark: whenever one side is small, broadcasting it avoids the expensive shuffle. Second — and this is the thread running through the whole capstone — it is the exact same DataFrame join API we used in batch. We didn’t learn a new streaming join; we wrote the same code, and the engine ran it continuously over the unbounded table. With each event now carrying its category, we can aggregate.',
          delta: [{ kind: 'solidify', ids: ['speed', 'sp-enrich'] }],
        },
      ],
    },
    {
      // ── SPEED §8. Frame the speed band, light `sp-window`. Event-time windows + watermark. ──
      id: 'window',
      heading: 'Speed layer · Window + watermark',
      scene: 'lambda-arch',
      focus: ['speed', 'sp-window'],
      slide: {
        title: 'Speed · Window + watermark',
        body: [
          'Aggregate revenue per category in **5-minute event-time windows**, with a **watermark** to bound late data and state.',
          '',
          '```python',
          'agg = (enriched',
          '    .withWatermark("ts", "10 minutes")',
          '    .groupBy(window("ts", "5 minutes"), "category")',
          '    .agg(sum("amount").alias("revenue")))',
          '```',
          '',
          '### What’s happening',
          '- `withWatermark` — tolerate **10 min** of lateness, then finalize & drop stragglers',
          '- `window("ts", "5 min")` buckets by **event time**, not when the event arrived',
          '- The running totals live in the **state store**, checkpointed for recovery',
          '',
          '**Exercises:** event-time windows · watermarks · state (`spark-streaming` §7–9)',
        ].join('\n'),
      },
      beats: [
        {
          line: 'The third stage is where the speed layer earns its keep and where all that event-time theory from the streaming course pays off. We want revenue per category in five-minute buckets — but bucketed by when each purchase actually happened, its event time, not when it happened to reach Spark. So we group by a five-minute window over the ts column, alongside category, and sum the amount. The subtlety, as always with streaming, is late data: an event stamped at ten-oh-four might arrive at ten-oh-nine after network delays, and we don’t want to either miss it or keep every window open forever waiting for stragglers. That’s what withWatermark handles — we tell Spark to tolerate up to ten minutes of lateness. Any event later than that is dropped, and once the watermark passes a window’s end, that window is finalized and its state is evicted, which is what keeps memory bounded on an infinite stream. Those running per-window totals live in the state store between triggers, and — crucially — they’re checkpointed, so if the job restarts, the in-progress windows come back exactly as they were. This is the same withWatermark and window API straight from the streaming course, now doing real work in our pipeline. We’ve got live, windowed revenue; the last speed step writes it out.',
          delta: [{ kind: 'solidify', ids: ['speed', 'sp-window'] }],
        },
      ],
    },
    {
      // ── SPEED §9. Frame the speed band, light `sp-view`. writeStream + checkpoint → the
      //    real-time view. Closes the speed layer; hands off to serving. ──
      id: 'real-time-view',
      heading: 'Speed layer · Write the real-time view',
      scene: 'lambda-arch',
      focus: ['speed', 'sp-view'],
      slide: {
        title: 'Speed · Write the real-time view',
        body: [
          'Write the windowed aggregates out continuously, with a **checkpoint** — giving **exactly-once**, seconds-fresh results.',
          '',
          '```python',
          '(agg.writeStream',
          '    .outputMode("update")                     # emit only changed windows',
          '    .option("checkpointLocation", "ckpt/speed")',
          '    .toTable("revenue_rt")                    # the real-time view',
          '    .start())',
          '```',
          '',
          '### What’s happening',
          '- `update` mode emits only the windows that **changed** this trigger — efficient for running aggregates',
          '- `checkpointLocation` persists **offsets + state** → exactly-once, resume after a crash',
          '- Downstream reads `revenue_rt` for the **latest** slice — seconds fresh, not hours',
          '',
          '**Exercises:** output modes · sinks · checkpoint / exactly-once (`spark-streaming` §5–6, §9)',
        ].join('\n'),
      },
      beats: [
        {
          line: 'The last speed stage writes the result out, and it ties together everything about fault tolerance. We call writeStream and choose update output mode, so on each trigger Spark emits only the windows whose totals actually changed — the natural, efficient choice for a running aggregate. We point it at a checkpoint location, and that single option is what makes the whole streaming job trustworthy: on every trigger Spark durably records both the Kafka offsets it has consumed and the current window state, so if the job crashes it resumes from exactly where it left off, losing nothing and double-counting nothing — end-to-end exactly-once. And it writes into a table, revenue_rt, that downstream consumers can read to get the very latest slice of revenue — seconds old, not hours. Notice the checkpoint below the write stage lighting up: that’s the durability foundation the whole streaming job stands on. And with that, the speed layer is complete. Step back and look at what we have: on the left, a batch view that’s perfectly accurate but stale; on the right, a real-time view that’s fresh but only covers the recent window and can miss corrections. Neither alone answers our question well. The serving layer’s job is to combine them — and that’s where we go next.',
          delta: [{ kind: 'solidify', ids: ['speed', 'sp-view'] }],
        },
      ],
    },
    {
      // ── SERVING §10. Camera moves DOWN to the serving band (spans both columns); light the two
      //    serving tiles. This is the Lambda merge — history from batch + recent from the stream. ──
      id: 'serving',
      heading: 'Serving · Merge the two views',
      scene: 'lambda-arch',
      focus: ['serving', 'sv-merge', 'sv-answer'],
      slide: {
        title: 'Serving · Merge the two views',
        body: [
          'The final query answers **“revenue by category, up to now”** by merging the accurate **batch history** with the latest **real-time slice**.',
          '',
          '```python',
          'batch = spark.read.parquet("s3://lake/views/revenue")',
          'rt    = spark.table("revenue_rt")',
          'answer = (batch.where(col("day") < today)        # accurate history',
          '    .unionByName(rt.where(col("day") == today))  # fresh today',
          '    .groupBy("category").agg(sum("revenue")))',
          '```',
          '',
          '### What’s happening',
          '- Take **history from batch** (accurate) + **today from the stream** (fresh)',
          '- `unionByName` stitches them; a final `groupBy` gives one number per category',
          '- This split — accuracy from batch, latency from speed — is the **essence of Lambda**',
          '',
          '**Exercises:** the Lambda serving merge · DataFrame union + aggregate',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Now we bring the two halves together in the serving layer, and this is the whole point of the Lambda architecture. We have two tables. The batch view is accurate but stale — trustworthy for every day up to and including yesterday. The real-time view is fresh but only covers today’s in-flight windows. So the serving query simply takes the best of each: read the batch view for all the historical days, read the real-time view for today, and union them together with unionByName, which lines the columns up by name. A final groupBy on category sums across both, and out comes a single, current answer — revenue by category, right up to this moment — that’s both accurate for history and fresh for the present. That division of labor is the essence of Lambda: the batch layer owns correctness, the speed layer owns latency, and the serving layer merges them into one answer that has both. And notice, one more time, that this merge is just ordinary DataFrame code — a filter, a union, a groupBy — the same structured API we’ve used at every single stage, batch and stream alike. The data pipeline is now complete, end to end. What’s left is to actually run it — to package these jobs and put them on a cluster — and then to make them fast.',
          delta: [{ kind: 'solidify', ids: ['serving', 'sv-merge', 'sv-answer'] }],
        },
      ],
    },
    {
      // ── RUN §11. Camera to the deploy strip; light `run-submit` + `run-cluster`. spark-submit
      //    both jobs — streaming long-running in cluster mode, batch scheduled. ──
      id: 'deploy',
      heading: 'Run · Deploy on a cluster',
      scene: 'lambda-arch',
      focus: ['deploy', 'run-submit', 'run-cluster'],
      slide: {
        title: 'Run · Deploy on a cluster',
        body: [
          'Package the code and **submit both jobs** — the streaming job runs forever in **cluster mode**; the batch job is **scheduled** nightly.',
          '',
          '```bash',
          '# streaming: long-running, driver inside the cluster',
          'spark-submit --master yarn --deploy-mode cluster \\',
          '  --num-executors 10 --executor-cores 4 --executor-memory 8g \\',
          '  --conf spark.dynamicAllocation.enabled=true \\',
          '  speed_job.py',
          '',
          '# batch: same cluster, scheduled each night',
          'spark-submit --master yarn --deploy-mode cluster batch_job.py',
          '```',
          '',
          '### What’s happening',
          '- **cluster mode** → the streaming driver lives in the cluster and survives your laptop',
          '- Executor **cores / memory** set your parallelism; **dynamic allocation** scales the batch job',
          '- One cluster manager (YARN / K8s) runs both — exactly the runtime from the architecture course',
          '',
          '**Exercises:** deploy modes · cluster manager · executor config · dynamic allocation (`architecture`)',
        ].join('\n'),
      },
      beats: [
        {
          line: 'The pipeline is written; now we run it, and this is where the architecture course comes straight back. Both jobs go to the cluster with spark-submit, and the flags encode decisions we studied. We point master at the cluster manager — YARN here, though it could just as easily be Kubernetes — and for the streaming job we choose cluster deploy mode, so the driver runs inside the cluster rather than on our laptop; that’s essential, because a streaming job runs indefinitely and must survive our machine disconnecting. We size the executors — ten of them, four cores and eight gigabytes each — and those numbers are our parallelism: forty task slots running at once, each with its share of memory. For the batch job we turn on dynamic allocation, so it grabs executors when there’s work and releases them when idle, instead of holding the whole cluster all night. And notice both jobs share one cluster manager — the exact driver, cluster-manager, executors picture we took apart earlier, now with our own code running through it. This is the payoff of understanding the runtime: deploy mode, executor sizing, dynamic allocation aren’t mysterious flags, they’re direct consequences of how a Spark job runs. The jobs are live. The last thing any real engineer does is open the Spark UI and make them faster.',
          delta: [{ kind: 'solidify', ids: ['deploy', 'run-submit', 'run-cluster'] }],
        },
      ],
    },
    {
      // ── RUN §12. Still on the deploy strip; light `run-tune`. The performance gap, taught
      //    inline: Spark UI · AQE · caching · skew. ──
      id: 'tune',
      heading: 'Run · Observe & tune',
      scene: 'lambda-arch',
      focus: ['deploy', 'run-tune'],
      slide: {
        title: 'Run · Observe & tune',
        body: [
          'With it running, open the **Spark UI**, turn on **AQE**, **cache** the reused dimension, and fix a **skewed** key.',
          '',
          '```python',
          'spark.conf.set("spark.sql.adaptive.enabled", True)           # AQE',
          'spark.conf.set("spark.sql.adaptive.skewJoin.enabled", True)  # split hot keys',
          'products.cache()                                             # reused every run',
          '# Spark UI → Stages → find the shuffle-heavy / skewed stage',
          '```',
          '',
          '### What’s happening',
          '- **AQE** (Spark 3+) coalesces shuffle partitions and re-plans joins **at runtime**',
          '- **Skew-join** handling splits a hot key so one giant task can’t stall the stage',
          '- `cache()` the product dim — read every batch; the **Spark UI** shows the win',
          '',
          '**Exercises:** AQE · skew · caching · Spark UI (performance & tuning; `architecture` memory)',
        ].join('\n'),
      },
      beats: [
        {
          line: 'A pipeline that runs is not the same as a pipeline that runs well, so the final step is to observe and tune — and this fills the one big gap the four courses left open. Your first move is always the same: open the Spark UI and look at the stages. It shows you which stages are slow, where the shuffles are, and whether any task is taking far longer than its peers — the classic sign of skew. Then you reach for a few high-leverage fixes. The biggest is Adaptive Query Execution, AQE, introduced in Spark 3: with one flag, Spark stops trusting its compile-time plan blindly and instead re-optimizes at runtime using the actual data it sees — it coalesces too-many-tiny shuffle partitions down to a sensible number, and it can even switch a join strategy on the fly once it knows the real sizes. Turn on its skew-join handling and Spark will detect a hot key — say one wildly popular product — and split that oversized partition so a single straggler task can’t hold up the whole stage. And a simple, classic win: the product dimension is read on every batch run, so we cache it in memory, and the Spark UI’s storage tab confirms the reuse. This is the discipline the concept courses set you up for — the shuffle, the stages, the memory model — all now visible and tunable in the UI. Our Lambda pipeline is complete, deployed, and fast. Let’s step back and see the whole thing.',
          delta: [{ kind: 'solidify', ids: ['deploy', 'run-tune'] }],
        },
      ],
    },
    {
      // ── CLOSER §13. Camera pulls back to the WHOLE map (`focus: []` → nothing dimmed, full
      //    brightness). Ties the capstone together AND closes the whole five-course arc. ──
      id: 'closer',
      heading: 'Everything, end to end',
      scene: 'lambda-arch',
      focus: [],
      slide: {
        title: 'Everything, end to end',
        body: [
          'One pipeline, every concept — the whole Spark journey, running.',
          '',
          '### What we built',
          '- **Batch layer** — read → clean → join → aggregate → partitioned write (accurate)',
          '- **Speed layer** — readStream → enrich → window → write (seconds fresh)',
          '- **Serving** — merge the two into one answer; **deployed** and **tuned** on a cluster',
          '',
          '### Every course, exercised',
          '- **evolution** → the engine we stand on · **architecture** → how it runs on the cluster',
          '- **api** → DataFrames, joins, Catalyst/Tungsten · **streaming** → the whole speed layer',
          '- filled inline: data sources · partitioning · broadcast joins · deploy/ops · **AQE**',
          '',
          'From the road that built Spark to a real system running on a cluster — that’s Apache Spark, end to end.',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Let’s pull all the way back and take in the whole thing, lit up at once. On the left, the batch layer: it reads the day from the lake, cleans and deduplicates it, joins in product details and aggregates, and writes a partitioned, accurate view — our source of truth. On the right, the speed layer: it reads the live stream from Kafka, enriches it with a broadcast join, aggregates it in event-time windows under a watermark, and writes a checkpointed, exactly-once real-time view. Below, the serving layer merges the two — accurate history plus the fresh present — into a single answer, and the whole system runs on a cluster, submitted, configured, and tuned in the Spark UI. And look at what this one project touched. The evolution course gave us the engine we’re standing on. The architecture course is right there in how these jobs run — drivers, executors, stages, shuffles, deploy modes. The API course is in every line — DataFrames, joins, Catalyst planning the sort-merge and the broadcast, Tungsten running them. The streaming course is the entire speed layer, from the unbounded table to watermarks to exactly-once. And the gaps we hadn’t covered — data sources and pushdown, partitioning, broadcast joins, deployment, and adaptive execution — we filled right here, in context, because a real pipeline needs them. That’s the arc of this whole series: from the road that led to Spark, through how a job runs, up the layers you write, out to streaming, and finally into one real, end-to-end system. That is Apache Spark.',
          delta: [
            {
              kind: 'solidify',
              ids: [
                'sources', 'src-lake', 'src-kafka',
                'batch', 'ba-read', 'ba-clean', 'ba-agg', 'ba-view',
                'speed', 'sp-read', 'sp-enrich', 'sp-window', 'sp-view',
                'serving', 'sv-merge', 'sv-answer',
                'deploy', 'run-submit', 'run-cluster', 'run-tune',
              ],
            },
          ],
        },
      ],
    },
  ],
}
