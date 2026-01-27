| title: | sidebar_label: | description: |
| ----------- | ----------- | ----------- |
| DRR design principles | HDRR design principles | "The fundamentals of DRR." 



# DRR design principles

The DRR model extends the Common Domain Model (CDM), so it follows the same core ideas of clear logic and reusable components, but also adds transparent links back to regulatory text. For regulatory reporting, these ideas translate into four key principles:
- Functional
- Composable and reusable
- Auditable
- Test driven

<br> 

## 1. Functional
The DRR model contains **all the logic needed** to go from a CDM event to a complete regulatory report. Nothing is hidden or left for implementors to “fill in” – if you use the generated code, the reporting logic is already there.

This ensures that **the same inputs always produce the same outputs**, regardless of the firm implementing it.

**Example rule:**

```haskell
extract
  if Qualify_Novation(BusinessEvent) = True or Qualify_PartialNovation(BusinessEvent) = True then "NOVA"
  else if Qualify_Termination(BusinessEvent) = True then "ETRM"
  else if Qualify_ClearedTrade(BusinessEvent) = True then "CLRG"
  else if Qualify_Allocation(BusinessEvent) = True or Qualify_Reallocation(BusinessEvent) = True then "ALOC"
  else if Qualify_Compression(BusinessEvent) = True then "COMP"
  else if Qualify_Exercise(BusinessEvent) = True then "EXER"
  else if Qualify_StockSplit(BusinessEvent) = True then "CORP"
  else if
    Qualify_ContractFormation(BusinessEvent) = True
    or Qualify_PartialTermination(BusinessEvent) = True
    or Qualify_Increase (BusinessEvent) = True
    or Qualify_Renegotiation (BusinessEvent) = True
    or Qualify_IndexTransition(BusinessEvent) = True
    or Qualify_FullReturn(BusinessEvent) = True
    or BusinessEvent -> instruction -> primitiveInstruction -> quantityChange exists
      then "TRAD"
  else if
    Qualify_CashTransfer(BusinessEvent) = True
    or Qualify_CashAndSecurityTransfer(BusinessEvent) = True
    or Qualify_MultipleTransfers(BusinessEvent) = True
    or Qualify_SecurityTransfer(BusinessEvent) = True
      then "PTNG"
  else "ToDo"
  as "27 Event type"
```

<br> 

## 2. Composable and reusable
The model avoids repeating logic. Instead, it defines **small reusable rules** that can be combined to build more complex ones.

For example:

- `TradeForEvent` extracts the trade from a transaction event
- `ProductForTrade` extracts the product from the trade

These can be chained:

`TradeForEvent` then `ProductForTrade`

Or used separately when only part of the information is needed:

`TradeForEvent` then extract `Trade` -> `contractDetails` -> `partyContractInformation` -> `relatedParty`

This keeps the model clean, consistent, and easier to maintain.

<br> 

## 3. Auditable
Every rule can be linked directly back to the **regulatory text** it comes from. This is done using the Rune DSL’s `regulatoryReference` metadata, which stores:
- The regulation
- The exact section or table
- The text of the provision
- Optional rationale from working group discussions

This makes the model traceable and defensible for audits. This metadata is implemented in DRR using the [**Rune DSL’s document reference feature**]( https://rune-docs.netlify.app/docs/rune-documentation/modelling-components/metadata#2-document-reference).

**Example:**

```haskell
reporting rule ActionType <"Action Type">
  [regulatoryReference CFTC Part45 appendix "1" dataElement "26" field "Action Type"
    provision "Type of action taken on the swap transaction or type of end-of-day reporting. Actions may include, but are not limited to, new, modify, correct, error, terminate, revive, transfer out, valuation, and collateral..."]
```

Rationales can also be added when the regulation needs clarification:

```haskell
[regulatoryReference CFTC Part45 appendix "1" dataElement "22" field "Submitter Identifier"
  rationale "Check whether trade is executed in a SEF first. If it is, SEF is obliged to be the Submitter. Then check for Reporting Party and Data Submitter."
  rationale_author "DRR Peer Review Group - 09/03/22"
  provision "Identifier of the entity submitting the data to the swap data repository (SDR). The Submitter identifier will be the same as the reporting counterparty or swap execution facility (SEF), unless they use a third-party service provider to submit the data to SDR in which case, report the identifier of the third-party service provider."]
```

<br> 

## Test driven
Every rule in DRR must be validated using **synthetic test data** that represents real world scenarios. A rule is considered complete only when:
- It produces the expected output.
- Across all relevant test cases.
- For all applicable asset classes.

Those data are organised around themes and grouped into **test packs** in the DRR model repository – for instance, by asset class. These test packs are part of the model and allow firms to benchmark their own implementations.

If a change breaks an expected result, the build fails – ensuring strong governance and preventing regressions.



