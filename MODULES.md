# Apache Spark — module & section outline

This is the **design doc** for the Spark content: the 9 modules, every section,
and the spine/depth tiering. Source = the 9 runnable notebooks in
`~/Projects/apache-spark`. Goal: **lose no detail** (every section becomes a page)
while keeping a **tight, interesting flow** (a curated spine drives feed mode).

## Tiering legend

- **★ spine** — essential. Forms the narrated feed-mode story for the module.
- (plain) **depth** — kept as a page, explorable in canvas mode / content panel,
  not forced into the linear narration.

> The ★ marks below are a **first proposal** for review — not yet locked. We tune
> them module by module in the next slices.

---

## 01 · Foundations & Execution Model  (~21 sections)

- What's covered *(module hook)*
- ★ The problem Spark solves
- ★ What Spark actually is
- ★ The cluster — driver, executors, cluster manager
- ★ Memory-first execution
- ★ From your code to distributed work
- Deployment modes
- ★ When NOT to use Spark
- Setup — your first SparkSession
- ★ Lazy evaluation — first taste
- Hello Spark — a multi-step query
- ★ Lazy evaluation, in depth
- ★ The four Catalyst plans
- Tungsten — making the JVM go fast
- `.explain()` modes — seeing inside Catalyst
- ★ Adaptive Query Execution (AQE)
- The split-driver architecture *(Spark Connect)*
- Why Spark Connect exists
- Starting a server and connecting from a client
- Detecting which mode you're in
- What works and what doesn't in Connect mode

## 02 · RDD API  (15 sections)

- What's covered *(hook)*
- ★ What an RDD actually is
- ★ Partitions — the unit of parallelism
- ★ Lineage — how Spark recovers from failure
- SparkContext — the entry point for RDDs
- Creating RDDs
- ★ Transformations and actions — RDD edition
- RDDs of objects — a note for OOP programmers
- ★ Narrow vs wide transformations
- ★ Pair RDDs — the (key, value) view
- ★ `reduceByKey` vs `groupByKey` — the exam classic
- Persistence — `cache()`, `persist()`, StorageLevel
- Partition-level ops — `mapPartitions`, `repartition`, `coalesce`
- Shared variables — broadcast and accumulators
- ★ RDD vs DataFrame — when to actually reach for each

## 03 · DataFrames  (14 sections)

- What's covered *(hook)*
- ★ The Spark API hierarchy
- ★ What a DataFrame really is
- ★ Schemas — `StructType` vs DDL string
- Creating DataFrames
- Exploring a DataFrame
- ★ Column references — the four ways
- ★ Common DataFrame operations
- DataFrame ↔ pandas / RDD interop
- Three DataFrame types — keep them straight
- Operations look like pandas
- Converting between the three types
- ★ Default indexes — the most-tested gotcha
- Limitations and gotchas

## 04 · Reading & Writing  (14 sections)

- What's covered *(hook)*
- ★ The unified read/write API
- ★ Reading the four formats
- ★ Schema inference vs explicit
- ★ Predicate and projection pushdown — what actually reads less data
- Bad-record handling — the `mode` option
- Reading multiple files — globs and directories
- ★ Write modes
- Writing the four formats
- ★ `partitionBy` — the partition-pruning win
- `bucketBy` — bucketing for join-friendly layouts
- ★ `saveAsTable` vs `save` — catalog vs filesystem
- `coalesce` vs `repartition` before writing
- JDBC briefly

## 05 · Data Transformations & Aggregations  (19 sections)

- What's covered *(hook)*
- ★ The function library — `pyspark.sql.functions`
- String functions
- Date and timestamp functions
- Array functions
- ★ Conditional columns — `when` / `otherwise`
- ★ Combining DataFrames vertically — `union` vs `unionByName`
- Set operations — `intersect`, `except`
- ★ Joins — types, syntax, and the duplicate-column trap
- ★ `groupBy` + `agg`
- Aggregate function reference
- Filtering groups — Spark's `HAVING` equivalent
- Pivot tables
- Unpivot — `stack`, `unpivot`, `melt`
- Sampling — `sample` and `sampleBy`
- ★ Window functions — concept and spec
- Ranking — `row_number`, `rank`, `dense_rank`, `ntile`
- `lag` and `lead`
- Running aggregates — `rowsBetween` vs `rangeBetween`

