| title: | sidebar_label: | description: |
| ----------- | ----------- | ----------- |
| DRR data journey via Rosetta | DRR data journey via Rosetta | "Use the Rosetta platform to deliver DRR." 



# The DRR data journey via Rosetta


This page explains the full end to end workflow for converting an **FpML Recordkeeping XML** into a:

1. **DRR ReportableEvent**

2. **TransactionReportInstruction**

3. **Regulatory transaction report**, and finally

4. **ISO 20022 XML projection**

<br>

You can complete this workflow either:
- Through the **Rosetta UI**.
- Using [Postman](./drr-data-journey-using-postman.md) with the DRR API services.

<br>


## 1. Running Rosetta Ingest
1.1. [Create a **DRR workspace** in Rosetta](https://docs.rosetta-technology.io/rosetta/rosetta-products/1-workspace/).

1.2. Open the **Ingest** panel.

1.3. Upload your own FpML example or select a preloaded test file (e.g. Example 02 Submission 1).

![Rosetta translate service](./static/img/drr/rosetta-translate-service.png)

1.4. Click the file to run the Ingest service. This produces a **DRR ReportableEvent**.

![Rosetta translate service response](./static/img/drr/rosetta-translate-service-response.png)



<br>

## 2. Running the custom Enrich service
2.1. Open the **Enrich** panel.

2.2. Select the **Enrich** function from the dropdown.

2.3. Upload your own DRR object example or select a preloaded test file from the dropdown (e.g. Example 02 Submission 1).

2.4. Click the file to run the Enrich service. This produces a `DRR TransactionReportInstruction`, enriched with additional required data from internal or external sources.



<br>

## 3. Running the Report service
3.1. Open the **Reports** panel.

3.2. Select a report type (e.g. **ESMA / EMIR Trade**).

3.3. Upload a `TransactionReportInstruction` from the previous step or select a preloaded test file from the dropdown (e.g. Example 02 Submission 1).

3.4. Click the file to to run the Report service. This produces a single regime-specific `TransactionReport` with that regime's logic applied.


![Rosetta reports service response](./static/img/drr/reports-service-response.png)

<br>

## 4. Running the Projection service
4.1. Open the **Projection** panel.

4.2. Select a projection (e.g. **EsmaEmirTradeReportToIso20022**).

4.3. Upload the `TransactionReport` JSON from the previous step or select a preloaded test file from the dropdown (e.g. Example 02 Submission 1).

4.4. Click the file to to run the Projection service. This produces the projection for the chosen regime (e.g. ISO 20022 XML, DTCC Harmonized XML). 


![Rosetta reports projection upload](./static/img/drr/reports-projection-upload.png)



<br>
