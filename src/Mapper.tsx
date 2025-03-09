import { CSVImporter } from "csv-import-react";
import { Resource } from "i18next";
import { HTMLAttributes, useMemo } from "react";
import { ColumnTemplate, RowTemplate } from "./types";

export type MapperProps<RT extends RowTemplate> = (HTMLAttributes<HTMLDialogElement> & HTMLAttributes<HTMLDivElement>) & {
  template: RT;
  darkMode?: boolean;
  primaryColor?: string;
  className?: string;
  onComplete?: (data: OnCompleteData<RT>) => void;
  waitOnComplete?: boolean;
  customStyles?: Record<string, string> | string;
  showDownloadTemplateButton?: boolean;
  skipHeaderRowSelection?: boolean;
  language?: string;
  customTranslations?: Resource;
} & ModalParams;

// Thinnest of wrappers around tableflow's CSVImporter, with better types.
export function Mapper<RT extends RowTemplate>(props: MapperProps<RT>) {
  const config = useMemo(() => configFromTemplate(props.template), [props.template])

  return <CSVImporter
    {...props}
    template={config}
  />
}

type CSVTemplate = {
  columns: CSVTemplateColumn[];
}

// The per-column configuration csv-template expects.
type CSVTemplateColumn = {
  name: string;
  key: string;
  description?: string;
  required?: boolean;
  // The casing is off here because that's what csv-template expects. Go figure.
  suggested_mappings?: string[];
};

type MappedRow<RT extends RowTemplate> = {
  index: number;
  values: Record<keyof RT, string>;
};

type OnCompleteData<RT extends RowTemplate> = {
  num_rows: number
  num_columns: number
  columns: { key: string, name: string }[]
  rows: MappedRow<RT>[],
}

type ModalParams = {
  isModal?: boolean;
  modalIsOpen?: boolean;
  modalOnCloseTriggered?: () => void;
  modalCloseOnOutsideClick?: boolean;
};


function configFromTemplate(t: RowTemplate): CSVTemplate {
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
