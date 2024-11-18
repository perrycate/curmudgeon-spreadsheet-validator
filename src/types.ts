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

  // If true, the returned value for this column will be nullable.
  // TODO: Make ReturnedRow type optional if this is true.
  isOptional?: boolean

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

type MaybeOptionalVal<T, C extends Column<T>> = C extends OptionalColumn<T> ? T | null : T

// ReturnedRow "unwraps" each column type in a RowTemplate.
export type ReturnedRow<T extends RowTemplate> = {
  readonly [Property in keyof T]: T[Property] extends OptionalColumn<infer ReturnType> ? ReturnType | null : (T[Property] extends RequiredColumn<infer ReturnType> ? ReturnType : never)
}

type OptionalColumn<T> = Column<T> & {isOptional: true}

type RequiredColumn<T> = (Column<T> & {isOptional: undefined | null | false}) | Omit<Column<T>, 'isOptional'>

const requiredColumn: RequiredColumn<number> = {
    parse: (_: string) => 42
}

// Let's say a caller defines a template as such:
const myTemplate = {
  description: {
    isOptional: true as const,
    parse: (_: string) => "test"
  },
  startDate: {
    parse: (_: string) => new Date()
  },
  quantity: requiredColumn,
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
      console.log(r.description) // r.description is a string!
      console.log(r.quantity * 10) // r.quantity is a number!
      console.log(r.startDate)
      // And so forth...
    })
  }
}

function test<T>(c: Column<T>) {
  if (c.isOptional) {
    if (Math.random() < 0.5) {
      return c.parse("test")
    }
    return null
  }

  return c.parse("test")
}
