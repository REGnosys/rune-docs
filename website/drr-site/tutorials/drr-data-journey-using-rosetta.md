| title: | sidebar_label: | description: |
| ----------- | ----------- | ----------- |
| DRR data journey via Rosetta | DRR data journey via Rosetta | "Use the Rosetta platform to deliver DRR." 



# The DRR data journey via Rosetta


This page explains the full end to end workflow for converting an **FpML Recordkeeping XML** into:

1. a **CDM ReportableEvent**

2. a **TransactionReportInstruction**

3. a **regulatory transaction report**, and finally

4. an **ISO 20022 XML projection**

You can complete this workflow either:
- through the **Rosetta UI**
- using [**Postman**](./drr-data-journey-using-postman.md) with the DRR API services

<br>


## 1. Running Rosetta Ingest
1.1. Create a **DRR workspace** in Rosetta.

1.2. Open the **Translate** panel.

1.3. Upload your own FpML example or select a preloaded test file (e.g. Example 02 Submission 1).

![Rosetta translate service](./static/img/drr/rosetta-translate-service.png)

1.4. Click the file to run the Translate service. This produces a **CDM ReportableEvent**.

![Rosetta translate service response](./static/img/drr/rosetta-translate-service-response.png)


1.5. In the **CDM** panel, download the generated model as **JSON**. Save this file for the next step.

<br>

## 2. Running the custom Function service
2.1. Open the **Function** panel.

2.2. From the list, select the function `Create_TransactionReportInstructionFromInstructionDefault`.

2.3. Upload the JSON file from the ingestion step.


![Rosetta custom function service](./static/img/drr/rosetta-cust-func.png)


This produces a `TransactionReportInstruction`, including both `reportingParty` and `reportingCounterparty`.


![Rosetta custom function service response](./static/img/drr/rosetta-cust-func-response.png)

2.4. Download the output JSON for the next step.

<br>

## 3. Running the Report service
3.1. Open the **Reports** panel.

3.2. Select a report type (e.g. **ESMA / EMIR Trade**).

3.3. Upload the `TransactionReportInstruction` JSON.

Choose file type: `drr.regulation.common.TransactionReportInstruction`.


![Rosetta reports service](./static/img/drr/rosetta-reports-service.png)


You’ll see the uploaded file:
 

![Rosetta report upload](./static/img/drr/rosetta-report-upload.png)


3.4. Click the file to view the generated report.


![Rosetta reports service response](./static/img/drr/reports-service-response.png)

<br>

## 4. Running the Projection service
4.1. Open the **Projection** panel.

4.2. Select a projection (e.g. **EsmaEmirTradeReportToIso20022**).

4.3. Upload the transaction report JSON from the previous step.


![Rosetta reports projection service](./static/img/drr/reports-projection-service.png)

You’ll see the uploaded file:


![Rosetta reports projection upload](./static/img/drr/reports-projection-upload.png)

This produces the **ISO 20022 XML** projection.

<br>
