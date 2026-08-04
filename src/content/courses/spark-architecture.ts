import type { Course } from 'flow-engine'

// Course: "How a Spark job runs" — the runtime anatomy of Spark, built topology-first on the
// `cluster-topology` scene (driver → cluster manager → executors), with a two-section detour
// to the sibling `execution` scene for the job → stage → task decomposition.
//
// Rhythm mirrors `evolution`: an opening whole-scene overview (drawn solid, framed whole via
// `focus: []`), then the camera travels band by band — most sections are 1-beat Maps; the two
// process sections (job decomposition, tasks landing on slots) are multi-beat Traces.
//
// STATUS: section 1 (overview) authored. Remaining sections (driver, deploy modes, cluster
// manager, executors, job→stage→task, shuffle, scheduling, memory, recap) come next, one
// reviewed slice at a time.
export const sparkArchitecture: Course = {
  id: 'spark-architecture',
  title: 'How a Spark job runs',
  sections: [
    {
      // ── overview (SOLID TOUR): the whole topology drawn solid up front, framed whole (delta
      //    solidifies every scene node → all edges auto-solidify since both endpoints are
      //    revealed; empty focus → nothing dimmed, so the opener is a full-brightness overview).
      //    Every later section rides the same scene — nothing re-ghosts; each section just lights
      //    its own band (focus) and dims the rest. ──
      id: 'overview',
      heading: 'How a Spark job runs',
      scene: 'cluster-topology',
      focus: [],
      slide: {
        title: 'How a Spark job runs',
        body: [
          'Every Spark job is a conversation between **three kinds of process**.',
          '',
          '### The three roles',
          '- **Driver** — *your* program; it turns your code into a plan and coordinates everything',
          '- **Cluster Manager** — owns the machines and hands out the ones the driver asks for',
          '- **Executors** — the workers that actually run your tasks and hold your data in memory',
          '',
          '### One request, top to bottom',
          '- The driver asks the cluster manager for resources',
          '- The manager **launches an executor** on each granted node',
          '- The driver then drives those executors directly for the rest of the job',
          '',
          '### What this course follows',
          '- How the driver compiles your code into **jobs → stages → tasks**',
          '- How tasks are scheduled onto executor **slots**, across a **shuffle**',
          '- Where the driver runs (**deploy modes**) and how executors **cache** data',
          '',
          'That’s the whole machine — we’ll walk it top to bottom, then watch a real job flow through it.',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Before we take anything apart, here’s the whole machine at a glance. Every Spark job runs as a conversation between three kinds of process. At the top is the driver — that’s your program; it takes the code you wrote and turns it into a plan, then coordinates the entire job. The driver can’t run anything on its own, so it turns to the cluster manager, which owns the pool of machines and hands out the ones the driver asks for. On each machine it grants, the manager launches an executor — and those executors are the real workers: they run your tasks and hold your data in memory. The flow is top to bottom — the driver requests resources, the manager launches executors, and from then on the driver drives those executors directly. Over the course we’ll follow how the driver compiles your code into jobs, stages, and tasks; how those tasks get scheduled onto the executors’ slots across a shuffle; and the details around it — where the driver itself runs, and how executors cache data. That’s the whole machine, drawn in full — we’ll walk it top to bottom, the driver first, then the cluster manager, then the executors, and finish by watching a real job flow through it.',
          // Solidify every node so the whole topology is drawn solid for this overview. Edges need
          // no explicit draw — each goes solid once both endpoints are revealed.
          delta: [
            {
              kind: 'solidify',
              ids: [
                'd', 'd-session', 'd-dag', 'd-task', 'd-track',
                'deploy', 'dm-client', 'dm-cluster',
                'cm', 'cm-alloc', 'cm-standalone', 'cm-yarn', 'cm-k8s', 'cm-mesos',
                'workers',
                'w1', 'w1-exec', 'w1-slots', 'w1-cache',
                'w2', 'w2-exec', 'w2-slots', 'w2-cache',
                'w3', 'w3-exec', 'w3-slots', 'w3-cache',
              ],
            },
          ],
        },
      ],
    },
    {
      // ── band ②③: the DRIVER — your program; plans the work and coordinates it. Focus defaults
      //    to these ids → the camera frames the driver band and lights it; the rest of the (already
      //    solid) topology dims. ──
      id: 'the-driver',
      heading: 'The driver: your program',
      scene: 'cluster-topology',
      slide: {
        title: 'The Driver',
        body: [
          'The driver is **your program** — it turns your code into a plan and runs the whole show.',
          '',
          '### The entry point',
          '- **SparkSession** — the one object you create; your handle to the entire cluster',
          '- Underneath it sits the lower-level **SparkContext** — the original core',
          '',
          '### It builds the plan',
          '- **DAG Scheduler** — turns your transformations into a graph of **stages**',
          '- **Task Scheduler** — breaks each stage into **tasks** and hands them out',
          '',
          '### It stays in charge',
          '- **Tracks every executor** — heartbeats, progress, and results',
          '- It’s the single coordinator — if the driver dies, the whole application dies',
          '',
          'But the driver owns **no machines** of its own — for those it must ask the cluster manager.',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Everything starts with the driver — the process that runs your program. When you write a Spark application, the very first thing you create is a SparkSession: a single object that acts as your handle to the whole cluster. Underneath it sits the older, lower-level SparkContext — the original core — but SparkSession is the entry point you actually touch. From your code, the driver builds a plan in two steps. The DAG scheduler turns your chain of transformations into a graph of stages, and then the task scheduler breaks each stage into individual tasks and hands them out to be run. Once work is in flight, the driver stays firmly in charge: it tracks every executor through heartbeats, watches their progress, and collects their results. It is the single coordinator for the whole application, which also means it’s a single point of failure — if the driver dies, the application dies with it. But notice what the driver does not have: any machines of its own to run those tasks on. For that, it has to ask the cluster manager — and that’s where we go next.',
          delta: [
            { kind: 'solidify', ids: ['d', 'd-session', 'd-dag', 'd-task', 'd-track'] },
            { kind: 'draw', edges: [['d-dag', 'd-task']] },
          ],
        },
      ],
    },
    {
      // ── band ④: DEPLOY MODE — where the driver process physically runs (client vs cluster).
      //    Focus defaults to the deploy strip → camera frames it, lights it, dims the rest. ──
      id: 'deploy-modes',
      heading: 'Where the driver runs: deploy modes',
      scene: 'cluster-topology',
      slide: {
        title: 'Deploy modes',
        body: [
          'You choose **where the driver process runs** — and it decides who’s in charge if your machine drops.',
          '',
          '### Client mode',
          '- Driver runs on the **machine that submits** the job — your laptop or an edge node',
          '- Ideal for **interactive** work — shells, notebooks — output streams back live',
          '- But if that machine disconnects, the driver dies and the **whole job dies**',
          '',
          '### Cluster mode',
          '- Driver runs **inside the cluster**, as another container the manager launches',
          '- Survives your laptop closing — built for **production, scheduled** jobs',
          '- You lose the live console; you read progress through the manager’s logs',
          '',
          '### How you pick',
          '- One flag: `spark-submit --deploy-mode client|cluster`',
          '- Interactive sessions default to **client**; schedulers almost always use **cluster**',
          '',
          'Same application code either way — deploy mode only decides where the driver *lives*, not what it does.',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Before we follow the driver’s request down to the cluster, there’s one choice that decides where the driver process physically lives — the deploy mode — and it matters more than it sounds. In client mode, the driver runs on the same machine that submitted the job: your laptop, or an edge node. That’s ideal for interactive work like shells and notebooks, because the driver is right there and results stream straight back to you — but it comes with a catch: if that submitting machine disconnects, the driver goes with it and the whole job dies. In cluster mode, the driver instead runs inside the cluster itself, as just another container that the cluster manager launches and supervises. Now the job survives your laptop closing, which is exactly what you want for production and scheduled pipelines — the trade-off is that you lose the live console and read progress through the cluster manager’s logs instead. You pick between them with a single flag on spark-submit — deploy-mode client or cluster; interactive sessions default to client, while schedulers almost always choose cluster. And either way it’s the very same application code — the deploy mode only decides where the driver lives, not what it does.',
          delta: [{ kind: 'solidify', ids: ['deploy', 'dm-client', 'dm-cluster'] }],
        },
      ],
    },
    {
      // ── band ⑤: the CLUSTER MANAGER — owns the machines, grants the driver its resources.
      //    Focus defaults to the cm band → camera frames it, lights it, dims the rest. The
      //    driver→manager request edge is already solid (overview), re-drawn here for clarity. ──
      id: 'cluster-manager',
      heading: 'The cluster manager: who owns the machines',
      scene: 'cluster-topology',
      slide: {
        title: 'Cluster Manager',
        body: [
          'The driver has a plan but **no machines** — the cluster manager owns them and grants them.',
          '',
          '### What it does',
          '- Owns the cluster’s pool of **CPU + memory** across every node',
          '- Grants the driver **containers** — chunks of a node reserved for Spark',
          '- **Launches an executor** inside each container it hands over',
          '',
          '### The four you’ll meet',
          '- **Standalone** — Spark’s own built-in manager; simplest to stand up',
          '- **YARN** — Hadoop’s manager; the classic on-prem choice',
          '- **Kubernetes** — executors as containers; the cloud-native default',
          '- **Mesos** — general-purpose; now largely legacy',
          '',
          '### It’s pluggable',
          '- Spark doesn’t care which one — the **same app** runs on any of them',
          '- You pick it at submit: `--master yarn | k8s://… | spark://…`',
          '',
          'Once resources are granted, the manager launches the executors — where the real work happens.',
        ].join('\n'),
      },
      beats: [
        {
          line: 'The driver has a plan but no machines of its own, so it turns to the cluster manager — the component that actually owns the cluster’s pool of CPU and memory. When the driver asks for resources, the manager grants it containers — chunks of a node reserved for Spark — and launches an executor inside each one, on the worker nodes it hands over. What makes this powerful is that Spark treats this whole layer as pluggable: it doesn’t really care which manager sits here. You’ll meet four of them. Standalone is Spark’s own built-in manager, the simplest way to get a cluster running. YARN is Hadoop’s resource manager, and for years it was the classic on-premises choice — the very same YARN we watched appear back in the evolution course. Kubernetes runs executors as containers and has become the modern, cloud-native default. And Mesos was the general-purpose option, though it’s largely legacy now. Because the layer is pluggable, the same application runs on any of them — you simply point Spark at the one you want when you submit the job, using the master setting. And once the manager has granted those resources, it launches the executors — which are where the real work finally happens.',
          delta: [
            { kind: 'solidify', ids: ['cm', 'cm-alloc', 'cm-standalone', 'cm-yarn', 'cm-k8s', 'cm-mesos'] },
            { kind: 'draw', edges: [['d-task', 'cm-alloc']] },
          ],
        },
      ],
    },
    {
      // ── band ⑥: EXECUTORS & SLOTS — the workers band, but only the executor + slots tiles are
      //    focused here; the cache tiles stay dimmed until section 10 (memory & caching). The
      //    manager→executor launch edges are re-drawn. ──
      id: 'executors',
      heading: 'Executors & slots: where work runs',
      scene: 'cluster-topology',
      slide: {
        title: 'Executors & slots',
        body: [
          'Executors are the **workers** — a JVM on each node, running your tasks in parallel **slots**.',
          '',
          '### The executor',
          '- A **JVM process** the cluster manager launches on a worker node',
          '- **Long-lived** — it stays up for the whole application, reused across jobs',
          '- Usually one (or a few) per node — so **many nodes** = your parallelism',
          '',
          '### Slots = task capacity',
          '- Each executor’s **cores** become **slots** — its task capacity',
          '- One slot runs **one task** at a time — a task = work on **one partition**',
          '- Total slots across all executors = how many tasks run **at once**',
          '',
          '### Reporting back',
          '- Executors **heartbeat** the driver and return each task’s result',
          '',
          'Data lives in partitions, tasks run in slots — the executor’s *memory* comes next.',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Now we reach the executors — the processes where your work actually runs. When the cluster manager grants resources, it launches an executor on each worker node, and an executor is simply a JVM process. Crucially, it’s long-lived: it starts up and stays alive for the entire application, reused across every job you run, rather than being spun up and torn down each time. Usually there’s just one executor, or a few, per worker node — so your real parallelism comes from having many nodes. Inside each executor, the cores it was given become slots, and those slots are its task capacity: each slot runs exactly one task at a time, where a task is the unit of work over a single partition of your data. Add up the slots across every executor and that’s how many tasks Spark can run at once — that number is your parallelism. As they work, the executors heartbeat back to the driver and return their results. So the picture so far is this: your data is split into partitions, and tasks run those partitions in the executors’ slots. The other half of an executor — the memory it uses to cache data — is what we’ll look at a little later.',
          delta: [
            { kind: 'solidify', ids: ['workers', 'w1', 'w1-exec', 'w1-slots', 'w2', 'w2-exec', 'w2-slots', 'w3', 'w3-exec', 'w3-slots'] },
            { kind: 'draw', edges: [['cm-alloc', 'w1-exec'], ['cm-alloc', 'w2-exec'], ['cm-alloc', 'w3-exec']] },
          ],
        },
      ],
    },
    {
      // ── SCENE SWITCH → `execution`. Switching scenes resets the reveal, so this section
      //    SOLIDIFIES the whole `execution` scene in one beat (no ghost build) and frames it
      //    whole (`focus: []` → nothing dimmed). Section 8 then re-focuses the shuffle. ──
      id: 'job-decomposes',
      heading: 'A job decomposes: job → stages → tasks',
      scene: 'execution',
      focus: [],
      slide: {
        title: 'Job → Stages → Tasks',
        body: [
          'Your code doesn’t run as you write it — an **action** compiles it into a tree of work.',
          '',
          '### One action → one job',
          '- Transformations (`filter`, `groupBy`) are **lazy** — they just build a plan',
          '- An **action** (`count`, `collect`, `write`) is what submits a **job**',
          '',
          '### One job → stages',
          '- The **DAG scheduler** cuts the job into **stages** at every **shuffle**',
          '- Work that flows without moving data across the network stays in **one stage**',
          '',
          '### One stage → tasks',
          '- Each stage fans out into **tasks** — **one task per partition**',
          '- A task is the unit Spark ships to an executor **slot** to run',
          '',
          'So the whole hierarchy is: action → job → stages → tasks — and tasks are what actually run.',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Here’s something that surprises people: the code you write doesn’t run line by line as you type it. Transformations like filter and groupBy are lazy — calling them just adds to a plan, and nothing actually executes. It’s only when you call an action — something that needs a real answer, like count, collect, or write — that Spark takes that whole plan and submits it as a single job. From there, the driver’s DAG scheduler cuts the job into stages, and the rule is about data movement: as long as each record can be processed where it already sits — a filter, a map — the work stays inside one stage; but the moment the computation needs to bring related records together across the network, like this groupBy, Spark has to shuffle the data, and a shuffle is exactly where one stage ends and the next begins. Our little job has a single shuffle, so it splits into two stages — Stage 0 does the narrow map-and-filter work, the shuffle redistributes, and Stage 1 finishes the aggregation. Finally, each stage fans out into tasks, and this is the level that actually runs: a task is the work for one partition of the data, so Stage 0’s four partitions become four tasks, and after the shuffle Stage 1’s two partitions become two tasks. Every one of these tasks is the same code pointed at a different slice of data — the exact unit the driver ships out to the executor slots we saw earlier. So the full hierarchy is action, to job, to stages, to tasks — and it’s the tasks, running in those slots, where your data is really processed.',
          // Solidify the whole scene in one beat (no ghost build); edges auto-solidify once both
          // endpoints are revealed, but drawn explicitly here so the flow reads at once.
          delta: [
            { kind: 'solidify', ids: ['code', 'job', 'stage-0', 's0-t1', 's0-t2', 's0-t3', 's0-t4', 'shuffle', 'stage-1', 's1-t1', 's1-t2'] },
            { kind: 'draw', edges: [['code', 'stage-0'], ['stage-0', 'shuffle'], ['shuffle', 'stage-1']] },
          ],
        },
      ],
    },
    {
      // ── still on `execution`: the WHY of the stage boundary. Framed WHOLE (`focus: []`) so
      //    the big picture is kept — no camera zoom to the tiny shuffle bar (owner: zooming in
      //    loses the whole-job context). The red shuffle bar + the slide carry the emphasis.
      //    (Highlighting one node while keeping the whole scene framed would need an engine
      //    change — focus currently drives both camera AND dim together.) ──
      id: 'shuffle-boundary',
      heading: 'The shuffle: where a stage ends',
      scene: 'execution',
      focus: [],
      slide: {
        title: 'The shuffle boundary',
        body: [
          'Stages break at **shuffles** — and shuffles are the most expensive thing Spark does.',
          '',
          '### Narrow vs wide',
          '- **Narrow** dependency — each output partition reads **one** input partition (`map`, `filter`)',
          '- **Wide** dependency — an output partition needs **many** inputs (`groupBy`, `join`, `sort`)',
          '',
          '### Why a wide dep forces a shuffle',
          '- Related records live scattered across **every** partition',
          '- To group them, Spark must **redistribute** data across the network — a shuffle',
          '- That barrier is where one stage **ends** and the next **begins**',
          '',
          '### Why it’s costly',
          '- Data is written to disk, sent over the network, and re-read — slow',
          '- Fewer shuffles = faster jobs — the heart of Spark tuning',
          '',
          'So every stage boundary you see is a shuffle — and every shuffle is worth avoiding.',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Let’s look closer at that shuffle, because it’s the single most important boundary in Spark. The distinction underneath it is narrow versus wide dependencies. A narrow dependency means each output partition is built from just one input partition — a map or a filter, where every record is handled right where it already lives; that work never has to leave its partition, so it all stays in one stage. A wide dependency is the opposite: an output partition needs data from many input partitions at once. A groupBy, a join, a sort — to bring all the matching records together, Spark has to redistribute the data across the whole cluster over the network. That redistribution is the shuffle, and it’s precisely why a new stage has to start: the next stage literally cannot begin until every task of the previous one has finished feeding the shuffle. It’s also the most expensive operation Spark does — data gets written to disk, sent across the network, and read back again. So a huge part of tuning Spark comes down to one idea: every stage boundary is a shuffle, and every shuffle is worth avoiding.',
          delta: [{ kind: 'solidify', ids: ['shuffle'] }],
        },
      ],
    },
    {
      // ── SCENE SWITCH BACK → `cluster-topology`. Returning to a scene resets its reveal, so
      //    re-solidify the whole topology, then focus the driver's Task Scheduler + the executor
      //    slots. Those endpoints span top→bottom, so the camera keeps almost the whole scene in
      //    frame while lighting just the hand-off (the bands between dim) and drawing the
      //    task-dispatch edges. ──
      id: 'tasks-to-slots',
      heading: 'Tasks land on slots: plan meets machines',
      scene: 'cluster-topology',
      focus: ['d-task', 'w1-slots', 'w2-slots', 'w3-slots'],
      slide: {
        title: 'Tasks land on slots',
        body: [
          'This is where the two halves meet: the driver’s tasks are shipped to the executors’ **slots**.',
          '',
          '### The hand-off',
          '- The **Task Scheduler** holds the tasks for the current stage',
          '- It sends each task to a **free slot** on an executor, which runs it',
          '- The result goes back to the driver and the slot **frees up** for the next task',
          '',
          '### Locality — send code to data',
          '- Spark prefers a slot on the node that **already holds** that partition',
          '- Moving a little code beats moving lots of data — **data locality**',
          '',
          '### Keeping every slot busy',
          '- More tasks than slots? They **queue** and run in waves as slots free up',
          '- When a stage’s tasks all finish, the driver launches the **next stage**',
          '',
          'Repeat stage by stage to the end of the job — that’s a Spark application, running.',
        ].join('\n'),
      },
      beats: [
        {
          line: 'We’ve seen the plan — jobs, stages, and tasks — and we’ve seen the machines — the driver, the cluster manager, and the executors. This is where the two finally meet. Once the driver’s task scheduler has the tasks for the current stage, it starts handing them out: each task is sent to a free slot on one of the executors, the executor runs it, returns the result to the driver, and that slot immediately frees up to take the next task. But the scheduler doesn’t pick slots at random — wherever it can, it sends a task to a slot on the executor that already holds that task’s partition in memory. That’s data locality, and it’s a core Spark idea: it is far cheaper to ship a little bit of code to where the data already lives than to drag the data across the network to the code. If there are more tasks than there are slots — which is completely normal — the extra tasks simply queue and run in waves as slots free up, and the scheduler’s whole job is to keep every slot busy until the stage is finished. Then, when all the tasks in a stage are done, the driver launches the next stage, and repeats that all the way to the end of the job. That loop — schedule tasks onto slots, run them where the data lives, move to the next stage — is a Spark application actually running.',
          delta: [
            {
              kind: 'solidify',
              ids: [
                'd', 'd-session', 'd-dag', 'd-task', 'd-track',
                'deploy', 'dm-client', 'dm-cluster',
                'cm', 'cm-alloc', 'cm-standalone', 'cm-yarn', 'cm-k8s', 'cm-mesos',
                'workers',
                'w1', 'w1-exec', 'w1-slots', 'w1-cache',
                'w2', 'w2-exec', 'w2-slots', 'w2-cache',
                'w3', 'w3-exec', 'w3-slots', 'w3-cache',
              ],
            },
            { kind: 'draw', edges: [['d-task', 'w1-slots'], ['d-task', 'w2-slots'], ['d-task', 'w3-slots']] },
          ],
        },
      ],
    },
    {
      // ── still on `cluster-topology` (consecutive → reveal accumulates, all solid). Frame the
      //    whole `workers` band (so the WORKER NODES container shows fully — no tight zoom) while
      //    lighting the three cache tiles; the executor/slots tiles between them dim. ──
      id: 'memory-caching',
      heading: 'Executor memory & caching',
      scene: 'cluster-topology',
      focus: ['workers', 'w1-cache', 'w2-cache', 'w3-cache'],
      slide: {
        title: 'Memory & caching',
        body: [
          'An executor’s memory isn’t only for running tasks — it can **hold data** so Spark won’t recompute it.',
          '',
          '### Two uses of executor memory',
          '- **Execution memory** — scratch space for a running task (shuffles, sorts, joins)',
          '- **Storage memory** — holds cached partitions for reuse',
          '- One **unified pool** — each side borrows from the other when it’s free',
          '',
          '### `cache()` / `persist()`',
          '- By default Spark **recomputes** a DataFrame’s whole lineage on every action',
          '- `cache()` keeps its partitions in memory — later actions read **from memory**',
          '- `persist()` picks the level — memory, memory+disk, or serialized',
          '',
          '### When it pays',
          '- Big win for **reused** data — ML loops, repeated interactive queries',
          '- Cache only what you reuse; caching a once-used dataset just wastes memory',
          '',
          'If memory fills, Spark **spills to disk** or recomputes from lineage — never wrong, only slower.',
        ].join('\n'),
      },
      beats: [
        {
          line: 'There’s one part of the executor we’ve been holding back on — its memory, and what it does beyond just running tasks. An executor’s memory actually serves two purposes. There’s execution memory — the scratch space a running task uses for shuffles, sorts, and joins — and there’s storage memory, which holds cached data for reuse. Modern Spark keeps these in a single unified pool, letting one side borrow from the other when it’s free. Here’s why storage memory matters: by default, Spark recomputes a DataFrame from scratch every time you run an action on it, replaying its whole lineage. If you’re going to reuse the same DataFrame again and again — an iterative machine-learning loop, or repeated interactive queries — that’s hugely wasteful. So you call cache, or persist, to tell Spark to keep that DataFrame’s partitions in the executors’ memory after the first time it’s computed; every action after that reads straight from memory instead of recomputing. Persist also lets you choose the level — pure memory, memory that spills to disk, or a serialized form that trades a little CPU for a lot of space. The rule of thumb is simple: cache what you genuinely reuse, because caching something you only touch once just wastes memory the running tasks could be using. And if memory does fill up, Spark doesn’t fall over — it spills to disk, or drops cached partitions and recomputes them from lineage when they’re next needed. It only ever gets slower, never wrong.',
          delta: [{ kind: 'solidify', ids: ['w1-cache', 'w2-cache', 'w3-cache'] }],
        },
      ],
    },
    {
      // ── CLOSER: still on `cluster-topology`, framed WHOLE (`focus: []` → nothing dimmed, full
      //    brightness). One beat tracing a whole job end-to-end, tying the two halves of the
      //    course together — the processes (driver/manager/executors) and the execution
      //    hierarchy (job→stages→tasks→slots). The dispatch edges from §9 are still drawn, so the
      //    fully wired machine lights at once. ──
      id: 'lifecycle',
      heading: 'The full lifecycle: one job, end to end',
      scene: 'cluster-topology',
      focus: [],
      slide: {
        title: 'The full lifecycle',
        body: [
          'One trip through everything — from **submit** to a returned **result**.',
          '',
          '### The three processes',
          '- **Driver** — plans the work and coordinates it',
          '- **Cluster Manager** — grants the machines',
          '- **Executors** — run the tasks and cache the data',
          '',
          '### One job, end to end',
          '- You **submit** → the driver starts and asks the manager for executors',
          '- An **action** submits a job → the DAG scheduler cuts it into **stages** at each shuffle',
          '- Each stage → **tasks** (one per partition) → shipped to executor **slots**',
          '- Executors run tasks **near their data**, cache what’s reused, and report back',
          '- Stage done → next stage → job done → **result** returns to the driver',
          '',
          'That whole loop — plan, distribute, run, repeat — running on a cluster, is Apache Spark.',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Let’s put the whole machine together and follow a single job from start to finish. It begins when you submit your application: the driver process starts up, and its first act is to ask the cluster manager for resources — the manager grants machines and launches an executor on each one. Now the driver has workers. Your code, meanwhile, does nothing until you call an action; the moment you do, the driver compiles your plan into a job. Its DAG scheduler cuts that job into stages, breaking at every shuffle where data has to move across the network, and each stage becomes a set of tasks — one task per partition of the data. The task scheduler then ships those tasks down to free slots on the executors, preferring the executor that already holds each partition, so the work runs right next to its data. The executors run their tasks, cache any data you’ve asked to reuse, and report results back to the driver. When every task in a stage is finished, the driver launches the next stage, and it repeats — stage after stage — until the job is complete and the result comes home to the driver. That entire loop — the driver planning, the manager granting machines, the executors running tasks close to their data, stage after stage — running across a cluster, is Apache Spark. And with the runtime clear, the next course opens up the layers you actually write against: RDDs, DataFrames, Datasets, and the optimizer beneath them.',
          delta: [
            {
              kind: 'solidify',
              ids: [
                'd', 'd-session', 'd-dag', 'd-task', 'd-track',
                'deploy', 'dm-client', 'dm-cluster',
                'cm', 'cm-alloc', 'cm-standalone', 'cm-yarn', 'cm-k8s', 'cm-mesos',
                'workers',
                'w1', 'w1-exec', 'w1-slots', 'w1-cache',
                'w2', 'w2-exec', 'w2-slots', 'w2-cache',
                'w3', 'w3-exec', 'w3-slots', 'w3-cache',
              ],
            },
          ],
        },
      ],
    },
  ],
}
