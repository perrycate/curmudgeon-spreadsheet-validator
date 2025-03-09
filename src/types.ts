export type ColumnKey = string

export type RowTemplate = {
  [key: ColumnKey]: ColumnTemplate<any>
}

export type ColumnTemplate<Type> = {
  // If set, the importer will use this as the human-readable label for
  // this column.
  label?: string

  // If set, this text will be added as a description for the given column.
  description?: string

  // If true, users will be forced to map a column in the input file to this column.
  //
  // This is not the same as required vs optional - those pertain to the data returned
  // at the end of the proces. A column that is required but is not mapped will be added
  // after the mapping phase, and the user will be prompted to fill it out for each row.
  mustBeMapped?: boolean

  // Extracts the given type from a raw string value.
  parse: (cellValue: string) => Parsed<Type> | ParseError

  // Probably a bunch of optional hooks here for things like checking
  // the data looks a certain way and prompting the user if it doesn't.
  //
  // I'm imagining a world where users can create their own novel types
  // and specify the functions necessary to parse an input string into
  // that type.
}

export type Parsed<Type> = {
  status: 'ok'

  // The parsed value of the cell.
  //
  // This is the value passed to the caller at the end of the import process.
  value: Type

  // The value that should be shown to the user.
  // If unset, the value will be directly cast as a string.
  displayValue?: string
}

export type ParseError = {
  status: 'error'

  // The error that should be shown to the user.
  message: string
}

type OptionalColumn<T> = ColumnTemplate<T> & { optional: true }

// Unwraps the type that should be returned from a column template.
export type Result<T, C extends ColumnTemplate<T>> = C extends OptionalColumn<T> ? T | null : T

// ReturnedRow unwraps each column type in a RowTemplate.
//
// In other words, this describes the type the caller should expect to recieve
// at the end of an import operation, for some row template.
export type ReturnedRow<T extends RowTemplate> = {
  readonly [Property in keyof T]: T[Property] extends ColumnTemplate<infer ReturnType> ? Result<ReturnType, T[Property]> : never
}

export function makeOptional<T>(c: ColumnTemplate<T>): OptionalColumn<T> {
  return {
    ...c,
    optional: true as const
  }
}

// Idea for later: Rather than all these helper functions, can we construct the template using react?

export function stringColumn(c: Omit<ColumnTemplate<string>, "parse">): ColumnTemplate<string> {
  return {
    ...c,
    // Strings get passed through directly.
    parse: (s) => ({status: 'ok', value: s})
  }
}

export function dateColumn(c: Omit<ColumnTemplate<Date>, "parse">): ColumnTemplate<Date> {
  return {
    ...c,
    // TODO datejs probably.
    parse: (s) => ({status: 'ok', value: new Date(s)}),
  }
}

export function numberColumn(c: Omit<ColumnTemplate<number>, "parse">): ColumnTemplate<number> {
  return {
    ...c,
    // TODO error handling etc.
    // Probably a parsing library to handle all the edge cases, too.
    parse: (s) => ({status: 'ok', value: parseFloat(s)}),
  }
}

// Examples / thinking out loud:

/*
// Let's say a caller defines a template as such:
const myTemplate = {
  description: makeOptional(stringColumn({})),
  startDate: dateColumn({}),
  quantity: numberColumn({}),
}

// These are the args we'd pass into our importer react component.
const _: ImporterProps<typeof myTemplate> = {
  columns: myTemplate,
  onSuccess: (rows) => {
    rows.map(r => {
      console.log(r.description) // r.description is a string | null!
      console.log(r.quantity * 10) // r.quantity is a number!
      console.log(r.startDate)
      // And so forth...
    })
  }
}
*/
