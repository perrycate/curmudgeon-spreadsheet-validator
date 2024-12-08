import './App.css'
import { Reviewer } from './Reviewer'

function App() {
  return (
    <>
      <Reviewer
        columns={[
            { key: "description", parse: (v) => ({status: 'ok', value: v})},
            { key: "quantity", parse: (v) => ({status: 'ok', value: parseInt(v)})},
            { key: "date", parse: (_) => ({status: 'error', message: "nope"})},
        ]}
        data={[
            {
                description: "my first row",
                quantity: "42",
                date: "11/23/24",
            },
            {
                description: "my second row",
                quantity: "43.2",
                date: "2024-11-23",
            },
        ]}
      />
    </>
  )
}

export default App
