| title: | sidebar_label: | description: |
| ----------- | ----------- | ----------- |
| Implement DRR | Implement DRR | "Terms, acronyms and jargon to help you with DRR." 


# Implement DRR 
There are three key routes to implement DRR: Build, Benchmark or Buy.

You can mix and match these depending on your internal systems and resources.

### Build (you run DRR yourself)
You take the open source DRR code and run it inside your own systems. This means you:
- Run the DRR rules on your own infrastructure
- Integrate DRR into your software lifecycle
- Convert your internal data into CDM format
- Use the DRR Test Pack to check your outputs

This option gives you the most control.

### Benchmark (you test your implementation using an execution engine like Rosetta)
You use the free Rosetta Community Edition (or another execution engine) to test your own reporting logic.
Rosetta lets you:
- Upload input data
- Run the DRR steps: Ingest → Enrich → Report → Project
- Compare your output with DRR’s expected output

This is great for testing, proofs of concept, or validating your own build. But it is **not** designed for production scale reporting – it can only accommodate limited volume and throughput. Also, the **Translate** and **Project** services only cover the formats that have been publicly developed and distributed in the CDM and DRR, not firms’ custom formats.

### Buy (you use a vendor solution)
You purchase a reporting solution from a third party vendor. Vendors may use DRR internally to power their products.


## 1. The DRR pipeline (what you need to implement)
DRR has four main steps. Each step has code and files you can use.

<br>

## 1.1 Translate
### Why
Convert your internal trade data into a **CDM transaction event**.

