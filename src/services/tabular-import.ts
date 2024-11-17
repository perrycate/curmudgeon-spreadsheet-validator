import { Column, RowTemplate } from "../types";

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

function configColumn(key: string, column: Column<any>): CSVTemplateColumn {
  return {
    name: column.label ?? key,
    key: key,
    description: column.description,
    required: column.mustBeMapped,
    // TODO: Support suggested mappings.
    suggested_mappings: [],
  }
}
