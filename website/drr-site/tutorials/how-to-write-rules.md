| title: | sidebar_label: | description: |
| ----------- | ----------- | ----------- |
| How to write rules | How to write rules | "Create your own functional rules in DRR." 





# How to write rules

This section explains the basic structure and good practices for writing regulatory rules in the DRR model. For full syntax details, refer to the [Rune DSL documentation](https://rune-docs.netlify.app/docs/rune-documentation/rune-dsl-modelling-components).

A rule must contain the following elements, in this order:

**1. Name and description**

**2. Regulatory reference** (optional in syntax, strongly recommended for auditability)

**3. Functional logic**

**4. Field name** (optional, used only for reporting rules)

**A complete example:**

```haskell
reporting rule FixingDateLeg1 <"Fixing date-Leg 1">
  [regulatoryReference CFTC Part45 appendix "1" dataElement "54" field "Fixing date - Leg 1"
    rationale "Only applies to fixing date of an exchange rate as per definition"
    rationale_author "DRR Peer Review Group - 23/11/21"
    provision "Describes the specific date when a non-deliverable forward as well as various types of FX OTC options such as cash-settled options that will 'fix' against a particular exchange rate, which will be used to compute the ultimate cash settlement"]
  TradeForEvent then
  (
    ProductForTrade then extract InterestRateLeg1( Product ) then extract InterestRatePayout -> settlementTerms
    ,
    ProductForTrade then extract Product -> contractualProduct -> economicTerms -> payout then
    (
      extract Payout -> optionPayout -> settlementTerms,
      extract Payout -> forwardPayout -> settlementTerms
    )
  ) then extract SettlementTerms -> cashSettlementTerms -> valuationDate -> fxFixingDate -> fxFixingDate -> adjustableDate -> unadjustedDate
  as "54 Fixing date-Leg 1"
```

<br>

## 1. Name and description
The **name** and **description** should match in meaning. Because the name must follow DSL syntax rules, it’s usually a shorter, code friendly version of the description. For reporting rules, the description should also match the **report field name**.

**Note:** Descriptions may look repetitive because all contextual information belongs in the **regulatory reference**, not the description.

<br>

## 2. Regulatory reference
The regulatory reference links the rule to the **exact part of the regulation** it implements. This is essential for auditability and traceability.

A regulatory reference includes:
- **Body** and **corpus** – identify the regulatory document
- **Segments** – point to the specific section (e.g. `appendix`, `dataElement`, `field`)
- **Provision** – the text from the regulation that the rule implements
- **Rationale (optional)** – clarifies interpretation choices when the regulation is ambiguous

The reference should be as precise as possible. Segments also act as an indexing system, allowing auditors or regulators to ask: “How does DRR implement provision X?” …and trace the answer directly to the rule and its executable logic. The rationale records any interpretation decisions made by the working group.

<br>

## 3. Functional logic
The functional logic is the **Rune DSL expression** that computes the rule’s output from its input.

Key points:
- The **input type** is implied by the first expression in the rule.
If the rule starts with extract, the input is the data type being extracted from.
If the rule starts by calling another rule, the input type is whatever that rule expects.
- The **output type** is implied by the final expression.

In the `FixingDateLeg1` example above, the input type is `ReportableEvent` because the rule begins by calling `TradeForEvent`, which itself takes a `ReportableEvent`.

Supporting rules:

```haskell
reporting rule TradeForEvent
  TradeStateForEvent then
  extract TradeState -> trade
  as "Trade"
```

```haskell
reporting rule TradeStateForEvent
  extract
    if ReportableEvent -> reportableTrade exists then
      ReportableEvent -> reportableTrade
    else if ReportableEvent -> originatingWorkflowStep -> businessEvent -> instruction exists
      then ReportableEvent -> originatingWorkflowStep -> businessEvent -> after
    else if ReportableEvent -> originatingWorkflowStep -> businessEvent -> primitives -> contractFormation -> after -> trade only exists
      then ReportableEvent -> originatingWorkflowStep -> businessEvent -> primitives -> contractFormation -> after
    else if ReportableEvent -> originatingWorkflowStep -> businessEvent -> primitives -> quantityChange -> after -> trade  exists
      then ReportableEvent -> originatingWorkflowStep -> businessEvent -> primitives -> quantityChange -> after
    else if ReportableEvent -> originatingWorkflowStep -> businessEvent -> primitives -> execution -> after -> trade  exists
      then ReportableEvent -> originatingWorkflowStep -> businessEvent -> primitives -> execution -> after
    else ReportableEvent -> originatingWorkflowStep -> businessEvent -> primitives -> contractFormation -> after
  as "TradeState"
```

**Note:** `FixingDateLeg1` must use `ReportableEvent` as its input because it’s a field rule referenced directly in the report’s data type.

<br>

### 3.1. Critical Data Elements
**Critical Data Elements (CDE)** are recommendations published by the CPMI–IOSCO working group to harmonise OTC derivatives reporting across the G20. They define the key attributes that should appear in every derivatives report and how those attributes should be interpreted. 

DRR implements much of the logic **once** in a shared CDE namespace, and each regulation simply **reuses** that logic.

The example below shows how this works for the field `Counterparty 1 (reporting counterparty)`:
- The core extraction logic is defined once as a CDE rule in `drr.standards.iosco.cde`.
- CFTC and EMIR rules then call that shared rule, but each provides its own regulatory reference.

```haskell
reporting rule CDECounterparty1 <"Counterparty 1 (reporting counterparty)">
  [regulatoryReference CPMI_IOSCO CDE section "2" field "6"
    provision "Identifier of the counterparty to an OTC derivative transaction who is fulfilling its reporting obligation via the report in question. In jurisdictions where both parties must report the transaction, the identifier of Counterparty 1 always identifies the reporting counterparty. In the case of an allocated derivative transaction executed by a fund manager on behalf of a fund, the fund and not the fund manager is reported as the counterparty."]
  TradeForEvent then
    extract Trade -> contractDetails -> partyContractInformation -> relatedParty then
    filter when RelatedParty -> role = PartyRoleEnum -> ReportingParty then
    filter when RelatedParty -> partyReference -> partyId -> scheme contains "http://www.fpml.org/coding-scheme/external/iso17442" then
    extract RelatedParty -> partyReference -> partyId
```

```haskell
reporting rule Counterparty1 <"Counterparty 1 (reporting counterparty)">
  [regulatoryReference CFTC Part45 appendix "1" dataElement "13" field "Counterparty 1 (reporting counterparty)"
    provision "Identifier of the counterparty to an OTC derivative transaction who is fulfilling its reporting obligation via the report in question. In jurisdictions where both parties must report the transaction, the identifier of Counterparty 1 always identifies the reporting counterparty. In the case of an allocated derivative transaction executed by a fund manager on behalf of a fund, the fund, and not the fund manager is reported as the counterparty."]
  CDECounterparty1
  as "13 Counterparty 1"
```

```haskell
reporting rule Counterparty1 <"Counterparty 1 (reporting counterparty)">
  [regulatoryReference ESMA EMIR Refit table "1" field "4"
    provision "Identifier of the counterparty to a derivative transaction who is fulfilling its reporting obligation via the report in question. In the case of an allocated derivative transaction executed by a fund manager on behalf of a fund, the fund and not the fund manager is reported as the counterparty."]
  CDECounterparty1
  as "1.4 Counterparty 1 (reporting counterparty)"
```

**Note:** The wording of the provision is usually identical between CDE and the regulations that adopt it, but the **indexing** (segments) differs because each regulation structures its documents differently.

<br>

### 3.2. Fields for different legs
Many swaps have two legs, and several reportable fields must be provided separately for Leg 1 and Leg 2.
The CDE specification does not define how to determine which leg is “1” and which is “2”.

To handle this:
- DRR implements the CDE logic at the leg level.
- Each regulation’s rule first determines the correct leg.
- The regulation then applies the appropriate CDE logic to that leg.

Below is the CFTC example for `Notional Amount – Leg 1`. The same pattern applies to Leg 2.

```haskell
reporting rule NotionalAmountLeg1 <"Notional Amount Leg 1">
[regulatoryReference CFTC Part45 appendix "1" dataElement "31" field "Notional Amount"
  provision "For each leg of the transaction, where applicable:
    - for OTC derivative transactions negotiated in monetary amounts, amount specified in the contract.
    - for OTC derivative transactions negotiated in non-monetary amounts, refer to appendix B for converting notional amounts for non-monetary amounts.
    In addition:
    - For OTC derivative transactions with a notional amount schedule, the initial notional amount, agreed by the counterparties at the inception of the transaction, is reported in this data element.
    - For OTC foreign exchange options, in addition to this data element, the amounts are reported using the data elements Call amount and Put amount.
    - For amendments or lifecycle events, the resulting outstanding notional amount is reported; (steps in notional amount schedules are not considered to be amendments or lifecycle events);
    - Where the notional amount is not known when a new transaction is reported, the notional amount is updated as it becomes available."]
  TradeForEvent then
  (
    CDENotional
    as "31 Notional amount-Leg 1"
    ,
    ProductForTrade then
      extract
        if IsSwaption( Product ) then
          InterestRateLeg1( UnderlierForProduct( Product )  )
        else
          InterestRateLeg1( Product )
        then
          CDEInterestRateNotional
        as "31 Notional amount-Leg 1"
      ,
      extract FXLeg1( Trade ) then
      extract Cashflow -> payoutQuantity -> resolvedQuantity then
      CDEFXNotional
      as "31 Notional amount-Leg 1"
    ,
    ProductForTrade then
      extract CommodityLeg1( Product ) then
      CDECommodityNotional
      as "31 Notional amount-Leg 1"
  )
```

<br>

### 3.3. Leg determination logic
The leg determination logic itself is the object of industry best practice, illustrated below for `InterestRateLeg1`. In this case, the corpus referenced is not the regulation but the best practice guide, when published. 

```haskell
func InterestRateLeg1:
  [regulatoryReference ISDA EMIRReportingBestPractice
    table "ESMA reporting best practices matrix March 2020" provision "Best Practice For Leg 1 / Leg 2 Determination and population of Counterparty Side for EMIR RTS 2.0"]
  inputs: product Product (1..1)
  output: interestRateLeg1 InterestRatePayout (0..1)
  set interestRateLeg1:
    if IsInterestRateFixedFloatSingleCurrency( product ) then
      InterestRateLeg1FixedFloatSingleCurrency( product )
    else if IsInterestRateCrossCurrency( product ) then
      InterestRateLeg1CrossCurrency( product )
    else if IsInterestRateFixedFixed( product ) then
      InterestRateLeg1FixedFixed( product )
    else if IsInterestRateBasis( product ) then
      InterestRateLeg1Basis( product )
    else if IsCapFloor( product ) then
      InterestRateLeg1CapFloor( product )
```

**Note:** DRR captures this logic in functions (not rules), because they’re reusable and not tied to a specific report field. Functions use slightly different syntax from rules, but they can still carry regulatory references and can be invoked inside rules.

<br>

## 4. Field name (optional)
The **field name** is the string after the as keyword at the end of a rule. It should match the field name in the regulation, usually including the field number e.g. `54 Fixing date-Leg1`.
Implementations can use this string to label or annotate the reported output.

