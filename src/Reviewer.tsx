import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from 'mantine-react-table';
import { useMemo } from 'react';
import { ColumnKey, ParseError, RowTemplate } from './types';
import { Stack, Text } from '@mantine/core';


// An input row, before any attempts at parsing.
export type RawRow<RT extends RowTemplate> = Record<keyof RT, string>

// Describes a single cell during the review phase.
type CellValue = {
  // What is shown when editing.
  rawValue: string

  // What is shown when not editing.
  // This may often be the same as the raw value.
  displayValue: string

  error?: ParseError
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
                rawValue: rawValue,
                displayValue: rawValue,
                error: parsed,
              }]
          }
        })
      )

      return parsedRow as Row<RT>
    })
  }, [inputData, template])


  const columnDefs = useMemo<MRT_ColumnDef<Row<RT>>[]>(() => {
    return Object.entries(template).map(([key, colTemplate]) => {
      return {
        id: key,
        header: colTemplate.label ?? key,
        accessorFn: (row: Row<RT>) => {
          return row[key].displayValue
        },
        Cell: ({row}) => {
          const cellState = parsedData[row.index][key]

          return (
            <Stack spacing="xs">
              <Text>
                {cellState.displayValue}
              </Text>
              {cellState.error ?
                <Text color="red">
                  {cellState.error.message}
                </Text>
              : null}
            </Stack>
          )
        },
        mantineEditTextInputProps: ({row}) => {
          const val = parsedData[row.index][key]

          if (val.error) {
            return {
              error: val.error.message,
            }
          }

          return {}
        },
        // TODO restore edit. Commit 1f5f6791d8821b250daad8679a922395a8e4e44c.
      }
    })
  },
    [template],
  )

  // TODO NEXT:
  // 2. Surface errors.

  const table = useMantineReactTable({
    columns: columnDefs,
    data: parsedData,
    enableEditing: true,
    editDisplayMode: 'cell',
  })

  return <MantineReactTable table={table} />
}
