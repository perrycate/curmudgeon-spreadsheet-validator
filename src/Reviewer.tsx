import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from 'mantine-react-table';
import { useEffect, useMemo, useState } from 'react';
import { ColumnKey, ColumnTemplate, Parsed, ParseError, RowTemplate } from './types';
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
  const [parsedData, setParsedData] = useState<Row<RT>[]>([])

  // We should eventually probably factor out the parsing logic from the
  // display functionality, I'm just lumping everything in here for now while I figure
  // out what it looks like.
  useEffect(() => {
    setParsedData(inputData.map((rawRow) => {
      const parsedRow = Object.fromEntries(
        Object.entries(rawRow).map(([key, rawValue]: [ColumnKey, string]) => {
          return [key, parseCellValue(template[key], rawValue)]
        })
      )

      return parsedRow as Row<RT>
    }))
  }, [inputData, template])

  const columnDefs = useMemo<MRT_ColumnDef<Row<RT>>[]>(() => {
    return Object.entries(template).map(([key, colTemplate]) => {
      return {
        id: key,
        header: colTemplate.label ?? key,
        accessorFn: (row: Row<RT>) => {
          return row[key].rawValue
        },
        Cell: ({row}) => {
          const cell = parsedData[row.index][key]

          return (
            <Stack spacing="xs">
              <Text>
                {cell.displayValue}
              </Text>
              {cell.error ?
                <Text color="red">
                  {cell.error.message}
                </Text>
              : null}
            </Stack>
          )
        },
        mantineEditTextInputProps: ({row}) => {
          const val = parsedData[row.index][key]

          return {
            error: val.error?.message,
            onBlur: (e) => {
              parsedData[row.index][key as keyof RT] = parseCellValue(template[key], e.target.value)
              setParsedData(parsedData)
            },
          }
        },
      }
    })
  },
    [template, parsedData],
  )

  const table = useMantineReactTable({
    columns: columnDefs,
    data: parsedData,
    enableEditing: true,
    editDisplayMode: 'cell',
  })

  return <MantineReactTable table={table} />
}

function parseCellValue<T>(template: ColumnTemplate<T>, rawValue: string): CellValue {
  const parsed = template.parse(rawValue)
  switch (parsed.status) {
    case "ok":
      return {
        rawValue: rawValue,
        displayValue: parsed.displayValue ?? rawValue,
      }
    case "error":
      return {
        rawValue: rawValue,
        displayValue: rawValue,
        error: parsed,
      }
  }
}
