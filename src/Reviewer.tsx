import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from 'mantine-react-table';
import { useMemo } from 'react';


export type ReviewerProps = {
    columns: {key: string, name: string}[]
    data: RawRow[]
}

export type RawRow = Record<string, number | string>

export function Reviewer({
    columns: userColumns,
    data
}: ReviewerProps) {
    const columns = useMemo<MRT_ColumnDef<RawRow>[]>(() => {
        return userColumns.map(c => ({
            accessorKey: c.key,
            header: c.name,
        }))
    },
    [userColumns],
    )

    const table = useMantineReactTable({
        columns,
        data,
    })

    return <MantineReactTable table={table} />
}
