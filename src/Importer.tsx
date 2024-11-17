import { ReturnedRow, RowTemplate } from "./types";
import { configFromTemplate } from "./services/tabular-import";
import { Mapper } from "./Mapper";
import { useMemo, useState } from "react";
import { Reviewer } from "./Reviewer";

/**
 * Rough plan of attack:
 * 3. Add some primitives for showing errors in the review phase.
 * 4. Add logic for parsing rich types, and surfacing errors in the review phase (not yet correcting)
 * 5. Figure out what primitives we need for allowing the user to actually edit/correct items during review.
 */

export type ImporterProps<T extends RowTemplate> = {
  columns: T

  // Called once the input has been validated.
  onSuccess: (rows: ReturnedRow<T>[]) => void
}

type Phase = 'mapping' | 'reviewing'

type MappedData = Record<string, number | string>
type MappedColumn = { key: string, name: string }

export function Importer<T extends RowTemplate>(props: ImporterProps<T>) {
  const config = useMemo(() => configFromTemplate(props.columns), [props.columns])

  const [phase, setPhase] = useState<Phase>('mapping')
  const [mappedColumns, setMappedColumns] = useState<MappedColumn[] | null>(null);
  const [mappedData, setMappedData] = useState<MappedData[] | null>(null);

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
            }}
            template={config}
          />
      );
    case 'reviewing':
      return (mappedColumns && mappedData ?
        <Reviewer columns={mappedColumns} data={mappedData} />
        : null
      )
  }

}
