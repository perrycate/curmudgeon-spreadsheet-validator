import { ColumnTemplate, dateColumn, makeOptional, numberColumn, RowTemplate, stringColumn } from "../types";

type Result<Type> = {
  status: 'ok'

  // The parsed value of the cell.
  value: Type

  // The value that should be shown to the user.
  displayValue: string
} | {
  status: 'error'

  // The error that should be shown to the user.
  message: string
}


type RowResult<RT extends RowTemplate> = {
  readonly [Column in keyof RT]: RT[Column] extends ColumnTemplate<infer CellValue> ? Result<CellValue> : never
}


export function parseRow<RT extends RowTemplate>(
  row: Record<string, string>,
  template: RT,
): RowResult<RT> {
  const keys = Object.keys(template)

  const entries = keys.map(k => {
    return [k, template[k].parse(row[k])]
  })

  return Object.fromEntries(entries)
}

const myTemplate = {
  description: makeOptional(stringColumn({})),
  startDate: dateColumn({}),
  quantity: numberColumn({}),
}

// Holy shit it works.
const a = parseRow({}, myTemplate)
a.description.status
if (a.description.status == "ok") {
  // Note the inferred type hints.
  console.log(a.description.value)
} else {
  console.log(a.description.message)
}
