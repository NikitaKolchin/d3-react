import { useEffect, useState } from "react"
import style from "./App.module.css"
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
  const [error, setError] = useState("")

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
    if (new Date(startDate) >= new Date(endDate)) {
      setError("Дата начала должна быть больше даты окончания")
      return
    }
    setFiltred(true)
    setError("")
  }

  const handleReset = () => {
    setFiltred(false)
  }
  return (
    <div className={style.App}>
      <div className={style.filter}>
        <button className={style.but} onClick={handleFilter} disabled={filtred}>Наложить фильтр</button>
        <button className={style.but} onClick={handleReset} disabled={!filtred}>Сбросить фильтр</button>
        {checked.map((item, i) => (
          <div key={`checkbox${i}`}>
            <input 
              disabled={filtred}
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
          disabled={filtred}
          type="date"
          id="startdate"
          value={startDate}
          className={style.date}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          disabled={filtred}
          type="date"
          id="enddate"
          value={endDate}
          className={style.date}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      {error&&<div>{error}</div>}
      <div className="charts">
        {objects.map((item, i) => (
          <Object key={i} object={item} height={600} width={800} margin={35} />
        ))}
      </div>
      
    </div>
  )
}
export default App
