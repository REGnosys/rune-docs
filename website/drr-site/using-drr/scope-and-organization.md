| title: | sidebar_label: | description: |
| ----------- | ----------- | ----------- |
| Scope and organisation | Scope and organisation | "How DRR creates reports." 


# Scope and organisation

## 1. Reporting regimes
DRR currently supports these trade and transaction reporting regimes:

- ASIC
- CFTC
- CSA
- ESMA
- FCA
- HKMA
- JSFA
- MAS
- SEC

For each regulation, the model links to the **official regulatory documents** and the **authority that issued them**. These are represented as:
- **Body** – the issuing authority
- **Corpus** – the specific regulation or technical document

**Example:** 

```haskell
body Authority CFTC <"Commodity Futures Trading Commission (CFTC): The Federal regulatory agency established by the Commodity Futures Trading Act of 1974 to administer the Commodity Exchange Act.">``

corpus Regulation "CFTC 17 CFR Parts 45" Part45 <"Part 45 of the CFTCs regulations specifies the Commissions swap data recordkeeping and reporting requirements, pursuant to section 2(a)(13)(G) of the Commodity Exchange Act (CEA), which states that all swaps, whether cleared or uncleared, must be reported to a Swap Data Repository (SDR)">
```

The same structure is used for **standard setting bodies**, such as CPMI–IOSCO’s Critical Data Elements (CDE):

```haskell
body Authority CPMI_IOSCO <"IOSCO and the Committee on Payments and Market Infrastructures (CPMI) work together to enhance coordination of standard and policy development and implementation, regarding clearing, settlement and reporting arrangements including financial market infrastructures (FMIs) worldwide...">

corpus TechnicalGuidance "Harmonisation of Critical Data Elements (other than UTI and UPI)" CDE <"The G20 Leaders agreed in 2009 that all over-the-counter (OTC) derivative transactions should be reported to trade repositories (TRs) to further the goals of improving transparency, mitigating systemic risk and preventing market abuse...">
```

This allows every DRR rule to reference its **source text** clearly and consistently.

<br>

## 2. Namespace
The DRR model follows the [CDM’s namespace structure](https://cdm.finos.org/docs/namespace/). DRR logic sits in a dedicated **regulation layer**, using this pattern:

```haskell
drr.regulation.<body>.<regulation>
```

Reporting regulations can themselves be further sub-divided, for instance when rules go through an update:

```haskell
drr.regulation.esma.emir.refit
```

Reporting regulations can also be further sub-divided by report:

```haskell
drr.regulation.cftc.rewrite.margin
```

Some components are **shared across regulations** (e.g. common eligibility logic, shared data structures). These live in:

```haskell
drr.regulation.common
```

Standards published by global bodies (e.g. CDE) use:

```haskell
cdm.standards.
```

Which might look like:

```haskell
drr.standards.iosco.cde 
```

Regulations that implement CDE simply **import** the shared namespace:

```haskell
namespace drr.regulation.cftc.rewrite

import drr.standards.iosco.cde.*
```

This keeps the model modular, reusable, and consistent across jurisdictions.

<br>

## 3. Reportable event 
All reporting regimes assume that reporting starts from a **transaction event**. In DRR, this is represented by the `ReportableEventBase` type.

In the CDM:
- `BusinessEvent` describes the **state transition**.
- `WorkflowStep` wraps the event with **operational details** (timestamp, status, submitter).

For reporting, additional information is often required (e.g. reporting party, regime specific flags). Rather than overloading CDM types, DRR introduces a dedicated wrapper:

```haskell
type ReportableEventBase: <"Specifies a workflowstep with enriched information required for reporting.">
  [rootType]
  originatingWorkflowStep WorkflowStep (1..1) <"The workflowstep that originated the reportable event.">
  reportableTrade TradeState (0..1) <"The reportable trade decomposed from the originating workflow step when required.">
  reportablePosition CounterpartyPositionState (0..1) <"The reportable position decomposed from the originating workflow step when required.">
  reportableInformation ReportableInformation (0..*) <"Additional information required for a reportable transaction, including the reporting regime. A list of reportable information is provided when an event is reportable to more than one regime.">
```

This type:
- Is shared across all regulations
- Lives in `drr.regulation.common`
- Provides a consistent starting point for all reporting rules

<br>

## 4. Report definition
Each report is defined using three elements:

- **What to report** – the reportable fields.
- **Whether to report** – eligibility criteria.
- **When to report** – timing (this is informational only, not executable).


A report references:
- A **body** and **corpus** (the regulatory source).
- A **data type** that defines the output fields.
- An optional **standard** (e.g. ISO 20022, added at Project stage).

**Example:**

```haskell
report CFTC Part43 in T+1
  from TransactionReportInstruction
  when IsReportableEvent
  using standard ISO_20022
  with type CFTCPart43TransactionReport
```

**Note:** Eligibility rules are not yet implemented, so `ReportableEvent` is currently a placeholder.

Each field in the report’s data type can reference a functional rule:

```haskell
type CFTCPart43TransactionReport:
  [rootType]
  cleared string (1..1)
    [ruleReference Cleared]
  counterparty1 string (1..1)
    [ruleReference Counterparty1]
```

Validation rules can be added directly to the data type:

```haskell
condition IsCentralCounterpartyReportingParty:
  if cleared="Y" and centralCounterparty exists then centralCounterparty = counterparty1
  else if (cleared="I" or cleared="N") then centralCounterparty is absent
```

This ensures the report is **self validating** as it is constructed.

<br>

## 5. Rule type
A **rule** is the smallest functional unit in DRR. It takes a typed input and returns a typed output. There are two kinds:
- **Reporting rule** – computes a report field.
- **Eligibility rule** – returns a boolean indicating whether or not a report should be produced.

Both types assume the input is a `ReportableEvent`. The model enforces this through syntax validation.

Rules are **composable**, meaning a rule can call other rules that operate on nested parts of the ReportableEvent. This keeps logic modular and avoids duplication.

