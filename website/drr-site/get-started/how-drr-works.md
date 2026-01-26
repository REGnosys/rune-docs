| title: | sidebar_label: | description: |
| ----------- | ----------- | ----------- |
| How DRR works | How DRR works | "Learn how DRR processes your data for regulatory reporting." 



# How DRR works


## DRR architecture
At its core, DRR consists of a **four-layer architecture** built to turn human written regulatory rules into **machine executable logic** that produces **standardised reporting outputs** across jurisdictions.

Think of it as a pipeline:

**Regulatory rules → Machine readable rules → Execution engine → Integration**

![4 layers of DRR](./static/img/drr/drr-layers.png)
 
<br>

### Layer 1: Regulatory rules (human language)
DRR does the heavy lifting of consolidating the inconsistent world of regulatory rules, which are written in natural language and come full of ambiguity, exceptions and cross references.

**DRR’s job is to standardise and encode them.**

Regulatory text may include:
- CFTC Part 43/45
- EMIR RTS/ITS
- ASIC DTR
- MAS reporting rules
- JFSA OTC reporting
- MiFID/MiFIR 


<br>

### Layer 2: Machine readable rules (DRR logic)
DRR consists of four key steps to transform your data, ready for reporting:
- **Ingest.** Normalises raw input into CDM – this first step takes a firm’s transaction event data and translates it into a DRR report object representing that transaction.
- **Enrich.** Adds derived fields (e.g. reporting counterparty, clearing status). This step enriches a DRR reportable event with additional information obtained from an internal or external data sources.
- **Report.** Applies regime-specific reporting rules. The enriched DRR reportable event receives the reporting logic (field rules plus any additional regulatory data guidelines and data validation rules) to produce a DRR transaction report object containing all the reportable fields. 
- **Project.** Produces the final reporting output. The DRR transaction report object acquires additional mapping and projection rules to produce a report file in the format required by trade repositories (TRs) or regulators (e.g. XML, ISO 20022).

![DRR process overview: Ingest, Enrich, Report, Project](./images/drr-process-overview-2.png)


<br>

### Layer 3: Execution engine (e.g. Rosetta platform)
The Rosetta platform was built specifically for DRR and it’s where the DRR logic actually runs. Rosetta:
- Loads CDM types
- Executes DRR logic step by step
- Produces intermediate outputs (Ingest → Enrich → Report → Project)
- Validates CDM input and dRR logic
- Generates reporting payloads

This layer ensures that **everyone running DRR gets the same result** for the same input. This layer is:
- Deterministic
- Auditable
- Version controlled
- Repeatable across firms


**Note:** DRR is not reliant on the Rosetta platform, firms can build their own execution engine if required.


<br>

### Layer 4: Integration (firms, vendors, trade repositories)
This is where DRR meets the real world. Firms, vendors and others can use DRR outputs to submit compliant reports.
Firms can plug DRR into:
- Reporting engines
- Data pipelines
- Validation frameworks
- Trade repositories
- ARM/TR connectivity
- Internal controls and reconciliations


This layer includes:
- Banks and dealers
- Buy side firms
- Reporting vendors
- Trade repositories
- Market utilities


<br>

## CDM basics

The Common Domain Model (CDM) is the foundation of DRR. It provides a shared, unambiguous way to describe financial products, events and processes so that every firm, vendor and regulator can interpret data and rules in the same way. You can read the full documentation for CDM but here are a few highlights. 

### What the CDM is
The CDM is a standardised data model for representing:
- Financial products
- Trades and trade states
- Lifecycle events
- Processes and workflows
- Legal agreements


CDM defines these concepts in a machine readable and machine executable format. Instead of each firm interpreting regulatory rules differently, the CDM ensures that everyone uses the same underlying structures and definitions.

### How DRR uses the CDM 
DRR uses the CDM as its **single source of truth** for:
- How trades are represented.
- How lifecycle events are applied.
- How derived fields are calculated.
- How reporting logic is executed.

This gives DRR three essential qualities:
- **Consistency:** The same input produces the same output across firms.
- **Transparency:** Every field and rule is explicitly defined.
- **Interoperability:** CDM based data can flow across systems without translation.

