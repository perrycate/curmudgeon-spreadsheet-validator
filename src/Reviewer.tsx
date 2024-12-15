import {
  MantineReactTable,
  MRT_Cell,
  MRT_ColumnDef,
  useMantineReactTable,
} from 'mantine-react-table';
import { useMemo } from 'react';
import { Result} from './types';


export type Column<T> = {
  key: string
  header?: string
  parse: (raw: string) => Result<T>
}

type Columns = Column<any>[]

// TODO tighten types - we should be able to say that C extends Column,
// and infer T.
type Row<C extends {key: string}[]> = {
  readonly [K in C[number]['key']]: Result<unknown>
}


// Reviewer defines a component that surfaces any parsing errors to the user
// and allows them to make modifications as necessary.
export function Reviewer<Cols extends Columns>({
  columns: inputColumns,
  data: inputData,
}: {
  columns: Cols,
  // For the future: I wonder if we could use types to enforce that these are the same
  // length?
  data: Row<Cols>[],
}) {
  const columnDefs = useMemo<MRT_ColumnDef<Row<Cols>>[]>(() => {
    return inputColumns.map(c => ({
      accessorKey: c.key,
      header: c.header ?? c.key,
      Edit: ({cell}) => {
        const v = cell.getValue()
        console.dir(cell)
        // TODO this is how we can modify the appearance of individual cells.
        return <div>{cell.getValue()}</div>
      },
    }))
  },
    [inputColumns],
  )

  // TODO NEXT: We need to separate the input data from the parsed data.
  // Actually let's only pass in what we need to disply, and leave the logic to
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
