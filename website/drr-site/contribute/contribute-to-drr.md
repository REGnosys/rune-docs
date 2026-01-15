| title: | sidebar_label: | description: |
| ----------- | ----------- | ----------- |
| Contribute to DRR | Contribute to DRR | "How you can contribute to DRR." 




# Contributing to DRR

DRR is an open source project built by the industry, for the industry. Anyone can contribute – whether you’re fixing a bug, improving a rule, updating documentation, or helping with release notes. This guide explains, in simple terms, how you can get involved and why your contributions matter.

<br>

### Benefits of contributing 
**1. Improve the industry standard:** DRR is used across banks, vendors and regulators. Your contribution helps improve the shared logic everyone relies on.

**2. Build your expertise:** Working on DRR gives you hands on experience with:
- CDM
- Regulatory reporting logic
- Open source governance
- Real world financial data models

This is valuable experience for any developer or modeller working in finance or regtech.

**3. Help others understand the rules:** Clear release notes, examples and documentation make DRR easier for everyone – especially new contributors.

**4. Shape the future of regulatory reporting:** DRR is becoming the industry’s shared source of truth. Contributing means you’re helping to define how reporting works across jurisdictions.

You don’t need deep CDM or DRR expertise to make meaningful contributions. Here are the main areas where developers and modellers can help:

<br>

## 1. Release notes
Release notes explain what changed in each DRR release. They help users understand updates quickly and track how the model evolves.
You can contribute by:
- Writing clear summaries of changes
- Describing updates to rules, mappings, or documentation
- Showing before/after examples when something changes
- Explaining why a change was made

Release notes are written in Markdown, a simple formatting language. If you know how to write # headings and * bullets, you’re ready. If you’re not sure, take a look at this [**Markdown cheat sheet**](https://www.markdownguide.org/cheat-sheet/).

If you’re offering contributions via Rosetta, you can download this [**DRR Release Notes Template**](https://drr.docs.rosetta-technology.io/_downloads/bc7192ca70ae16929a2c4b392aad97ca/DRR-release-notes-template.md)

For additional background on governance and contribution processes you can also refer to the [**CDM Development Guidelines**](https://cdm.finos.org/docs/dev-guidelines/). 

### 1.1 Tips for writing release notes 
When you write release notes in Markdown, include:
- A short headline e.g. **# DRR EMIR Refit – Clearing threshold update**
- A clear explanation of what changed
- Before/after examples if relevant
- A short justification (why the change was needed)
- Directions for reviewers (where to look in the execution engine e.g. Rosetta)

**Additional tips**

Use:
- Correct grammar (e.g. complete sentences with full stops)
- Consistent terminology (e.g. if you define ‘agreement specification details’ do not refer later to ‘agreement content’)
- Bullets for lists
- Third person terminology (e.g. ‘the CDM model provides…’, not ‘we provide…’) 

Markdown basics you’ll use:
- `#` for headings
- `-` for bullets
- `** **` for **bold** (use sparingly)
- `` ` ` `` back tick 'code quotes' for rule names, attributes, or functions

<br>

**Example:** Release note for EMIR refit
```haskell
# **DRR EMIR refit - Rule model updates**

_Background_

The existing implementation for the EMIR Refit rules that are fully or partially aligned with the CDE and CFTC jurisdictions has been reviewed and updated to match the latest CFTC version using common functions.

_What is being released?_

This second release fixes various issues identified in the EMIR Refit rules listed below:

1. EMIR 2.1 - `UTI`:
  -    Replaced the filter based on the deprecated FpML's coding scheme unique-transaction-identifier by the CDM `identifierType`.
  -    Removed the filter to the last UTI version.

2. EMIR 1.2 - `Report Submitting Entity ID`:
  - Changed the `SupervisoryBodyEnum` value to `ESMA`.

_Review directions_

In Rosetta, select the Textual View and search for the released rules.

In Rosetta, open the reports tab, select the report `ESMA / EMIR Refit` and the dataset `Credit` and review the expectations for the field `2.1 - UTI` in the sample Credit-Swaption-Single-Name-ex01.

In Rosetta, open the reports tab, select the report `ESMA / EMIR Refit` and the dataset `Rates` and review the expectations for the field `1.2 - Report Submitting Entity ID` in the sample IR-Option-Swaption-ex01-Bermuda.
```

**Example:** Code snippets

Code snippets should be preceded by the string: `.. code-block:: Language` (where the Language could be any of Haskell, Java, JSON, etc.), followed by a line spacing before the snippet itself.

So a code snippet that reads:
```haskell
.. code-block:: Haskell

 type Party:
   [metadata key]
   partyId PartyIdentifier (1..*)
   name string (0..1)
     [metadata scheme]
   businessUnit BusinessUnit (0..*)
   person NaturalPerson (0..*)
   personRole NaturalPersonRole (0..*)
   account Account (0..1)
   contactInformation ContactInformation (0..1)
```

Will be rendered as:
```haskell
type Party:
  [metadata key]
  partyId PartyIdentifier (1..*)
  name string (0..1)
    [metadata scheme]
  businessUnit BusinessUnit (0..*)
  person NaturalPerson (0..*)
  personRole NaturalPersonRole (0..*)
  account Account (0..1)
  contactInformation ContactInformation (0..1)
```

**Note:** Code snippets that appear in the user documentation are being compared against actual CDM components and any mismatch will trigger an error in the build. This ensures that the user documentation is kept in sync with the model in production before any release.

<br>

## 2. Reporting rules and mapping rules
If you’re comfortable reading DRR logic, you can help improve:
- Reporting rules
- Validation rules
- Mapping logic
- Example datasets

Your contribution might include:
- Fixing an incorrect rule
- Updating logic to match new regulatory guidance
- Improving examples so they’re easier to understand

When describing rule changes, be explicit about:
- What changed
- Which examples were affected
- What the new expected output is

<br>

## 3. How to contribute (step by step)
### 3.1. Make your change
This could be:
- Editing a Markdown file
- Updating a rule
- Fixing an example
- Writing release notes

### 3.2. Explain your change
Every contribution should include:
- What changed
- Why it changed
- Where the change appears (e.g. file, rule, example)

### 3.3. Submit your contribution
You can contribute through the normal open source workflow in the GitHub repository:
- Fork the repository
- Make your changes
- Submit a pull request

A reviewer will look at your update, ask questions if needed, and help you get it merged.





