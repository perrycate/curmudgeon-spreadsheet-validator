import {
  MantineReactTable,
  MRT_Cell,
  MRT_ColumnDef,
  useMantineReactTable,
} from 'mantine-react-table';
import { useMemo } from 'react';
import { ColumnKey, ColumnTemplate, Parsed, ParseError, Result, RowTemplate } from './types';


// An input row, before any attempts at parsing.
type RawRow<RT extends RowTemplate> = Record<keyof RT, string>

// Describes a single cell during the review phase.
type CellValue = {
  // What is shown when editing.
  rawValue: string

  // What is shown when not editing.
  // This may often be the same as the raw value.
  displayValue: string

  // TODO errors and stuff.
}

// Row data post-parsing.
type Row<RT extends RowTemplate> = {
  [_ in keyof RT]: CellValue
}

// Reviewer defines a component that surfaces any parsing errors to the user
// and prompts them to make modifications as necessary.
export function Reviewer<RT extends RowTemplate>({
  template,
  data: inputData,
}: {
  template: RT
  // For the future: I wonder if we could use types to enforce that these are the same
  // length?
  data: RawRow<RT>[]
  // TODO: Use the same column order as the input file.
}) {
  const columnDefs = useMemo<MRT_ColumnDef<Row<RT>>[]>(() => {
    return Object.entries(template).map(([key, colTemplate], idx) => {
      return {
        id: key,
        header: colTemplate.label ?? key,
        accessorFn: (row: Row<RT>) => row[idx].displayValue,
        // TODO restore edit. Commit 1f5f6791d8821b250daad8679a922395a8e4e44c.
      }
    })
  },
    [template],
  )

  // We should eventually probably factor out the parsing logic from the
  // display functionality, I'm just lumping everything in here for now while I figure
  // out what it looks like.
  const parsedData = useMemo<Row<RT>[]>(() => {
    return inputData.map((rawRow) => {
      const parsedRow = Object.fromEntries(
        Object.entries(rawRow).map(([key, rawValue]: [ColumnKey, string]) => {
          const parsed = template[key].parse(rawValue)
          switch (parsed.status) {
            case "ok":
              return [key, {
                rawValue: parsed.value,
                displayValue: parsed.displayValue ?? parsed.value,
              }]
            case "error":
              return [key, {
                rawValue: parsed.message,
                displayValue: parsed.message,
                // TODO: Indicate errors.
              }]
          }
        })
      )

      return parsedRow as Row<RT>
    })
  }, [inputData, template])

  // TODO NEXT:
  // We need to: 1. Call the cell's parse functions on each input data,
  // and 2. Surface errors.

  const table = useMantineReactTable({
    columns: columnDefs,
    data: parsedData,
    enableEditing: true,
    editDisplayMode: 'table',
  })

  return <MantineReactTable table={table} />
}

type CellID = string

function getCellID(c: MRT_Cell): CellID {
  return `${c.row.id}-${c.column.id}`
}
