export type RowTemplate = {
  // Note: To mark a column as "optional", make the type "| null".
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
  parse?: (cellValue: string) => Type
}

// ReturnedRow "unwraps" each column type in a RowTemplate.
export type ReturnedRow<T extends RowTemplate> = {
  readonly [Property in keyof T]: T[Property] extends Column<infer ReturnType> ? ReturnType : never
}
