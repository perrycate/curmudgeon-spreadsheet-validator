import { ReturnedRow, RowTemplate } from "./types";
import { configFromTemplate, parseRow } from "./services/tabular-import";
import { Mapper } from "./Mapper";
import { useMemo, useState } from "react";

/**
 * Rough plan of attack:
 * 2. Add some primitives for showing errors in the review phase.
 * 2.5 Figure out what primitives we need for allowing the user to actually edit/correct items during review.
 * 3. Handle optional values.
 * 4.5 Add mechanism for adding required but non-mapped columns.
 * 5. Add Picklist support.
 */

export type ImporterProps<T extends RowTemplate> = {
  columns: T

  // Called once the input has been validated.
  onSuccess: (rows: ReturnedRow<T>[]) => void
}

type Phase = 'mapping' | 'reviewing'

// A "row" of data after the mapping phase.
// Every mapped column has a key in the record. (Idea: Can we enforce this with types?)
type MappedData = Record<string, number | string>

// Matches the column key (required by the row template) to the name of the column
// in the input file (from headers).
type MappedColumn = { key: string, name: string }

export function Importer<T extends RowTemplate>(props: ImporterProps<T>) {
  const config = useMemo(() => configFromTemplate(props.columns), [props.columns])

  const [phase, setPhase] = useState<Phase>('mapping')
  const [_mappedColumns, setMappedColumns] = useState<MappedColumn[] | null>(null);
  const [_mappedData, setMappedData] = useState<MappedData[] | null>(null);

  switch (phase) {
    case 'mapping':
      return (
          <Mapper
            isModal={false}
            darkMode={true}
            onComplete={(d) => {
              setMappedColumns(d.columns)
              setMappedData(d.rows.map(r => r.values))
              setPhase('reviewing')


              // Just testing.
              const firstRow = Object.fromEntries(Object.entries(d.rows[0].values).map(([k, v]) => [k, v.toString()]))
              const a = parseRow(firstRow, props.columns)
              console.log(a)
            }}
            template={config}
          />
      );
    case 'reviewing':
      return null // TODO stitch together.
  }

}
