| title: | sidebar_label: | description: |
| ----------- | ----------- | ----------- |
| DRR structure | DRR structure | "How the data in DRR is organized." 


## DRR structure – where DRR lives 

The [DRR codebase](https://ui.rosetta-technology.io/workspaces/read-only-digital-regulatory-reporting?view=textual&topPanel=true) is contained in six key areas: 

 

**Base** – This folder (namespace: drr.base.*) is where all DRR data lives. Objects within Base can leverage CDM or other Base objects only, including functions, types, rules, corpus, enums etc. 

 

**Enrichment** – Where all foundational enrichment elements happen (namespace: drr.enrichment.*). DRR objects can be enriched with additional reportable information eg a legal entity identifier (LEI). 

 

**Mapping** – This code (namespace: drr.mapping.*) maps FpML trades to CDM objects (reportable events) to their related CDM objects. This is currently achieved using synonyms but the process will be replaced by functional mapping in 2026. 

 

**Projection** – DRR objects (namespace: drr.projection.*) converted to report format (harmonised ISO 20022) for trade repository-ready submission. 

 

**Regulation** – All regulatory logic lives here (namespace: drr.regulation.*), including reporting rules, standards and critical data (CD) logic.  

 

**Standards** – This is where the critical data elements (CDE) and ISO enums are kept (namespace: drr.standards.*). 


 ![DRR data namespaces](./static/img/drr/drr-data-structure.png) 

<br>

## DRR data hierarcy
Different data types within DRR can interact with each other in different ways:

<br>

 ![DRR data hierarchy](./static/img/drr/drr-data-hierarchy.png) 

### Namespace dependency rules
There is a strict hierarchy governing allowable dependencies:
 - **Regime namespaces** may import from `common` and `cde`
- **Common namespaces** may import from `cde`
- **CDE namespaces** may only import from `base`
