import './App.css'
import { Importer } from './Importer'
import { Column } from './types'

function App() {
  return (
    <>
      <Importer columns={
        {
          description: {mustBeMapped: true, label: "Description"} as Column<string>,
          startDate: {label: "Start Date"} as Column<Date>,
          quantity: {label: "Quantity"} as Column<number>,
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
