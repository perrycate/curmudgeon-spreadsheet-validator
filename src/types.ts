export type RowTemplate = {
  [key: string]: Column<any>
}

export type Column<Type> = {
  // If set, the importer will use this as the human-readable label for
  // this column.
  label?: string

  // If set, this text will be added as a description for the given column.
  description?: string

  // If true, users will be forced to map a column in the input file to this column.
  mustBeMapped?: boolean

  // Probably a bunch of optional hooks here for things like checking
  // the data looks a certain way and prompting the user if it doesn't.
  //
  // I'm imagining a world where users can create their own novel types
  // and specify the functions necessary to parse an input string into
  // that type.
  //
  // (Obviously we'll need error handling etc, this is just to shut the compiler up re: unused types.)
  parse: (cellValue: string) => Type
}

type OptionalColumn<T> = Column<T> & {optional: true}

type GetValType<T, C extends Column<T>> = C extends OptionalColumn<T> ? T | null : T

// ReturnedRow "unwraps" each column type in a RowTemplate.
export type ReturnedRow<T extends RowTemplate> = {
  readonly [Property in keyof T]: T[Property] extends Column<infer ReturnType> ? GetValType<ReturnType, T[Property]> : never
}

export function makeOptional<T>(c: Column<T>): OptionalColumn<T> {
  return {
    ...c,
    optional: true as const
  }
}

// Idea for later: Rather than all these helper functions, can we construct the template using react?

export function stringColumn(c: Omit<Column<string>, "parse">): Column<string> {
  return {
    ...c,
    // Strings get passed through directly.
    parse: (s) => s
  }
}

export function dateColumn(c: Omit<Column<Date>, "parse">): Column<Date> {
  return {
    ...c,
    // TODO datejs probably.
    parse: (s) => new Date(s),
  }
}

export function numberColumn(c: Omit<Column<number>, "parse">): Column<number> {
  return {
    ...c,
    // TODO error handling etc.
    // Probably a library to handle all the edge cases, too.
    parse: (s) => parseFloat(s)
  }
}

// Examples / thinking out loud:

// Let's say a caller defines a template as such:
const myTemplate = {
  description: makeOptional({
    parse: (val: string) => val
  }),
  startDate: {
    parse: (_: string) => new Date()
  },
  quantity: {
    parse: (val: string) => Number.parseFloat(val)
  },
}

export type ImporterProps<T extends RowTemplate> = {
  rowFormat: T

  // Called once the input has been validated.
  onSuccess: (rows: ReturnedRow<T>[]) => void
}

// These are the args we'd pass into our importer react component.
const myImporterArgs: ImporterProps<typeof myTemplate> = {
  rowFormat: myTemplate,
  onSuccess: (rows) => {
    rows.map(r => {
      console.log(r.description) // r.description is a string | null!
      console.log(r.quantity * 10) // r.quantity is a number!
      console.log(r.startDate)
      // And so forth...
    })
  }
}
