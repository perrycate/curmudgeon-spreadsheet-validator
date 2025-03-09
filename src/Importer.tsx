import { ReturnedRow, RowTemplate } from "./types";
import { Mapper } from "./Mapper";
import { Route, Routes, useNavigate } from "react-router-dom";

/**
 * Rough plan of attack:
 * 1. Improve debugging - links to each page, pass data in url or something.
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

  // If true, routes will be set up for each individual phase, and data
  // will be passed between phases via url params.
  //
  // This is probably not what we'll want when actually using this (passing data
  // between phases via the url seems sketchy/fragile), but it should make manual
  // testing/debugging a lot easier.
  debugMode?: boolean
}

export function Importer<RT extends RowTemplate>(props: ImporterProps<RT>) {
  const navigate = useNavigate()

  if (!props.debugMode) {
    return "This is dev only for now, don't actually use this. lol."
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
                const mappedData = d.rows.map(r => r.values)

                navigate(`/review?data=${encodeURIComponent(JSON.stringify(mappedData))}`)
              }}
            />
          }
        />
        <Route
          path="/review"
          element={
            <ReviewerWrapper />
          }
        />
        <Route path="*" element={"Route not found."} />
      </Routes>
    </>
  )
}

function ReviewerWrapper() {
  return null
}
