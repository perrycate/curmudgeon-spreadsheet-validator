import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from 'mantine-react-table';
import { useMemo } from 'react';
import { Cell} from './types';


export type Column<T> = {
  key: string
  header?: string
  parse: (raw: string) => Cell<T>
}

type Columns = Column<any>[]

type Row<T extends {key: string}[]> = {
  readonly [K in T[number]['key']]: string
}
// Reviewer defines a component that surfaces any parsing errors to the user
// and allows them to make modifications as necessary.
export function Reviewer<Cols extends Columns>({
  columns: inputColumns,
  data
}: {
  columns: Cols,
  // For the future: I wonder if we could use types to enforce that these are the same
  // length?
  data: Row<Cols>[],
}) {
  const columns = useMemo<MRT_ColumnDef<Row<Cols>>[]>(() => {
    return inputColumns.map(c => ({
      accessorKey: c.key,
      header: c.header ?? c.key,
    }))
  },
    [inputColumns],
  )

  const table = useMantineReactTable({
    columns,
    data,
    enableEditing: true,
    editDisplayMode: 'table',
  })

  return <MantineReactTable table={table} />
}