### What you get
- `Synonym`s (mapping files) that describe how to convert public data models into CDM.
- [supported public models](https://cdm.finos.org/docs/mapping).
- Synonyms apply to public data models only, **not** mappings for private, proprietary or firm specific models. Custom adaptations need these synonyms to be extended.

### Where to find it
All synonym files in the CDM distribution are in `.rune` format namespaces prefixed with `cdm.mapping.*`. For example: `cdm.mapping.synonym`.

### How to implement – 3 options
**1. If you use a public model**
- Write a code generator that turns synonyms into executable code. [Rune code generator guide](https://rune-docs.netlify.app/docs/rune-documentation/developers/code-generator).

**2. If you use a custom version of a public model**
- Extend the synonyms, then generate code.
- Or extend the generated code directly.
- [More about extending a synonym source](https://rune-docs.netlify.app/docs/rune-documentation/modelling-components/mapping)

**3. If you use a fully bespoke model**
- You’ll need to write your own translation logic from scratch.

**Benchmark option**
Rosetta can convert **public models only** into CDM using its [ingestion service](https://docs.rosetta-technology.io/rosetta/rosetta-products/4-api-export/#ingestion-service).

<br>

## 1.2 Enrich
### Why
- Add missing reference data e.g Legal Entity Identifiers (LEIs), Market Identifier Codes (MICs), static data, etc to the CDM event.
- DRR is flexible to allow for different internal and external data sources and how they’re implemented.

### What you get
- Enrichment functions marked `enrichment`. They take an object and return the same type of object.
- External API call definitions marked `external_api`. These can be used to create further attributes on the input object, with pre- and post-conditions to validate how those attributes are populated.
- The model doesn’t include the actual code that performs an API call. Instead, it defines the **inputs** the API should receive and the **output** it should return. These can then be used to write any required business logic e.g. simple checks to make sure the values are valid or consistent with the rest of the transaction.

### Where to find it
- Enrichment functions and external API call functions appear in the model’s `.rune` files, marked with `enrichment` and `external_api` so you can easily identify them. 
- These functions can be placed anywhere in the model – they don’t have to live in a specific namespace.

### How to implement – 2 options 
You can include the DRR Java code for enrichment and API call functions as a dependency in your project (using tools like Maven or Gradle). Or you can [download it directly from Rosetta](https://docs.rosetta-technology.io/rosetta/rosetta-products/1-workspace/#download-workspace). In either case:
- You write the actual logic for each enrichment function.
- You decide how to call your internal or external data sources.
- Pre  and post conditions help validate your enrichment.

### Benchmark option
Rosetta provides built in enrichment for common reference data such as:
- Legal Entity Identifier (from GLEIF)
- Market Identifier Code (from ISO)

However, implementations of the external API calls are not distributed with DRR as their logic is not defined in the model.


## 1.3 Transform
### Why
Turn the enriched CDM event into a **jurisdiction specific report object**.

### What you get
- Report definitions and reporting rules in `.rune` files
- Java libraries that generate report objects (e.g. `CFTCPart45TransactionReport`)
- These are stored under `drr.regulation.*`

### Where to find it
- Report and rule functions are in the `drr.regulation.*` namespaces and follow that naming pattern e.g. `drr.regulation.cftc.rewrite`.
- Code generated DRR rules (`reporting rule`) are aligned with Rune functions (`func`). This allows you to build your own execution engine, by providing a single way of using the CDM’s business logic as executable code.

This step explains how to **run the reporting rules** and produce a **CDM report object** (for example, a CFTC Part 45 Transaction Report).

You don’t need deep Java knowledge – the important idea is that the DRR distribution already contains **generated Java classes** that run the rules for you.

### How to implement
- Add the DRR Java dependency to your project.
- Use the generated Java classes to run the reporting logic.
- Provide a CDM input object (from Translate + Enrich).
- Call the generated report function.
- Tabulate the output into key value pairs.

### How to implement
**1.3.1 Add the DRR Java dependency**

You can either download the DRR Java code from the Rosetta platform or include it in your build using Maven:

```haskell
<dependency>
    <groupId> com.regnosys.drr </groupId>
    <artifactId> rosetta-source </artifactId>
    <version> LATEST </version>
</dependency>
```

You also need to add the ISDA Maven repository:

```haskell
<repository>
    <id> isda-maven </id>
    <url> https://europe-west1-maven.pkg.dev/production-208613/isda-maven </url>
    <releases>
        <enabled> true </enabled>
    </releases>
    <snapshots>
        <enabled> false </enabled>
    </snapshots>
</repository>
```

This gives you access to the **generated report classes**, such as:
- `CFTCPart45TransactionReport`
- `CFTCPart45ReportFunction`
- `CFTCPart45ReportTabulator`

These classes are created automatically from the DRR model – you don’t write them yourself.

**1.3.2. Prepare the reporting environment**

DRR uses a small setup step to load the reporting rules.
This line creates the module that wires everything together:

```haskell
this.injector = Guice.createInjector(new DrrRuntimeModuleExternalApi()); 

```

You don’t need to understand Guice — just know that this line “turns on” the DRR rules.

**1.3.3. Create or load a CDM input event**

The reporting function always takes a **CDM ReportableEvent** as input.
You can load one from JSON:

```haskell
ReportableEvent reportableEvent = ResourcesUtils.getObjectAndResolveReferences( ReportableEvent.class, "regulatory-reporting/input/events/New-Trade-01.json" ); 

```
This is usually the easiest approach for modellers.

**1.3.4. Build the `TransactionReportInstruction`**

Before running the report, you need to specify:
- The reporting party
- The counterparty

**Example:**

```haskell
final ReportingSide reportingSide = ReportingSide.builder()
    .setReportingParty(getCounterparty(reportableEvent, CounterpartyRoleEnum.PARTY_1))
    .setReportingCounterparty(getCounterparty(reportableEvent, CounterpartyRoleEnum.PARTY_2))
    .build();

final Create_TransactionReportInstruction createInstructionFunc =
    injector.getInstance(Create_TransactionReportInstruction.class);

final TransactionReportInstruction reportInstruction =
    createInstructionFunc.evaluate(reportableEvent, reportingSide);

```

This step simply prepares the input for the reporting rules.

**1.3.5. Run the reporting rules**

This is the key step: the DRR-generated function produces the report object.

```haskell

final CFTCPart45ReportFunction reportFunc =
    injector.getInstance(CFTCPart45ReportFunction.class);

final CFTCPart45TransactionReport report =
    reportFunc.evaluate(reportInstruction);

```

You now have the full **CDM report object**.

**1.3.6. Print the report as JSON (optional)**

```haskell
System.out.println( RosettaObjectMapper.getNewRosettaObjectMapper() .writerWithDefaultPrettyPrinter() .writeValueAsString(report) ); 
```

This is useful for testing and validation but is not essential.

**1.3.7. Convert the report into key–value pairs**

```haskell
Tabulators turn the report into a simple list of fields and values:

final CFTCPart45ReportTabulator tabulator =
    injector.getInstance(CFTCPart45ReportTabulator.class);

final List<Tabulator.FieldValue> tabulatedReport =
    tabulator.tabulate(report);
```
This is helpful for debugging or comparing against expected outputs.

**1.3.8. Full example**

```haskell
package com.regnosys.drr.examples;

import cdm.base.staticdata.party.CounterpartyRoleEnum;
import cdm.base.staticdata.party.metafields.ReferenceWithMetaParty;
import com.google.inject.Guice;
import com.google.inject.Injector;
import com.regnosys.drr.DrrRuntimeModuleExternalApi;
import com.regnosys.drr.examples.util.ResourcesUtils;
import com.regnosys.rosetta.common.serialisation.RosettaObjectMapper;
import com.rosetta.model.lib.reports.Tabulator;
import drr.regulation.cftc.rewrite.CFTCPart45TransactionReport;
import drr.regulation.cftc.rewrite.reports.CFTCPart45ReportFunction;
import drr.regulation.cftc.rewrite.reports.CFTCPart45ReportTabulator;
import drr.regulation.common.ReportableEvent;
import drr.regulation.common.ReportingSide;
import drr.regulation.common.TransactionReportInstruction;
import drr.regulation.common.functions.Create_TransactionReportInstruction;
import drr.regulation.common.functions.ExtractTradeCounterparty;

import java.io.IOException;
import java.util.List;

public class CFTCPart45ExampleReport {

  public static void main(String[] args) throws IOException {
      // 1. Deserialise a ReportableEvent JSON from the test pack
      ReportableEvent reportableEvent = ResourcesUtils.getObjectAndResolveReferences(ReportableEvent.class, "regulatory-reporting/input/events/New-Trade-01.json");

      // Run report
      CFTCPart45ExampleReport cftcPart45ExampleReport = new CFTCPart45ExampleReport();
      cftcPart45ExampleReport.runReport(reportableEvent);
  }

  private final Injector injector;

  CFTCPart45ExampleReport() {
      this.injector = Guice.createInjector(new DrrRuntimeModuleExternalApi());
  }

  void runReport(ReportableEvent reportableEvent) throws IOException {
      // TransactionReportInstruction from ReportableEvent and ReportingSide
      // For this example, arbitrarily PARTY_1 as the reporting party and PARTY_2 as the reporting counterparty
      final ReportingSide reportingSide = ReportingSide.builder()
              .setReportingParty(getCounterparty(reportableEvent, CounterpartyRoleEnum.PARTY_1))
              .setReportingCounterparty(getCounterparty(reportableEvent, CounterpartyRoleEnum.PARTY_2))
              .build();
      final Create_TransactionReportInstruction createInstructionFunc = injector.getInstance(Create_TransactionReportInstruction.class);
      final TransactionReportInstruction reportInstruction = createInstructionFunc.evaluate(reportableEvent, reportingSide);

      // Run the API to produce a CFTCPart45TransactionReport
      final CFTCPart45ReportFunction reportFunc = injector.getInstance(CFTCPart45ReportFunction.class);
      final CFTCPart45TransactionReport report = reportFunc.evaluate(reportInstruction);
      // Print
      System.out.println(RosettaObjectMapper.getNewRosettaObjectMapper()
              .writerWithDefaultPrettyPrinter()
              .writeValueAsString(report));

      // Get the API tabulator function
      final CFTCPart45ReportTabulator tabulator = injector.getInstance(CFTCPart45ReportTabulator.class);
      // Run the API to extract key value pairs from the report
      final List<Tabulator.FieldValue> tabulatedReport = tabulator.tabulate(report);
      // Print
      System.out.println(RosettaObjectMapper.getNewRosettaObjectMapper()
              .writerWithDefaultPrettyPrinter()
              .writeValueAsString(tabulatedReport));
  }

  private ReferenceWithMetaParty getCounterparty(ReportableEvent reportableEvent, CounterpartyRoleEnum party) {
      ExtractTradeCounterparty func = injector.getInstance(ExtractTradeCounterparty.class);
      return func.evaluate(reportableEvent, party).getPartyReference();
  }
}
```

**Note:** You can download this code is available as part of the DRR distribution. Go to the Downloads page and choose [Dev examples](https://drr.docs.rosetta-technology.io/source/download.html).

### Benchmark option
Rosetta lets you run Transform directly through the UI or API.

<br>

## 1.4 Project
### Why
Convert the CDM report object into the final message format required by the regulator or trade repository (e.g. ISO 20022 XML).

## Where to find it
The projection functions are included in the DRR distribution as `.rune` files. They live in the `drr.projection.*` namespaces and follow that naming pattern e.g. `drr.projection.iso20022.esma.emir.refit.trade`.

Each projection function has a matching generated Java class (e.g. `Project_EsmaEmirTradeReportToIso20022`). This one to one alignment ensures that the CDM’s projection logic can be executed consistently in any implementation.

### What you get
XML output for ISO 20022
In the previous step, the CDM report object was converted to JSON using:

```haskell
RosettaObjectMapper.getNewRosettaObjectMapper()
    .writerWithDefaultPrettyPrinter()
    .writeValueAsString(report);
```

However, ISO 20022 reports **must** be submitted as **XML**, not JSON.
To produce ISO 20022 compliant XML, you load the correct XML configuration file and serialise the ISO 20022 Document object like this:

```haskell
URL xmlConfig = Resources.getResource("xml-config/auth108-esma-rosetta-xml-config.json");
RosettaObjectMapperCreator
    .forXML(xmlConfig.openStream())
    .create()
    .writerWithDefaultPrettyPrinter()
    .writeValueAsString(document);
```

The file `auth108-esma-rosetta-xml-config.json` contains the metadata needed to ensure the XML output matches the ISO `auth.108.001.01.xsd` schema exactly.
It’s provided in this Maven artifact:

```haskell
<dependency>
    <groupId>org.iso20022</groupId>
    <artifactId>rosetta-source</artifactId>
    <version>LATEST</version>
</dependency>
```

**Note:** If you are serialising an `iso20022.auth030.esma.Document`, use the matching configuration file: `xml-config/auth030-esma-rosetta-xml-config.json`.

To access ISO 20022 artefacts, add the ISDA repository:
<repository>
    <id>isda-maven</id>
    <url>https://europe-west1-maven.pkg.dev/production-208613/isda-maven</url>
    <releases>
        <enabled>true</enabled>
    </releases>
    <snapshots>
        <enabled>false</enabled>
    </snapshots>
</repository>
```

**Note:** For CDM versions **before 4.0.0**, dependencies are split across two repositories. Add both:

```haskell
<repositories>
    <!-- remove references to REGnosys Jfrog -->
    <repository>
        <id>isda-maven</id>
        <url>https://europe-west1-maven.pkg.dev/production-208613/isda-maven</url>
        <releases>
            <enabled>true</enabled>
        </releases>
        <snapshots>
            <enabled>false</enabled>
        </snapshots>
    </repository>
    <repository>
        <id>public-maven</id>
        <url>https://europe-west1-maven.pkg.dev/production-208613/public-maven</url>
        <releases>
           <enabled>true</enabled>
        </releases>
        <snapshots>
            <enabled>false</enabled>
        </snapshots>
    </repository>
    <!-- existing contents -->
</repositories>
```


**Benchmark option**
To run the full reporting pipeline without building your own implementation, the Rosetta Platform provides a ready made [reporting service](https://docs.rosetta-technology.io/rosetta/rosetta-products/4-api-export/#regulation-report-service).


