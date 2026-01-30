| title: | sidebar_label: | description: |
| ----------- | ----------- | ----------- |
| FAQs | FAQs | "Frequently asked questions on DRR" 

# FAQs

## General 
### What is DRR?
Digital Regulatory Reporting (DRR) is an industry initiative that converts regulatory reporting rules into machine‑executable code, ensuring consistent and cost‑effective implementation across firms. It provides a shared, open‑source expression of reporting logic that firms can adopt directly.

### Who created DRR?
DRR is led by [ISDA](https://www.isda.org/isda-solutions-infohub/isda-digital-regulatory-reporting/) and developed collaboratively across the financial industry. It’s built using the [Common Domain Model (CDM)](https://www.finos.org/common-domain-model), developed by FINOS, which provides the shared data and process model underpinning the reporting logic.

### What problem does DRR solve?
Regulatory reporting is traditionally expensive, inconsistent and prone to interpretation differences. DRR standardises the rules so all firms implement the same logic, reducing cost and improving data quality.

### How does DRR ensure consistent reporting across firms?
DRR expresses regulatory rules as **machine executable logic**, removing ambiguity in how firms interpret requirements. As more firms adopt the same CDM-based transformations, reporting outputs become far more consistent across the industry.

### Does DRR support multiple jurisdictions?
Yes, very much so. DRR is designed to be **multi jurisdictional**. It includes rule models for major regimes such as CFTC, EMIR, ASIC, MAS and others. Each jurisdiction has its own transformation logic, but all share the same CDM foundation.

### How often is DRR updated?
DRR is updated whenever regulatory rules change or clarifications are issued. Because it is an open, collaborative model, updates are published centrally so all firms can adopt the latest logic at the same time, reducing divergence.

### Can I extend or customise DRR for my own use case?
Yes. DRR is open source and can be extended to support firm specific workflows or additional reporting requirements. However, core DRR logic should remain unchanged if you want to stay aligned with the industry standard interpretation.

<br>

## Technical 
### How does DRR relate to the CDM?
DRR is built as an extension of the CDM, using CDM data structures to represent transaction inputs and CDM functions to express reporting logic. This alignment reduces duplication, improves interoperability, and ensures that reporting outputs are consistent across jurisdictions and firms.

### What data do I need to run DRR?
You need transaction data structured according to the [Common Domain Model (CDM)](https://www.finos.org/common-domain-model). DRR then applies enrichment, transformation, and projection steps to produce the required regulatory fields. The DRR documentation includes examples of the expected input payloads.

### Can I test DRR logic before integrating it into my systems?
Yes. The DRR documentation includes examples for running transformations directly in the **Rosetta UI** or via **Postman**. This allows you to validate your data, inspect intermediate steps and confirm outputs before embedding DRR into production workflows.

<br>

## Regulatory 
###  How does DRR ensure that regulatory rules are interpreted consistently across firms?
DRR expresses regulatory requirements as machine executable logic built on the [Common Domain Model (CDM)](https://www.finos.org/common-domain-model). Because the logic is deterministic, the same input always produces the same output, no matter who runs it. This removes firm specific interpretation and ensures that all participants apply the rules in a consistent, regulator aligned way.

### Does DRR replace a firm’s responsibility to understand the regulation?
No. DRR helps firms implement the rules accurately, but it does not replace the need to understand the underlying regulation. Firms remain responsible for compliance, governance and oversight. DRR simply provides a transparent, industry agreed interpretation that reduces ambiguity and implementation risk.

###  How does DRR handle differences between regulatory jurisdictions?
DRR uses a shared CDM foundation but applies jurisdiction specific logic in the Report and Project stages. This means common concepts (like events, products and parties) are reused across regimes, while each jurisdiction’s unique reporting rules are implemented separately. The result is consistency where possible and specificity where required.

###  Can regulators rely on DRR outputs for supervisory analysis?
Yes. One of DRR’s core goals is to improve the quality and comparability of regulatory data. Because DRR logic is transparent, version controlled and applied consistently across firms, regulators receive cleaner, more standardised data. This supports better supervision, reduces reconciliation issues and strengthens trust between industry and regulators.

###  How does DRR support auditability and regulatory assurance?
Every value produced by DRR can be traced back through the full reporting pipeline – Ingest, Enrich, Report and Project. An execution engine such as Rosetta exposes each intermediate step, making it easy to see exactly how a rule was applied and where a value came from. This end to end lineage provides strong evidence for audits, internal controls and regulatory reviews.

<br>

## Troubleshooting 
### Why is my DRR run failing before it reaches the Report stage?
This usually happens when the CDM input is incomplete or doesn’t match the expected structure. DRR validates the data during the Ingest and Enrich stages and any missing fields, incorrect types or invalid event structures will stop the run early. Check the validation messages in your execution engine (e.g. Rosetta) – they’ll point to the exact field or object that needs fixing.

### My output doesn’t match the example in the documentation. What should I check first?
Start by confirming that you’re using the same DRR version as the example. DRR is versioned, and even small updates can change outputs. Next, compare your CDM input with the example input to ensure the same fields, values and event types are present. Differences in enrichment logic often come from differences in the underlying data.

### Why am I seeing ‘no mapping found’ or ‘unmapped attribute’ errors?
These errors appear when DRR logic expects a value that isn’t present in the CDM input or hasn’t been enriched earlier in the pipeline. Check the relevant enrichment rules to confirm that the attribute is being populated. If the attribute is optional in the regulation but required by the logic, review the jurisdiction’s mapping rules to see whether a default or fallback value should be applied.

### The DRR output schema doesn’t match what my reporting system expects. What should I do?
First, verify that you’re using the correct jurisdiction and version of the DRR Project logic. Each jurisdiction has its own output schema, and older versions may differ from current regulatory requirements. If the schema is correct but your system still rejects it, compare the field names and types against the regulator’s published schema to identify mismatches.

### How do I troubleshoot unexpected values in the final reporting output?
Use your execution engine’s step by step view to trace the value back through Project, Transform, Enrich and Translate. Each stage shows exactly how the value was derived. Look for:
- Incorrect or missing enrichments
- Conditional logic that didn’t behave as expected
- Upstream CDM fields that were populated incorrectly

Once you identify the stage where the value changed unexpectedly, you can adjust the input or logic accordingly.


