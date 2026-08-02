import type { Course } from 'flow-engine'

// Course: "The road to Spark" — a top-to-bottom evolution timeline on the shared `evolution`
// scene. Reveal accumulates down the whole course (every section rides the SAME scene), so
// each era's band stays visible (dimmed) as the camera travels past it to the next.
//
// Each era is a 1-beat MAP section: the whole band lights at once (evolution is a comparison,
// not a process to assemble). Slides are Markdown bodies (react-markdown + GFM) that fill the
// right pane with that era's features. STATUS: overview + all five eras authored.
export const evolution: Course = {
  id: 'evolution',
  title: 'The road to Spark',
  sections: [
    {
      // ── overview: the whole ghosted timeline, framed whole (empty delta → nothing
      //    solidifies → all ghosted; empty focus → whole-scene fit). ──
      id: 'the-road',
      heading: 'The road to Spark',
      scene: 'evolution',
      focus: [],
      slide: {
        title: 'The road to Spark',
        body: [
          'Five leaps from **2006 to 2016** — each one fixing the limit of the one before.',
          '',
          '### The journey',
          '- **Hadoop 1** — store and compute at scale',
          '- **Hadoop 2 / YARN** — free the scheduler',
          '- **Spark 1** — bring it in-memory',
          '- **Spark 2** — unify the whole API',
          '',
          'We’ll walk it top to bottom.',
        ].join('\n'),
      },
      beats: [
        { line: 'Before we build anything, here’s the whole road — five leaps over ten years, each one fixing the limit of the one before it. We’ll walk it top to bottom.', delta: [] },
      ],
    },
    {
      // ── band ①: the problem ──
      id: 'the-problem',
      heading: 'Why Spark exists',
      scene: 'evolution',
      slide: {
        title: 'Why Spark exists',
        body: [
          'By the mid-2000s, data had outgrown the single machine.',
          '',
          '### The shift',
          '- Datasets grew past one machine’s disk and memory',
          '- Scaling *up* — a bigger box — hit a hard ceiling',
          '- Scaling *out* across commodity machines was the only affordable path',
          '',
          '### What that demands',
          '- A **distributed storage** layer',
          '- A **distributed programming model**',
        ].join('\n'),
      },
      beats: [
        {
          line: 'To understand Spark, start with the problem it was built for. By the mid-2000s, datasets had outgrown what any single machine could store or process — so the only affordable path was to scale out, spreading both the data and the computation across a cluster of commodity machines.',
          delta: [{ kind: 'solidify', ids: ['spine-problem', 'prob', 'p-bigdata', 'p-scaleout'] }],
        },
      ],
    },
    {
      // ── band ②: Hadoop 1 ──
      id: 'hadoop-1',
      heading: 'Hadoop 1: store, then MapReduce',
      scene: 'evolution',
      slide: {
        title: 'Hadoop 1 · 2006',
        body: [
          'The first answer: store the data, then compute over it.',
          '',
          '### What it added',
          '- **HDFS** — files split into blocks; a *NameNode* indexes, *DataNodes* store',
          '- **MapReduce** — the batch compute model: map → reduce',
          '- **JobTracker + TaskTrackers** — one scheduler dispatching work per node',
          '',
          '### The catch',
          '- A single **JobTracker** did scheduling *and* resource management — a bottleneck',
          '- **MapReduce-only**, and heavy on disk between every step',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Hadoop 1 was the first real answer. HDFS stored each file as blocks — a NameNode indexing where they lived on the DataNodes — and MapReduce ran the compute over them. But a single JobTracker handled both scheduling and resource management, assigning the work to TaskTrackers on every node: a bottleneck that only ran MapReduce and leaned hard on disk.',
          delta: [
            { kind: 'solidify', ids: ['spine-h1', 'h1', 'h1-hdfs', 'h1-namenode', 'h1-datanodes', 'h1-mapreduce', 'h1-jobtracker', 'h1-tasktrackers', 'h1-limit'] },
            { kind: 'draw', edges: [['h1-namenode', 'h1-datanodes'], ['h1-jobtracker', 'h1-tasktrackers']] },
          ],
        },
      ],
    },
    {
      // ── band ③: Hadoop 2 / YARN ──
      id: 'hadoop-2',
      heading: 'Hadoop 2: YARN splits the bottleneck',
      scene: 'evolution',
      slide: {
        title: 'Hadoop 2 · YARN · 2013',
        body: [
          'YARN split resource management out from the compute.',
          '',
          '### What it added',
          '- **ResourceManager** — owns the cluster’s resources',
          '- **ApplicationMaster** — one per job, owns that job’s lifecycle',
          '- **NodeManagers** — launch and watch containers on each node',
          '',
          '### Why it mattered',
          '- Compute is **decoupled** from resource management',
          '- The cluster runs **many engines** — no longer MapReduce-only',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Hadoop 2 broke that bottleneck apart with YARN. A cluster-wide ResourceManager now owned the machines, while a per-application ApplicationMaster owned each job and NodeManagers ran the containers. Splitting resource management from the compute meant the cluster was no longer married to MapReduce — any engine could run on it.',
          delta: [
            { kind: 'solidify', ids: ['spine-h2', 'h2', 'h2-rm', 'h2-am', 'h2-nm', 'h2-decouple', 'h2-engines'] },
            { kind: 'draw', edges: [['h2-rm', 'h2-am'], ['h2-rm', 'h2-nm']] },
          ],
        },
      ],
    },
    {
      // ── band ④: Spark 1 ──
      id: 'spark-1',
      heading: 'Spark 1: in-memory RDDs',
      scene: 'evolution',
      slide: {
        title: 'Spark 1 · 2014',
        body: [
          'An in-memory engine, running on YARN.',
          '',
          '### What it added',
          '- **RDDs** — distributed datasets kept **in memory** between steps',
          '- **DAG scheduler** — pipelines stages instead of round-tripping to disk',
          '- **Driver** — builds and coordinates the job',
          '',
          '### The payoff',
          '- Runs **on YARN** (or standalone / Mesos)',
          '- **10–100×** faster for iterative & interactive work',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Spark was the engine that took advantage. A Driver builds the job as a DAG of RDDs — datasets held in memory rather than written to disk between steps — and a DAG scheduler pipelines the stages. Running on YARN like any other application, it was ten to a hundred times faster for the iterative and interactive workloads MapReduce struggled with.',
          delta: [
            { kind: 'solidify', ids: ['spine-s1', 's1', 's1-driver', 's1-rdd', 's1-dag', 's1-onyarn', 's1-fast'] },
            { kind: 'draw', edges: [['s1-driver', 's1-rdd'], ['s1-rdd', 's1-dag'], ['s1-onyarn', 'h2-rm']] },
          ],
        },
      ],
    },
    {
      // ── band ⑤: Spark 2 ──
      id: 'spark-2',
      heading: 'Spark 2: the unified engine',
      scene: 'evolution',
      slide: {
        title: 'Spark 2 · 2016',
        body: [
          'One engine for every workload.',
          '',
          '### What it added',
          '- **DataFrames / Datasets** — structured, typed APIs',
          '- **Catalyst** — a query optimizer that plans your logic',
          '- **Tungsten** — codegen + off-heap memory for raw speed',
          '- **Structured Streaming** — the same API, on streams',
          '',
          '### The result',
          '- **One engine**: batch · SQL · ML · streaming',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Spark 2 turned that engine into a unified platform. A single SparkSession fronts DataFrames and Datasets — structured, typed APIs whose queries the Catalyst optimizer plans and Tungsten compiles down to tight, off-heap code. Structured Streaming brought the same API to streaming, so one engine now covers batch, SQL, machine learning, and streaming.',
          delta: [
            { kind: 'solidify', ids: ['spine-s2', 's2', 's2-session', 's2-df', 's2-catalyst', 's2-tungsten', 's2-streaming', 's2-unified'] },
            { kind: 'draw', edges: [['s2-session', 's2-df'], ['s2-df', 's2-catalyst'], ['s2-catalyst', 's2-tungsten']] },
          ],
        },
      ],
    },
  ],
}
