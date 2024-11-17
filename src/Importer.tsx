import { CSVImporter } from "csv-import-react";
import { useState } from "react";

/**
 * Rough plan of attack:
 * 1. Accept templates, config CSVImporter appropriately.
 * 2. Add mantine-react-table for a "review" phase, pipe CSVImporter output into it.
 * 3. Add some primitives for showing errors in the review phase.
 * 4. Add logic for parsing rich types, and surfacing errors in the review phase (not yet correcting)
 * 5. Figure out what primitives we need for allowing the user to actually edit/correct items during review.
 */

export function Importer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open CSV Importer</button>

      <CSVImporter
        modalIsOpen={isOpen}
        modalOnCloseTriggered={() => setIsOpen(false)}
        darkMode={true}
        onComplete={(data) => console.log(data)}
        template={{
          columns: [
            {
              name: "First Name",
              key: "first_name",
              required: true,
              description: "The first name of the user",
              suggested_mappings: ["First", "Name"],
            },
            {
              name: "Age",
              data_type: "number",
            },
          ],
        }}
      />
    </>
  );
}
