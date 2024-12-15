import { ColumnTemplate, RowTemplate } from "../types";

type CSVTemplate = {
  columns: CSVTemplateColumn[];
}

// The per-column configuration csv-template expects.
// The casing is off here because that's what csv-template expects. Go figure.
type CSVTemplateColumn = {
  name: string;
  key: string;
  description?: string;
  required?: boolean;
  suggested_mappings?: string[];
};

export function configFromTemplate(t: RowTemplate): CSVTemplate {
  return {
    columns: Object.entries(t).map(([key, userConfig]) => configColumn(key, userConfig))
  }
}

function configColumn(key: string, column: ColumnTemplate<any>): CSVTemplateColumn {
  return {
    name: column.label ?? key,
    key: key,
    description: column.description,
    required: column.mustBeMapped,
    // TODO: Support suggested mappings.
    suggested_mappings: [],
  }
}

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
  }) as RowResult<RT>

  return entries
}
