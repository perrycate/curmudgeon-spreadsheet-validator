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

function makeOptional<T>(c: Column<T>): OptionalColumn<T> {
  return {
    ...c,
    optional: true as const
  }
}

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
