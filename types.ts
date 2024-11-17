// This will be moved around once we start actually building something,
// I'm just jotting down the types as a guiding inspiration.


export type ImporterProps<T extends RowTemplate> = {
  rowFormat: T

  // Called once the input has been validated.
  onSuccess: (rows: ReturnedRow<T>[]) => void
}

type RowTemplate = {
  [key: string]: Column<any>
}

export type Column<Type> = {
  // Probably a bunch of optional hooks here for things like checking
  // the data looks a certain way and prompting the user if it doesn't.
  //
  // I'm imagining a world where users can create their own novel types
  // and specify the functions necessary to parse an input string into
  // that type.
  //
  // (Obviously we'll need error handling etc, this is just to shut the compiler up re: unused types.)
  parse?: (cellValue: string) => Type
}

// ReturnedRow "unwraps" each column type in a RowTemplate.
type ReturnedRow<T extends RowTemplate> = {
  [Property in keyof T]: T[Property] extends Column<infer ReturnType> ? ReturnType : never
}

// A function matching this type signature will exist somewhere in the bowels of this library.
function parse<Template extends RowTemplate>(template: Template): ReturnedRow<Template> {
  throw "unimplemented"
}

// ---------- Examples / Playground ----------.

// Let's say a caller defines a template as such:
const myTemplate = {
  description: {} as Column<string>,
  startDate: {} as Column<Date>,
  quantity: {} as Column<number>,
}

// These are the args we'd pass into our importer react component.
const myImporterArgs: ImporterProps<typeof myTemplate> = {
  rowFormat: {
    description: {} as Column<string>,
    startDate: {} as Column<Date>,
    quantity: {} as Column<number>,
  },

  onSuccess: (rows) => {
    rows.map(r => {
      console.log(r.description) // r.description is a string!
      console.log(r.quantity * 10) // r.quantity is a number!
      // And so forth...
    })
  }
}

// I think (hope?) in practice the caller wouldn't need to explicitly define the
// importer props type if they're just passing it into the react importer.
// It's just that the react importer doesn't exist yet. Uh, TODO.
