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
          'From one problem to one unified engine — **2006 → 2016**.',
          '',
          '### The problem',
          '- **Big data** — datasets outgrew a single machine; the only affordable path was to **scale out** across a cluster of commodity boxes.',
          '',
          '### Four leaps — each fixes the limit of the one before',
          '- **Hadoop 1** · 2006 — *store & compute at scale*',
          '  - HDFS blocks · MapReduce · one JobTracker',
          '- **Hadoop 2 / YARN** · 2013 — *free the scheduler*',
          '  - ResourceManager · ApplicationMaster · many engines',
          '- **Spark 1** · 2014 — *bring it in-memory*',
          '  - Driver · RDDs · DAG scheduler · 10–100× faster',
          '- **Spark 2** · 2016 — *unify the API*',
          '  - DataFrames · Catalyst · Tungsten · one engine for all',
          '',
          'We’ll walk it top to bottom, one era at a time.',
        ].join('\n'),
      },
      beats: [
        { line: 'Before we build anything, here’s the whole road at a glance. It starts with one problem — by the mid-2000s, data had outgrown any single machine, so the only affordable path was to scale out across a cluster. Then come four leaps, each fixing the limit of the one before. Hadoop 1 learned to store and compute at scale, with HDFS, MapReduce, and a single JobTracker. Hadoop 2 freed the scheduler — YARN split resource management out with a ResourceManager, per-job ApplicationMasters, and room for many engines. Spark 1 brought it all in-memory — a Driver building RDDs on a DAG scheduler, ten to a hundred times faster. And Spark 2 unified the API — DataFrames, the Catalyst optimizer, and Tungsten, one engine for batch, SQL, ML, and streaming. We’ll walk it top to bottom, one era at a time.', delta: [] },
      ],
    },
    {
      // ── band ①: the problem ──
      id: 'the-problem',
      heading: 'The problem: data outgrew the machine',
      scene: 'evolution',
      slide: {
        title: 'The problem: data outgrew the machine',
        body: [
          'By the mid-2000s, data had outgrown the single machine.',
          '',
          '### The shift',
          '- Datasets grew past one machine’s disk and memory',
          '- Scaling *up* — a bigger box — hit a hard ceiling of cost and physics',
          '- Scaling *out* across cheap commodity machines was the only affordable path',
          '',
          '### But a cluster is hard',
          '- Machines **fail** constantly at scale — the system must expect it',
          '- Data must be **spread and replicated** across many disks',
          '- Work must be **split, shipped to the data, and recombined**',
          '',
          '### So it demands',
          '- A **distributed storage** layer — one filesystem over many disks',
          '- A **distributed programming model** — compute that moves to the data',
          '',
          'That pair — storage plus compute — is what Hadoop set out to build.',
        ].join('\n'),
      },
      beats: [
        {
          line: 'To understand Spark, start with the problem it was built for. By the mid-2000s, datasets had simply outgrown what any single machine could hold or process. Buying a bigger box — scaling up — hit a hard ceiling of both cost and physics, so the only affordable path was to scale out, spreading the work across a cluster of cheap, commodity machines. But a cluster brings its own problems: at that scale machines fail all the time, so the system has to expect failure; the data has to be spread and replicated across many disks; and the computation has to be split up, shipped to wherever the data lives, and then recombined. Solving that cleanly needs two things working together — a distributed storage layer that acts like one filesystem over many disks, and a distributed programming model where the compute moves to the data. That pairing is exactly what Hadoop set out to build.',
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
          '### Storage — HDFS',
          '- **HDFS** — each file split into large blocks, replicated across nodes',
          '- **NameNode** — indexes where every block lives (the metadata master)',
          '- **DataNodes** — store the actual blocks on local disk',
          '',
          '### Compute — MapReduce',
          '- **MapReduce** — the batch model: *map* in parallel, then *reduce*',
          '- **JobTracker** — one master scheduling every job',
          '- **TaskTrackers** — run the map / reduce tasks on each node',
          '',
          '### The catch',
          '- One **JobTracker** did scheduling *and* resources — a bottleneck & single point of failure',
          '- **MapReduce-only**, and heavy on disk between every step',
          '',
          'It worked at scale — but that JobTracker was the crack Hadoop 2 would fix.',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Hadoop 1 was the first real answer, and it split the problem in two: store the data, then compute over it. On the storage side, HDFS chopped each file into large blocks and spread them, replicated, across the cluster — a NameNode kept the index of where every block lived, while the DataNodes held the blocks themselves on local disk. On the compute side, MapReduce ran the work as a batch model: map over the data in parallel, then reduce the results, with a single JobTracker scheduling every job and handing tasks to TaskTrackers on each node. It genuinely worked at scale — but that one JobTracker did both scheduling and resource management, making it a bottleneck and a single point of failure, and it only ever ran MapReduce, writing to disk between every step. That crack is exactly what Hadoop 2 set out to fix.',
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
          '### The problem it fixes',
          '- Hadoop 1’s **JobTracker** was overloaded — scheduling *and* resources in one process',
          '- It was **MapReduce-only** — no other engine could use the cluster',
          '',
          '### YARN’s pieces',
          '- **ResourceManager** — one master that owns the cluster’s resources',
          '- **ApplicationMaster** — one per job; owns its lifecycle, requests containers',
          '- **NodeManagers** — launch and watch containers on each node',
          '',
          '### Why it mattered',
          '- Compute is finally **decoupled** from resource management',
          '- The cluster runs **many engines** — no longer MapReduce-only',
          '',
          'That open door is what let a new engine — Spark — move in.',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Hadoop 2 broke that bottleneck apart with a new layer called YARN. The whole problem with Hadoop 1 was that its single JobTracker was overloaded — it handled both scheduling and resource management — and it locked the cluster to MapReduce alone. YARN split that job up: a cluster-wide ResourceManager now owns the machines, a per-application ApplicationMaster owns each job’s lifecycle and requests the containers it needs, and NodeManagers launch and watch those containers on each node. Because resource management is finally decoupled from the compute, the cluster is no longer married to MapReduce — any engine can ask for resources and run on it. And that open door is exactly what let a new engine, Spark, move in.',
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
          '### The insight',
          '- MapReduce wrote to **disk between every step** — murder for iterative work',
          '- Keep the working data **in memory** across steps instead',
          '',
          '### Spark 1’s pieces',
          '- **Driver** — builds the job and coordinates it',
          '- **RDDs** — distributed datasets held **in memory** between steps',
          '- **DAG scheduler** — pipelines stages instead of round-tripping to disk',
          '',
          '### The payoff',
          '- Runs **on YARN** (or standalone / Mesos) — no cluster of its own',
          '- **10–100×** faster for iterative & interactive work',
          '',
          'But every workload still meant hand-writing RDD code — Spark 2 would fix that.',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Spark was the engine that walked through YARN’s open door, and its key insight was about disk. MapReduce wrote everything to disk between every step, which was murder for iterative jobs that pass over the same data again and again — so Spark’s answer was to keep the working data in memory instead. A Driver builds the job as a graph of RDDs — distributed datasets held in memory across steps — and a DAG scheduler pipelines those stages together rather than round-tripping to disk between each one. Running on YARN like any other application, and needing no cluster of its own, it came out ten to a hundred times faster for the iterative and interactive work MapReduce struggled with. The one rough edge: every workload still meant hand-writing low-level RDD code — and that is exactly what Spark 2 would smooth over.',
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
          '### The insight',
          '- Raw **RDD code** was low-level and hand-optimized',
          '- Declare *what* you want — let the engine work out *how*',
          '',
          '### Structured, optimized APIs',
          '- **SparkSession** — one entry point to everything',
          '- **DataFrames / Datasets** — structured, typed APIs over your data',
          '- **Catalyst** — a query optimizer that plans your logic for you',
          '',
          '### Speed & reach',
          '- **Tungsten** — codegen + off-heap memory for raw speed',
          '- **Structured Streaming** — the same API, now over streams',
          '',
          'The result: one engine for batch · SQL · ML · streaming — the Spark we use today.',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Spark 2 turned that engine into a unified platform, and it started from the frustration with Spark 1: writing raw RDD code was low-level and had to be hand-optimized. So Spark 2 flipped the model — you declare what you want, and the engine works out how. A single SparkSession is now the one entry point, fronting DataFrames and Datasets: structured, typed APIs over your data. Behind them, the Catalyst optimizer plans your query for you, and Tungsten compiles that plan down to tight, off-heap code for raw speed. Structured Streaming then brought the very same API to streaming data. The result is one engine that covers batch, SQL, machine learning, and streaming — and that is the Spark we use today.',
          delta: [
            { kind: 'solidify', ids: ['spine-s2', 's2', 's2-session', 's2-df', 's2-catalyst', 's2-tungsten', 's2-streaming', 's2-unified'] },
            { kind: 'draw', edges: [['s2-session', 's2-df'], ['s2-df', 's2-catalyst'], ['s2-catalyst', 's2-tungsten']] },
          ],
        },
      ],
    },
  ],
}
