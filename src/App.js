import { useEffect, useState } from "react"
import "./App.css"
import Object from "./components/Object"
import objs from "./objects"

function App() {
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  )
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10))
  const [checked, setChecked] = useState(
    objs.map((item) => ({ name: item.name, checked: true }))
  )
  const [objects, setObjects] = useState(structuredClone(objs))
  const [filtred, setFiltred] = useState(false)

  useEffect(() => {
    console.log(new Date(startDate))
    if (filtred) {
      objects.forEach((obj) => {
        obj.dataPlan = obj.dataPlan.filter(
          (item) =>
            item.date > new Date(startDate) && item.date < new Date(endDate)
        )
      })
  
      objects.forEach((obj) => {
        obj.dataFact = obj.dataFact.filter((fact) =>
          obj.dataPlan.find((plan) => fact.name === plan.name)
        )
      })
      setObjects(objects.filter((obj) => checked.find(check=>check.name===obj.name).checked))
    } else {
      setObjects(structuredClone(objs))
      setChecked(objs.map((item) => ({ name: item.name, checked: true })))
    }
  }, [filtred])

  const handleToggle = (e) => {
    const newChecked = checked.map((item) => {
      if (item.name === e.target.value) {
        const current = checked.find((item) => item.name === e.target.value)
        return { name: current.name, checked: !current.checked }
      }
      return item
    })
    setChecked(newChecked)
  }

  const handleFilter = () => {
    setFiltred(true)
  }

  const handleReset = () => {
    setFiltred(false)
  }
  return (
    <div className="App">
      <button onClick={handleFilter}>Наложить фильтр</button>
      <button onClick={handleReset}>Сбросить фильтр</button>
      {checked.map((item, i) => (
        <div key={`checkbox${i}`}>
          <input
            type="checkbox"
            id={`checkbox${i}`}
            checked={item.checked}
            value={item.name}
            onChange={handleToggle}
          />{" "}
          <label htmlFor={`checkbox${i}`}>{item.name}</label>
        </div>
      ))}
      <input
        type="date"
        id="startdate"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        id="enddate"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      {objects.map((item, i) => (
        <Object key={i} object={item} height={600} width={800} margin={35} />
      ))}
    </div>
  )
}
export default App
