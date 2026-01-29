| title: | sidebar_label: | description: |
| ----------- | ----------- | ----------- |
| DRR data journey via Postman | DRR data journey via Postman | "Use the Postman API agent to send HTTP requests to the DRR services." 


This page explains the full end to end workflow for converting an **FpML Recordkeeping XML** into:

1. a **CDM ReportableEvent**

2. a **TransactionReportInstruction**

3. a **regulatory transaction report**, and finally

4. an **ISO 20022 XML projection**

You can complete this workflow either:
- through the [**Rosetta UI**](./drr-data-journey-using-rosetta.md) 
- using **Postman** with the DRR API services

<br>

## 1. Running the ingestion service via Postman
You can ingest an FpML example directly via API.

1.1 In Rosetta,  open **DRR Model → API Export**.

1.2 Select `FpML_5_10_RecordKeeping ingestion service`.


![Postman API export ingestion service](./static/img/drr/postman-api-export-ingestion-service.png)

1.3 Copy the **Base URL** and **API Key**.

1.4. In Postman, create a **POST** request using the copied URL.


![Postman ingestion URL](./static/img/drr/postman-ingestion-url.png)


1.5. In **Headers**, set:
- Key: Authorization
- Value: API Key from Rosetta

1.6. In **Body**, choose **raw → XML**.


![Postman ingestion body](./static/img/drr/postman-ingestion-body.png)

1.7. Paste your FpML XML and click **Send**.


![Postman ingestion response](./static/img/drr/postman-ingestion-response.png)


1.8. Copy the `originatingWorkflowStep` and `reportableInformation` sections:

```haskell
{
“originatingWorkflowStep”: { * }, “reportableInformation”: { * }
}
```


## 2. Running the custom function service
Use the ingestion output to generate a `ReportableEvent`.

2.1 In Rosetta → API Export, select `run-function-service`.


![Postman API export custom function service](./static/img/drr/postman-api-export-cust-func-service.png)


2.2. Copy the URL and create a new POST request in Postman. Then add: `/drr.regulation.common.functions.Create_ReportableEventFromInstruction`

2.3. Add the **Authorization** header again.

2.4. In **Body**, choose **raw → JSON**.


![Postman custom function URL body](./static/img/drr/postman-cust-func-url-body.png)


2.5. Paste the JSON copied from the ingestion response and click **Send**.

 
../_images/postman-cust-func-response.png 
![Postman custom function response](./static/img/drr/postman-cust-func-response.png)

Copy the resulting JSON for the next step.


## 3. Running the regulation report service
Use the `ReportableEvent` to generate the final regulatory report.

3.1. In Rosetta → API Export, select **regulation-report-service**.


![Postman API export report service](./static/img/drr/postman-api-export-report-service.png)

3.2. Copy the URL and create a new **POST** request.
Append the regulation path, e.g. `/CFTC/Part45`

3.3. Then add the **Authorization** header.

3.4. In **Body**, choose **raw → JSON**.

3.5. Paste the output from the custom function step and click **Send**. This returns the final **regulatory transaction report**: 


![Postman report service URL body response](./static/img/drr/postman-report-service-url-body-response.png)




