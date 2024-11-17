import { CSVImporter } from "csv-import-react";
import { Resource } from "i18next";
import { HTMLAttributes } from "react";

export type MapperProps = (HTMLAttributes<HTMLDialogElement> & HTMLAttributes<HTMLDivElement>) & {
  template?: Template;
  darkMode?: boolean;
  primaryColor?: string;
  className?: string;
  onComplete?: (data: OnCompleteData) => void;
  waitOnComplete?: boolean;
  customStyles?: Record<string, string> | string;
  showDownloadTemplateButton?: boolean;
  skipHeaderRowSelection?: boolean;
  language?: string;
  customTranslations?: Resource;
} & ModalParams;


type Template = {
  columns: TemplateColumn[];
};

type TemplateColumn = {
  name: string;
  key: string;
  description?: string;
  required?: boolean;
  suggested_mappings?: string[];
};

type MappedRow = {
  index: number;
  values: Record<string, number | string>;
};

type OnCompleteData = {
  num_rows: number
  num_columns: number
  columns: { key: string, name: string }[]
  rows: MappedRow[],
}

type ModalParams = {
  isModal?: boolean;
  modalIsOpen?: boolean;
  modalOnCloseTriggered?: () => void;
  modalCloseOnOutsideClick?: boolean;
};

// Thinnest of wrappers around tableflow's CSVImporter, with better types.
export function Mapper(props: MapperProps) {
  return <CSVImporter
    {...props}
  />
}
