// This will be moved around once we start actually building something,
// I'm just jotting down the types as a guiding inspiration.

// Caller writes:
type MyOutputRow = {
  description: string
  startDate: Date
  quantity: number
}

// Library types:
interface RowTemplate {
  [key: string]: Column<any>
}

type Column<Type> = {
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

// Properties for our react object.
type ImporterProps<T extends RowTemplate> = {
  rowFormat: T

  // Called once the input has been validated.
  onSuccess: (rows: ReturnedRow<T>[]) => void
}

// ---------Just testing---------.

const myTemplate = {
  description: {} as Column<string>,
  startDate: {} as Column<Date>,
  quantity: {} as Column<number>,
}

function parse<Template extends RowTemplate>(template: Template): ReturnedRow<Template> {
  throw "unimplemented"
}

// Holy shit it works.
const test = parse(myTemplate)
test.description
test.aou

myTemplate.aoeu

const wat = {}
