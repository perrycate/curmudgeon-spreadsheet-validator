import { ReturnedRow, RowTemplate } from "./types";
import { Mapper } from "./Mapper";
import { Route, Routes, useNavigate, useSearchParams } from "react-router-dom";
import { RawRow, Reviewer } from "./Reviewer";

/**
 * Rough plan of attack:
 * 0. Set up linting in CI.
 * 2.7 Add a "proceed" button from the review page.
 * 2.8 Add an "ignore rows with errors" option when proceeding.
 * 3. Handle optional values.
 * 4.5 Add mechanism for adding required but non-mapped columns.
 * 5. Add Picklist support.
 * 6. Improve styling.
 *    * Errors shouldn't change cell height. (Popup, maybe?)
 *    * Highlight error cells?
 * 10. Make this hackable. Callers should be able to override chunks.
 */

export interface ImporterProps<T extends RowTemplate> {
  columns: T;

  // Called once the input has been validated.
  onSuccess: (rows: ReturnedRow<T>[]) => void;

  // If true, routes will be set up for each individual phase, and data
  // will be passed between phases via url params.
  //
  // This is probably not what we'll want when actually using this (passing data
  // between phases via the url seems sketchy/fragile), but it should make manual
  // testing/debugging a lot easier.
  debugMode?: boolean;
}

export function Importer<RT extends RowTemplate>(props: ImporterProps<RT>) {
  const navigate = useNavigate();

  if (!props.debugMode) {
    return "This is dev only for now, don't actually use this. lol.";
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Mapper
              template={props.columns}
              isModal={false}
              darkMode={true}
              onComplete={(d) => {
                const mappedData = d.rows.map((r) => r.values);

                void navigate(
                  `/review?data=${encodeURIComponent(JSON.stringify(mappedData))}`,
                );
              }}
            />
          }
        />
        <Route
          path="/review"
          element={
            <>
              <a href="/">Start over</a>
              <ReviewerWrapper template={props.columns} />
            </>
          }
        />
        <Route path="*" element={"Route not found."} />
      </Routes>
    </>
  );
}

function ReviewerWrapper({ template }: { template: RowTemplate }) {
  const [searchParams] = useSearchParams();

  const encodedData = searchParams.get("data");
  if (encodedData === null) {
    return "No data";
  }

  const data = JSON.parse(decodeURIComponent(encodedData)) as RawRow<
    typeof template
  >[];

  return <Reviewer template={template} data={data} />;
}
