import './App.css'
import { Importer } from './Importer'
import { dateColumn, numberColumn, stringColumn } from './types'

function App() {
  return (
    <>
      <Importer columns={
        {
          description: stringColumn({mustBeMapped: true, label: "Description"}),
          startDate: dateColumn({label: "Start Date"}),
          quantity: numberColumn({label: "Quantity"}),
        }}
        onSuccess={(rows) => {
          rows.map(r => {
            console.log(r.description)
          })
        }}
      />
    </>
  )
}

export default App
