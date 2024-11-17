import { ReturnedRow, RowTemplate } from "./types";
import { configFromTemplate } from "./services/tabular-import";
import { Mapper } from "./Mapper";

/**
 * Rough plan of attack:
 * 2. Add mantine-react-table for a "review" phase, pipe CSVImporter output into it.
 * 3. Add some primitives for showing errors in the review phase.
 * 4. Add logic for parsing rich types, and surfacing errors in the review phase (not yet correcting)
 * 5. Figure out what primitives we need for allowing the user to actually edit/correct items during review.
 */

export type ImporterProps<T extends RowTemplate> = {
  columns: T

  // Called once the input has been validated.
  onSuccess: (rows: ReturnedRow<T>[]) => void
}


export function Importer<T extends RowTemplate>(props: ImporterProps<T>) {
  const config = configFromTemplate(props.columns)

  return (
    <>
      <Mapper
        isModal={false}
        darkMode={true}
        onComplete={(d) => {
            // @ts-ignore: TODO: No type safety yet, thats' step 4.
            props.onSuccess(d.rows.map(r => r.values))
        }}
        template={config}
      />
    </>
  );
}