## 06 · Spark SQL & UDFs  (19 sections)

- What's covered *(hook)*
- ★ SQL is a first-class citizen
- Setup — register the seven bank tables as views
- ★ Temporary views — session, global, and managed tables
- Basic SQL queries
- ★ Null semantics — `col == null` always returns null
- CTEs — `WITH` clause
- SQL JOINs
- Subqueries
- Window functions in SQL
- `monotonically_increasing_id` — monotonic, not sequential
- The catalog API
- ★ DataFrame API vs SQL — same plan
- Numeric functions
- Advanced date functions
- Higher-order array functions
- ★ Python UDFs — `@udf` and `spark.udf.register`
- ★ Pandas UDFs — vectorized via Apache Arrow
- ★ Performance tiers — when to use each

## 07 · Structured Streaming  (17 sections)

- What's covered *(hook)*
- ★ Batch vs Structured Streaming — the mental model
- ★ "Micro" means time, not data size
- ★ API parity — what actually changes
- Setup
- ★ Your first streaming query — rate source → memory sink
- Sources — rate, file, Kafka (reference)
- Sinks — memory, console, file, Delta, Kafka, foreachBatch
- ★ Output modes — append, update, complete
- ★ Triggers — controlling micro-batch cadence
- ★ Checkpointing and fault tolerance
- Monitoring streaming queries
- ★ Time and windows — tumbling, sliding, session
- ★ Watermarking — how it works
- Joins — stream-static and stream-stream
- Stateful operations — deduplication, arbitrary state
- State store backends + monitoring state

## 08 · Performance Tuning  (15 sections)

- What's covered *(hook)*
- ★ Partition sizing — the unit of parallelism
- ★ `repartition` vs `coalesce` vs `partitionBy` — three different things
- ★ Tuning `spark.sql.shuffle.partitions`
- ★ What triggers a shuffle
- Reading shuffles in `explain()`
- Catalyst's free wins — predicate pushdown + column pruning
- ★ AQE in depth — runtime re-optimization
- ★ Caching DataFrames — `cache()` and `persist()`
- Storage levels — reference
- `cacheTable`, `unpersist`, and anti-patterns
- Checkpointing — truncating long lineage
- ★ Driver-side bottlenecks — `collect`, `withColumn` in a loop
- ★ Join strategies, broadcast, and when NOT to broadcast
- ★ Detecting and fixing data skew

## 09 · Pandas API on Spark  (10 sections)

- What's covered *(hook)*
- ★ Why this API exists
- Setup
- ★ Three DataFrame types — keep them straight
- Creating a `ps.DataFrame`
- ★ Transformations — lazy, return another `ps.DataFrame`
- Actions — eager, trigger a Spark job
- ★ The Spark bridge — `to_spark()` and `pandas_api()`
- ★ Default index types — the most-tested gotcha
- Gotchas — where the pandas API ends

---

## Parked for phase 2 (not in the first pass)

- **10 · Exam questions** (`10-sample-questions-in-exam.ipynb`) — slot in as
  "test yourself" interludes between modules.
- **Hands-on project** (`project/` — 7 notebooks: medallion bronze/silver/gold,
  SQL analytics, streaming fraud) — a capstone track.

## Open questions for review

1. Are the ★ spine picks right per module, or should some shift?
2. Module 01 is heavy (~21 sections, spanning Foundations + Execution Model +
   Spark Connect). Keep as one module, or split Spark Connect into its own?
3. Confirm: copy the 9 notebooks into `notebooks/` as-is (self-contained), same as
   the old `apache-spark-ct` did?
