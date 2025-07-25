# Yet Another Goddamn Spreadsheet Importing Library

Working name: "Curmudgeon's Spreadsheet Validator (CSV)"?

## Vision

I am a developer using this tool. I am building a product for which users need to be
able to upload tabular data into my platform.

I should be able to specify the shape of data I expect, and the tool will guide
my users through cleaning up the data until it looks like the shape I expect.
Examples include adding columns that don't exist or editing per-cell values.

### Guiding Principles

Subject to change, but not for debate.

#### Return rich types.

None of that "Here's a string, I promise it's a number". Use the damn type system.

#### Frontend only.

The tool should take no opinions on how callers handle its output.
Return the data directly and let them figure it out.

There will be limits on how much data a client can handle on the frontend.
That's fine.

#### Extensible.

I'm a develper using this tool. I have some domain-specific knowledge about how
my output data should look. I should have the building blocks to create the
rules I wish to express in a sane way.

#### Hackable.

I'm a developer using this tool. I found a bug? I should have the means to help
Perry fix it.

## How to use

That's the neat part, you don't.

This repo is an experiment wherein I will probably find out the hard way
why all the other existing tools are unsatisfactory to me.

In the unlikely event that I arrive at something useful, I will remove this message
and replace it with some instructions.

## Contributing

### Structure
`Importer.tsx` is the entry point. Each "step" is another component, see Mapper.tsx, Reviewer.tsx, etc.

### Dev commands
Start dev server:
`npm run dev`

Linting, formatting:
`npm run lint`
`npm run format`

### TODOs
My rough plan of attack:

2.7 Add a "proceed" button from the review page.
2.9 Add mechanism for adding required but non-mapped columns.
3. Handle optional values.
3.5 Add an "ignore rows with errors" option when proceeding.
5. Add Picklist support.
6. Improve styling.
   * One-click edits instead of double-click.
   * Errors shouldn't change cell height. (Popup, maybe?)
   * Highlight error cells?
10. Make this hackable. Callers should be able to override chunks.
