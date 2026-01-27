| title: | sidebar_label: | description: |
| ----------- | ----------- | ----------- |
| How to write rules | How to write rules | "Create your own functional rules in DRR." 





# How to write rules

This section explains the basic structure and good practices for writing regulatory rules in the DRR model. For full syntax details, refer to the [Rune DSL documentation](https://rune-docs.netlify.app/docs/rune-documentation/rune-dsl-modelling-components).

A rule must contain the following elements, in this order:

**1. Name and description**

**2. Functional logic**


<br>

**A complete example:**

```haskell
reporting rule BasketConstituents from TransactionReportInstructionBase: <"Basket constituents">
    extract TradeForEvent
    then extract basket.GetBasketConstituents
```

<br>

## 1. Name and description
The **name** and **description** should match in meaning. For reporting rules, the description should match the **report field name**.

**Note:** Descriptions may look repetitive because all contextual information belongs in the **regulatory reference**, not the description.

<br>

## 2. Functional logic
The functional logic is the **Rune DSL expression** that computes the rule’s output from its input.

Key points:
- The **input type** is implied by the first expression in the rule i.e. `from TransactionReportInstruction`.
- If the rule starts with extract, the input (implied by the first expression in the rule) is the data type that is being extracted from.
- If the rule starts by calling another rule, the input type is whatever that rule expects.
- The **output type** is implied by the final expression.

In the `BasketConstituents` example above, the input type is `TransactionReportInstructionBase` and the rule begins by calling `TradeForEvent`, which itself takes a `ReportableEventBase`.

Supporting functions:

```haskell
func TradeForEvent:
    inputs:
        reportableEvent ReportableEventBase (1..1)
    output:
        reportableTrade Trade (0..1)
    set reportableTrade: TradeStateForEvent(reportableEvent) -> trade
```

```haskell
func TradeStateForEvent:
    inputs:
        reportableEvent ReportableEventBase (1..1)
    output:
        reportableTradeState TradeState (0..1)
    set reportableTradeState:
        if reportableEvent -> reportableTrade exists
        then reportableEvent -> reportableTrade
        else reportableEvent -> originatingWorkflowStep -> businessEvent -> after only-element
```

**Note:** `BasketConstituents` must use `ReportableEventBase` as its input because it’s a field rule referenced directly in the report’s data type.

<br>

### 2.1. Critical Data Elements
**Critical Data Elements (CDE)** are recommendations published by the CPMI–IOSCO working group to harmonise OTC derivatives reporting across the G20. They define the key attributes that should appear in every derivatives report and how those attributes should be interpreted. 

DRR implements much of the logic **once** in a shared CDE namespace, and each regulation simply **reuses** that logic.

The example below shows how this works for the field "Put Amount":
- The core extraction logic is defined once as a CDE rule in `drr.standards.iosco.cde`.
- Each jurisdiction then calls that shared rule, but each provides its own regulatory reference.

```haskell
reporting rule PutAmount from TransactionReportInstructionBase: <"Put Amount">
    [regulatoryReference CPMI_IOSCO cdeV3.CDE section "2" field "73"
        provision "For foreign exchange options, the monetary amount that the option gives the right to sell."]
    [regulatoryReference ISDA ISDAWorkingGroup date "20210728" // REGnosys
        provision "The Call Amount can be determined as the currency amount being received by the buyer of the option"]
    extract cdeV2.quantity.PutAmount
```

```haskell
reporting rule PutAmount from TransactionReportInstruction: <"Put Amount">
    filter IsAllowableActionForCFTC
    then extract cde.quantity.PutAmount
```

**Note:** The wording of the provision is usually identical between CDE and the regulations that adopt it, but the **indexing** (segments) differs because each regulation structures its documents differently.

<br>

### 2.2. Fields for different legs
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

### 2.3. Leg determination logic
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