Without the CDM, DRR would be just another set of bespoke rules. With the CDM, DRR becomes a **shared industry standard**.

### Core components of the CDM
The CDM is organised into several key building blocks:

#### 1. Product
Defines the economic terms of a trade, including payouts, notionals, prices and product identifiers.

#### 2. Trade and TradeState
Represents the trade itself and its current state at any point in time.

#### 3. Event
Describes lifecycle events such as new trades, amendments, terminations, compressions and allocations. Events are applied to TradeStates to produce updated states.

#### 4. Party and roles
Identifies the parties involved in a transaction and their roles (e.g. counterparty, reporting party).

#### 5. Processes
Standardised workflows that describe how events are applied and how states evolve.

<br>

## Jurisdictions
All jurisdictions in DRR use the same underlying elements:
- **Common Domain Model (CDM)** for data structures.
-	**Ingest → Enrich → Report → Project** pipeline.
-	The same enrichment patterns and reusable functions.

Where jurisdictions differ e.g. EMIR vs CFTC vs ASIC, DRR isolates those differences in two places:
- **Report:** applies the jurisdiction’s regulatory logic.
- **Project:** produces the jurisdiction’s required reporting schema.

This means each jurisdiction can have its own rules, validations, and output formats without affecting others.

Because the core logic is shared, DRR avoids duplication and applies jurisdiction-specific logic only where it’s required. DRR maintains a clean separation of shared logic and local regulatory requirements so that data is:
- **Consistent** across jurisdictions where possible.
- **Specific** where regulations differ.
- **Transparent** in how each rule is applied.
- **Scalable** as new jurisdictions are added.

<br>

## Tracking data in DRR
The ability to track the lineage of data is one of the most important qualities of the DRR framework. Every value in a regulatory report can be traced back to its origin, every transformation step is visible, and every decision made by the logic is fully auditable. This is essential for compliance, validation and internal governance.

Data lineage –  where it comes from, how it changes and how it flows through the DRR pipeline – is explicit and machine‑readable because every step is executed using the CDM and the DRR rule logic. This means that firms, auditors and regulators can understand exactly **why** a value appears in a report. And because DRR is deterministic, producing the same output for the same input, the lineage is always the same for each input.

With DRR, you can establish:
- Which **CDM field** a reporting value came from.
- What **enrichment logic** produced a derived field.
- Which **lifecycle event** created or modified a trade.
- Why a **rule was changed** and by whom.
- What **intermediate values** were used along the way.

<br>

## DRR and the Rosetta platform
The Rosetta platform is a bespoke execution engine and SDK designed specifically for DRR. DRR is not dependent on Rosetta however, and can be used with other execution engines which are able to accommodate it.

With Rosetta, DRR provides the **machine executable regulatory logic**, while Rosetta provides the **execution environment** that runs that logic using the Common Domain Model (CDM) and [Rune DSL](https://rune-docs.netlify.app/docs/rune-documentation/get-started/overview). Together, they form a unified framework that turns complex regulatory rules into consistent, auditable reporting outputs. 

<br>

**DRR is the what:** It identifies what the rules mean, what the logic does, and what the output should be.

**Rosetta is the how:** It defines how the logic is executed, how data flows, and how results are produced.


### The role of DRR
DRR is the industry authored interpretation of regulatory reporting rules, expressed in a deterministic, machine readable format. It defines:
- How regulatory rules are translated into logic.
- How CDM data should be structured and enriched.
- How regime-specific transformations are applied.
- How final reporting outputs are produced.

### The role of the execution engine (Rosetta)
Rosetta is the original execution engine created to run DRR logic. It provides:
- A compiler for the [Rune DSL](https://rune-docs.netlify.app/docs/rune-documentation/get-started/overview) (formerly Rosetta DSL), the domain-specific language built on Java that DRR uses for its logic.
- A runtime environment for executing CDM based rules.
- Validation of CDM input and DRR output structures.
- Step by step outputs for Ingest → Enrich → Report → Project.
- Deterministic execution across firms and environments.

