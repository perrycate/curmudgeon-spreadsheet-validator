import {
  MantineReactTable,
  MRT_Cell,
  MRT_ColumnDef,
  useMantineReactTable,
} from 'mantine-react-table';
import { useMemo } from 'react';
import { ColumnKey, ColumnTemplate, Parsed, ParseError, Result, RowTemplate } from './types';


// Describes a single cell during the review phase.
type CellValue = {
  // This will be used for figuring out which parse function to use, etc.
  key: ColumnKey

  // The human-readable name for this column.
  header?: string

  // What is shown when editing.
  rawValue: string

  // What is shown when not editing.
  // This may often be the same as the raw value.
  displayValue: string
}

type Row = CellValue[]

// Reviewer defines a component that surfaces any parsing errors to the user
// and prompts them to make modifications as necessary.
export function Reviewer<RT extends RowTemplate>({
  template,
  data,
}: {
  template: RT
  // For the future: I wonder if we could use types to enforce that these are the same
  // length?
  data: Row[]
}) {
  const columnDefs = useMemo<MRT_ColumnDef<Row[]>>(() => {
    return data.map(c => ({
      accessorKey: c.key,
      header: c.header ?? c.key,
      Edit: ({cell}) => {
        const v = cell.getValue()
        console.dir(cell)
        console.dir(v)
        // TODO this is how we can modify the appearance of individual cells.
        return <div>{cell.getValue()}</div>
      },
    }))
  },
    [inputColumns],
  )

  // TODO NEXT: We need to separate the input data from the parsed data.
  // Actually let's only pass in what we need to display, and leave the logic to
  // the parent.
  // That is, we need to: 1. Call the cell's parse functions on each input data,
  // and 2. Surface errors.

  const table = useMantineReactTable({
    columns: columnDefs,
    data,
    enableEditing: true,
    editDisplayMode: 'table',
  })

  return <MantineReactTable table={table} />
}

type CellID = string

function getCellID(c: MRT_Cell): CellID {
  return `${c.row.id}-${c.column.id}`
}
