import type { Course } from 'flow-engine'

// Course: "The layers you write against" — Spark's API as a stack of altitudes. Its thesis:
// you can write high (declarative structured APIs) or low (raw RDDs), but everything compiles
// DOWN through one optimizer to one physical core. Built on the `api-stack` scene (the stack,
// like `cluster-topology`), with a detour to the sibling `catalyst` scene for the compile-down
// pipeline (the job→stage→task role that `execution` played in the architecture course).
//
// Rhythm mirrors `evolution` / `spark-architecture`: an opening whole-scene overview (drawn
// solid, framed whole via `focus: []`), then the camera travels band by band — every section is
// a 1-beat MAP that lights its band and dims the rest (Spark's locked solid-tour model). This is
// the course the architecture closer teed up: "the layers you actually write against — RDDs,
// DataFrames, Datasets, and the optimizer beneath them."
//
// PLANNED sections (author one reviewed slice at a time):
//   1. overview          api-stack  focus:[]                    ← DONE
//   2. rdd-foundation    api-stack  focus band ③ (RDD)          ← DONE (this slice)
//   3. structured-apis   api-stack  focus band ① (DataFrame/Dataset/SQL)  ← DONE (this slice)
//   4. the-engine        api-stack  focus band ② (Catalyst+Tungsten)  ← DONE (this slice)
//   5. catalyst-overview catalyst   focus:[]  (scene switch)  ← DONE (this slice)
//   6. catalyst-logical  catalyst   focus band ① (logical)  ← DONE (this slice)
//   7. tungsten-physical catalyst   focus band ② (physical)  ← DONE (this slice)
//   8. unification       api-stack  focus:[]  (closer)  ← DONE (this slice)
//
// STATUS: COMPLETE — all 8 sections authored across two scenes (`api-stack`, `catalyst`). Next
// for this course: regen `audio-manifest.json` (npm run gen:audio) + generate wavs on Colab.
export const sparkApi: Course = {
  id: 'spark-api',
  title: 'The layers you write against',
  sections: [
    {
      // ── overview (SOLID TOUR): the whole stack drawn solid up front, framed whole (delta
      //    solidifies every scene node → all edges auto-solidify since both endpoints are
      //    revealed; empty focus → nothing dimmed, so the opener is a full-brightness overview).
      //    Every later section rides the same scene — nothing re-ghosts; each just lights its own
      //    band (focus) and dims the rest. ──
      id: 'overview',
      heading: 'The layers you write against',
      scene: 'api-stack',
      focus: [],
      slide: {
        title: 'The layers you write against',
        body: [
          'Spark is a **stack of altitudes** — write high or write low, it all compiles to the **same core**.',
          '',
          '### The altitude ladder — high-level on top',
          '- **Structured APIs** — DataFrame, Dataset, Spark SQL: declare *what* you want',
          '- **The engine** — **Catalyst** plans your query, **Tungsten** compiles it to fast code',
          '- **RDD** — the low-level core: resilient, partitioned; the layer it *physically* runs on',
          '',
          '### One rule underneath it all',
          '- Every structured query becomes a **plan** → optimized → executed as **RDDs**',
          '- Drop to raw RDDs and you **skip the optimizer** — full control, but you tune it yourself',
          '',
          '### On top: the workloads',
          '- **Structured Streaming · MLlib · GraphX** — libraries that all ride this same core',
          '- Each is its own course; here we build the **foundation** they stand on',
          '',
          'We’ll start at the bottom — the RDD core — then climb to what you actually write.',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Before we climb through it, here’s the whole stack at a glance. The big idea of this course is that Spark isn’t one API — it’s a stack of altitudes, and you get to choose the height you work at. Near the top sit the structured APIs: DataFrame, Dataset, and Spark SQL. These are declarative — you say what result you want, not how to compute it. Beneath them is the engine that makes that possible: Catalyst, which plans and optimizes your query, and Tungsten, which compiles that plan down into tight, fast code. And at the very bottom is the RDD — the low-level core: a resilient, partitioned, distributed collection, and the physical layer that everything ultimately runs on. That’s the one rule tying the whole stack together: no matter which structured API you write, it becomes a plan, gets optimized, and is executed as RDDs — the exact same core the machines ran in the last course. You can also drop straight down to raw RDDs yourself, which skips the optimizer entirely — that gives you total control, but now the tuning is on you. And resting on top of this whole foundation are the workloads — Structured Streaming, MLlib, GraphX — libraries that all ride this same core, each its own course later; here we’re building the foundation they stand on. We’ll walk it bottom to top: start at the RDD core, then climb up to the structured APIs you actually write, and finally look inside the engine that connects them.',
          // Solidify every node so the whole stack is drawn solid for this overview. Edges need no
          // explicit draw — each goes solid once both endpoints are revealed.
          delta: [
            {
              kind: 'solidify',
              ids: [
                'libs', 'lib-streaming', 'lib-mllib', 'lib-graphx',
                'sa', 'sa-dataframe', 'sa-dataset', 'sa-sql',
                'eng', 'eng-catalyst', 'eng-tungsten',
                'rdd', 'rdd-resilient', 'rdd-partitioned', 'rdd-physical',
              ],
            },
          ],
        },
      ],
    },
    {
      // ── band ③: the RDD CORE — the bottom of the stack, where we start. Focus defaults to the
      //    solidified ids (the whole `rdd` band container + its tiles) → the camera drops to the
      //    bottom band and lights it; everything above (already solid from the overview) dims. ──
      id: 'rdd-foundation',
      heading: 'RDD: the low-level core',
      scene: 'api-stack',
      slide: {
        title: 'RDD — the low-level core',
        body: [
          'Start at the bottom: the **RDD** — *Resilient Distributed Dataset* — the original Spark abstraction everything else compiles down to.',
          '',
          '### What an RDD is',
          '- **Distributed collection** — your data split into **partitions** across the cluster',
          '- **Immutable** — a transformation makes a *new* RDD; you never edit one in place',
          '- **Resilient** — Spark tracks each RDD’s **lineage**, so a lost partition is *recomputed*, not lost',
          '',
          '### How you work with it',
          '- **Transformations** (`map`, `filter`, `flatMap`) — **lazy**; they just extend the lineage',
          '- **Actions** (`count`, `collect`, `reduce`) — trigger the actual computation',
          '- Purely functional — and *you* hand-control partitioning and placement',
          '',
          '### The trade-off',
          '- **Total control** — any data type, any logic, tuned by hand',
          '- But **opaque to the optimizer** — Spark sees your lambdas, not your *intent*, so it can’t optimize for you',
          '',
        ].join('\n'),
      },
      beats: [
        {
          line: 'We start at the very bottom of the stack, with the RDD — the Resilient Distributed Dataset. This was Spark’s original abstraction, the one we met back in the evolution course, and everything higher up eventually compiles down to it. So what is it? At heart, an RDD is just a distributed collection: your data split into partitions and spread across the executors of the cluster. Two properties make it special. First, it’s immutable — you never modify an RDD in place; every transformation produces a brand-new one. And second, it’s resilient, which is where the name comes from: Spark remembers the exact chain of steps that built each RDD — its lineage — so if a partition is lost when a machine dies, Spark simply recomputes that piece from the lineage instead of failing. You work with it in two kinds of operation. Transformations, like map, filter, and flatMap, are lazy — calling one doesn’t compute anything, it just extends the lineage graph. It’s only an action, like count, collect, or reduce, that actually triggers the work. It’s a purely functional model, and it hands you enormous control: any data type you like, any logic you can write, and manual say over how data is partitioned and placed. But that control is exactly the catch. Because you hand Spark arbitrary lambdas, the engine can’t see what you’re trying to do — it sees opaque functions, not your intent — so it can’t optimize the plan for you; whatever tuning happens is on you. And that blind spot is precisely the problem the structured APIs, one layer up, were built to solve.',
          delta: [{ kind: 'solidify', ids: ['rdd', 'rdd-resilient', 'rdd-partitioned', 'rdd-physical'] }],
        },
      ],
    },
    {
      // ── band ①: the STRUCTURED APIs — the top band and the heart of the course. Camera climbs
      //    from the RDD floor up to what you actually write. One combined section covers all three
      //    front-ends (DataFrame / Dataset / Spark SQL); focus defaults to the solidified `sa` band
      //    → the top band lights, the engine + RDD below dim. ──
      id: 'structured-apis',
      heading: 'The Structured APIs',
      scene: 'api-stack',
      slide: {
        title: 'The Structured APIs',
        body: [
          'One layer up: give your data a **schema**, and Spark can finally *see* — and optimize — what you’re doing.',
          '',
          '### DataFrame — the workhorse',
          '- A **table of Rows** with a named **schema** — a distributed table, like SQL or pandas',
          '- **Untyped** columns — names and types checked at *runtime*',
          '- The universal API — same in **Python, Scala, Java, R**',
          '',
          '### Dataset[T] — DataFrame with types',
          '- DataFrame **plus compile-time type safety** — `Dataset[Person]`, not just rows',
          '- **Encoders** map your JVM objects ↔ Spark’s compact internal format',
          '- **JVM-only** (Scala / Java); in fact `DataFrame = Dataset[Row]`',
          '',
          '### Spark SQL — the same engine, as text',
          '- The **same engine**, driven by **ANSI SQL** strings instead of code',
          '- Query **tables & views** in the **catalog** — mix SQL and DataFrames freely',
          '',
          'Three front-ends, one shared truth: each compiles to the *same* optimized plan — because now Spark knows your **intent**.',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Now we climb up from that RDD floor to the layer you actually write against — the structured APIs — and this is the heart of the whole course. The move that changes everything is simple: you give your data a schema — named columns with types. The moment you do that, Spark stops seeing opaque lambdas and starts seeing intent, which is what finally lets it optimize your work for you. There are three ways in, and they’re all the same engine wearing different faces. The first and most common is the DataFrame: think of it as a distributed table of rows with a named schema, much like a SQL table or a pandas DataFrame. Its columns are untyped, meaning the names and types are checked at runtime rather than by the compiler, and it’s the universal API — it looks the same whether you write Python, Scala, Java, or R. The second is the Dataset, which is a DataFrame plus compile-time type safety: instead of generic rows you get typed objects, a Dataset of Person, so the compiler catches your mistakes before the job ever runs. Spark uses things called encoders to translate those JVM objects to and from its own compact internal format. The catch is that Datasets are JVM-only — Scala and Java — and in fact, under the hood, a DataFrame is just a Dataset of Row, the untyped special case. The third face is Spark SQL: the very same engine, but driven by plain ANSI SQL text instead of code. You register tables and views in a catalog and query them with ordinary SQL, and you can freely mix SQL and DataFrame calls in one program. So there are three front-ends here, but only one shared truth underneath: whichever you pick, it compiles down to the exact same optimized plan — because now, at last, Spark understands what you’re trying to do. And that plan is built by the engine sitting just below, which is where we go next.',
          delta: [{ kind: 'solidify', ids: ['sa', 'sa-dataframe', 'sa-dataset', 'sa-sql'] }],
        },
      ],
    },
    {
      // ── band ②: THE ENGINE — the bridge between what you declare and what physically runs.
      //    Camera settles on the middle band and lights Catalyst + Tungsten; the structured APIs
      //    above and the RDD core below dim. This is the high-level two-step (plan, then compile);
      //    §5–§7 switch to the `catalyst` scene and unpack the pipeline in detail. ──
      id: 'the-engine',
      heading: 'The engine: Catalyst & Tungsten',
      scene: 'api-stack',
      slide: {
        title: 'The engine: Catalyst & Tungsten',
        body: [
          'Between what you *declare* and what actually *runs* sits the engine — it turns your query into an **optimized plan**, then into **fast code**.',
          '',
          '### Catalyst — the query optimizer',
          '- Turns your query into a **logical plan** — a tree of *what* to do — then optimizes it',
          '- Applies **rules** — filter pushdown, column pruning, constant folding — to cut wasted work',
          '- Picks the cheapest **physical plan** — the concrete *how* to run it',
          '',
          '### Tungsten — the execution backend',
          '- Compiles the chosen plan into tight **JVM bytecode** — *whole-stage code generation*',
          '- Works in **off-heap**, binary memory — no boxed objects, cache-friendly',
          '- Emits the physical work as **RDDs** — back down to the core we started from',
          '',
          '### The payoff',
          '- You say *what*; the engine works out *how* — often beating hand-written RDD code',
          '- One engine serves **DataFrame, Dataset, and SQL** identically',
          '',
        ].join('\n'),
      },
      beats: [
        {
          line: 'So how does a declarative query actually become work the cluster can run? That’s the job of the engine sitting in the middle of the stack, and it does it in two moves. The first move belongs to Catalyst, the query optimizer. It takes your structured query and turns it into a logical plan — a tree describing what you want, not yet how to get it — and then it rewrites that tree using a library of rules: pushing filters down so you read less data, pruning columns you never reference, folding constants, and so on, all to strip out wasted work. From there it weighs the options and picks the cheapest physical plan — the concrete how, like which join algorithm or which scan to use. The second move belongs to Tungsten, the execution backend. It takes that chosen plan and compiles it down into tight JVM bytecode — an idea called whole-stage code generation — and it runs on off-heap, binary memory rather than boxed Java objects, which is far friendlier to the CPU cache. What it emits is ordinary RDDs, running on the cluster — the very core we started this course at. The payoff of all this is the whole point of the structured APIs: you say what you want, the engine figures out how, and it routinely beats code you’d hand-write against RDDs yourself — and it does this identically whether you came in through a DataFrame, a Dataset, or SQL. Plan, then compile — those two moves are worth watching in motion, so let’s leave the stack for a moment and open the engine up.',
          delta: [{ kind: 'solidify', ids: ['eng', 'eng-catalyst', 'eng-tungsten'] }],
        },
      ],
    },
    {
      // ── SCENE SWITCH → `catalyst`. Switching scenes resets the reveal, so this section
      //    SOLIDIFIES the whole pipeline in one beat (solid tour) and frames it whole (`focus: []`
      //    → nothing dimmed). §6 then re-focuses the logical band, §7 the physical band. ──
      id: 'catalyst-overview',
      heading: 'Catalyst: how a query compiles',
      scene: 'catalyst',
      focus: [],
      slide: {
        title: 'Catalyst: how a query compiles',
        body: [
          'Every structured query — DataFrame, Dataset, or SQL — takes the **same trip** through Catalyst before it runs.',
          '',
          '### From query to a logical plan',
          '- Your query becomes an **unresolved logical plan** — the shape, with names not yet bound',
          '- **Analysis** resolves names & types against the **catalog** → an *analyzed* plan',
          '- **Logical optimization** applies rules → a leaner *optimized* plan',
          '',
          '### From logic to physical execution',
          '- **Physical planning** turns it into several candidate **physical plans**',
          '- A **cost model** scores each and keeps the cheapest — the **selected plan**',
          '- **Whole-stage codegen** (Tungsten) compiles it into **RDDs** that run on the cluster',
          '',
          '### Why one pipeline matters',
          '- DataFrame, Dataset, and SQL all converge here — **same optimizer, same speed**',
          '- You get the optimization *for free*, just by writing structured code',
          '',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Let’s step off the stack and into the engine itself, because Catalyst is where the magic actually happens. The key thing to hold onto is that every structured query takes exactly the same trip through here — it doesn’t matter whether you wrote a DataFrame, a Dataset, or a line of SQL; they all converge into this one pipeline. It runs in two halves. The first half is all about logic. Your query first becomes an unresolved logical plan — it captures the shape of what you asked for, but the names aren’t bound yet; Spark doesn’t yet know that “users” is a real table or that a column exists. So it runs analysis, checking those names and types against the catalog — Spark’s directory of tables, columns, and their types — and that produces an analyzed plan. Then logical optimization kicks in, applying a whole library of rewrite rules — pushing filters down, pruning unused columns, folding constants — to turn it into a leaner optimized plan. That finishes the logical half: we now know exactly what to compute. The second half decides how. Physical planning takes that optimized plan and generates several candidate physical plans — different concrete strategies, like different join algorithms. A cost model then estimates each one and keeps the cheapest, giving the selected plan. And finally, whole-stage code generation — that’s Tungsten — compiles the chosen plan straight down into JVM bytecode that runs as RDDs on the cluster. The payoff of this whole machine is that you get it for free: DataFrame, Dataset, and SQL all flow through the same optimizer and reach the same speed, just because you wrote structured code. So there are two halves here — plan the logic, then choose and compile the physical — and we’ll walk each one in turn, starting with the logical.',
          // Solidify the whole pipeline (solid tour); edges auto-solidify once both endpoints are
          // revealed, but the left→right flow reads at once because every node lights this beat.
          delta: [
            {
              kind: 'solidify',
              ids: [
                'logical', 'q', 'ulp', 'alp', 'olp', 'catalog',
                'physical', 'pp', 'cost', 'spp', 'codegen', 'rdds',
              ],
            },
          ],
        },
      ],
    },
    {
      // ── band ①: the LOGICAL half — analysis then optimization. Focus defaults to the solidified
      //    `logical` band → the top band lights, the physical band below dims. ──
      id: 'catalyst-logical',
      heading: 'The logical plan: analyze, then optimize',
      scene: 'catalyst',
      slide: {
        title: 'The logical plan: analyze, then optimize',
        body: [
          'The logical half answers **what** to compute — first make the plan *correct*, then make it *lean*.',
          '',
          '### Analysis — make it correct',
          '- The unresolved plan knows the *shape* but not the *meaning* — is `users` a real table? does `age` exist?',
          '- Analysis binds every name & type against the **catalog**',
          '- Errors surface **here** — an unknown column fails before any work runs',
          '',
          '### Logical optimization — make it lean',
          '- A library of **rule-based** rewrites, applied until the plan stops changing',
          '- **Predicate pushdown** — filter as early as possible, even into the data source',
          '- **Column pruning** — read only the columns the query actually needs',
          '- **Constant folding** — evaluate constant expressions once, up front',
          '',
          '### Why it’s rule-based',
          '- These rewrites are **always safe, always cheaper** — no data needed to decide',
          '- (Cost-based choices come later, in physical planning)',
          '',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Let’s take the logical half first — the part that works out what to compute. It starts from that unresolved plan, which knows the shape of your query but not its meaning: it doesn’t yet know whether "users" is a real table, or whether the column "age" actually exists. So the first step is analysis. Spark walks the plan and binds every name and type against the catalog — its directory of tables, columns, and their types — producing an analyzed plan. A nice side effect is that this is where mistakes get caught: if you reference a column that doesn’t exist, it fails right here, cleanly, before a single task is scheduled. Once the plan is correct, logical optimization makes it lean. Catalyst applies a whole library of rewrite rules, over and over until the plan stops changing. The classic ones are worth knowing: predicate pushdown moves your filters as early as possible — ideally all the way down into the data source, so you never even read rows you’ll throw away; column pruning makes Spark read only the columns your query touches; and constant folding evaluates constant expressions once, up front, instead of per row. The reason all of this lives in the logical half is that these rewrites are always safe and always cheaper — Spark doesn’t need to look at your data to know they help, so it just applies them. The genuinely data-dependent decisions come later. At this point the plan is both correct and minimal — but it’s still abstract; it says what to do, not how. Turning it into real execution is the physical half, and that’s next.',
          delta: [{ kind: 'solidify', ids: ['logical', 'q', 'ulp', 'alp', 'olp', 'catalog'] }],
        },
      ],
    },
    {
      // ── band ②: the PHYSICAL half — candidate plans → cost model → selected → Tungsten codegen →
      //    RDDs. Focus defaults to the solidified `physical` band → the bottom band lights, the
      //    logical band above dims. Closes the compile-down story back at RDDs. ──
      id: 'tungsten-physical',
      heading: 'The physical plan: choose, then compile',
      scene: 'catalyst',
      slide: {
        title: 'The physical plan: choose, then compile',
        body: [
          'The physical half answers **how** to run it — pick the cheapest strategy, then compile it to code.',
          '',
          '### Physical planning — many candidates',
          '- One optimized logical plan → several candidate **physical plans**',
          '- Different concrete strategies — e.g. a **broadcast** vs a **sort-merge** join',
          '',
          '### Cost model — pick the cheapest',
          '- Spark estimates each candidate using **statistics** — row counts, sizes',
          '- Keeps the lowest-cost one — the **selected plan**',
          '- This step is **cost-based** (unlike the always-safe logical rules)',
          '',
          '### Whole-stage codegen — Tungsten',
          '- Rather than interpret the plan operator-by-operator, Tungsten fuses a stage into **one tight function**',
          '- Runs on **off-heap, binary memory** — no per-row object overhead, cache-friendly',
          '- The output is **RDDs**, run on the cluster — right where the *architecture* course began',
          '',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Now the physical half, which decides how to actually run that optimized plan. The first step is physical planning, and the key idea is that a single logical plan can be executed in more than one way. So Catalyst generates several candidate physical plans — concrete strategies that would all produce the same answer. The classic example is a join: Spark could broadcast a small table to every node and hash-join it, or it could sort both sides and merge them — same result, very different performance depending on the data. That’s why the next step, the cost model, matters. Unlike the logical rules, which were always safe, this choice genuinely depends on your data — so Spark uses statistics like row counts and table sizes to estimate the cost of each candidate, and keeps the cheapest one. That’s the selected plan. Then comes the part that makes modern Spark fast: whole-stage code generation, which is Tungsten’s job. Instead of walking the plan operator by operator, interpreting each step for every row, Tungsten fuses an entire stage into a single tight function — compiled JVM bytecode — and runs it against off-heap, binary memory rather than boxed Java objects, which keeps the CPU cache happy and cuts out per-row overhead. And what that generated code produces is ordinary RDDs, executed across the cluster — which is exactly where the architecture course began, with tasks running in executor slots. So follow the whole trip: from what you want, to how to do it, to machine code, to RDDs on the cluster — all from a single line of structured query, and routinely faster than the low-level code you’d write by hand.',
          delta: [{ kind: 'solidify', ids: ['physical', 'pp', 'cost', 'spp', 'codegen', 'rdds'] }],
        },
      ],
    },
    {
      // ── CLOSER: SCENE SWITCH BACK → `api-stack`, framed WHOLE (`focus: []` → nothing dimmed,
      //    full brightness). Returning resets the reveal, so re-solidify the entire stack. One
      //    beat ties the whole course together — pick your altitude, everything compiles down —
      //    and hands off to the streaming course via the top LIBRARIES band. ──
      id: 'unification',
      heading: 'One engine, pick your altitude',
      scene: 'api-stack',
      focus: [],
      slide: {
        title: 'One engine, pick your altitude',
        body: [
          'Step back to the whole stack — and see that every path down leads to the **same core**.',
          '',
          '### Pick your altitude',
          '- **SQL / DataFrame / Dataset** — declarative & optimized; the default for almost everything',
          '- **RDD** — drop down for full control when you truly need it; you own the tuning',
          '- Either way it compiles through **Catalyst → Tungsten → RDDs**, on the cluster from last course',
          '',
          '### The workloads on top',
          '- **Structured Streaming** — the same DataFrame API, over unbounded data',
          '- **MLlib** — machine-learning pipelines on DataFrames',
          '- **GraphX / GraphFrames** — graph analytics on the same core',
          '- One engine beneath them all — batch · SQL · ML · streaming · graph',
          '',
          '### The one idea to keep',
          '- Write for **clarity**, let the engine optimize — drop low only when it earns it',
          '',
          'That’s the layered API. Next, **Structured Streaming** takes this same stack to live data.',
        ].join('\n'),
      },
      beats: [
        {
          line: 'Let’s step back to the whole stack and pull it together. The one idea to carry out of this course is that Spark gives you a choice of altitude, and every altitude lands in the same place. Up top you have the structured APIs — SQL, DataFrame, and Dataset — which are declarative and optimized, and which should be your default for almost everything you write. Below them, if you truly need it, you can drop down to raw RDDs for full, low-level control — but then the tuning is yours to own. And it doesn’t matter which you pick: it all compiles through Catalyst and Tungsten, down to RDDs running on the cluster we took apart in the last course. Resting on top of that foundation are the workloads — and now you can see why they’re drawn up there. Structured Streaming is the very same DataFrame API pointed at unbounded, live data. MLlib builds machine-learning pipelines on DataFrames. GraphX and GraphFrames do graph analytics on the same core. They all lean on the one engine underneath — one engine for batch, SQL, machine learning, streaming, and graphs. So the practical takeaway is simple: write for clarity at the highest level that expresses your intent, and let the engine do the optimizing; only drop lower when it genuinely earns its keep. That’s the layered API — the layers you write against, and the single core they all compile down to. And from here, the natural next step is to take this exact stack to data that never stops arriving: that’s Structured Streaming, and it’s where we go next.',
          delta: [
            {
              kind: 'solidify',
              ids: [
                'libs', 'lib-streaming', 'lib-mllib', 'lib-graphx',
                'sa', 'sa-dataframe', 'sa-dataset', 'sa-sql',
                'eng', 'eng-catalyst', 'eng-tungsten',
                'rdd', 'rdd-resilient', 'rdd-partitioned', 'rdd-physical',
              ],
            },
          ],
        },
      ],
    },
  ],
}
