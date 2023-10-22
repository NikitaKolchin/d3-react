import { useEffect, useState, useRef } from "react"
import style from "./App.module.css"
import Object from "./components/Object"
import objs from "./objects"

const worker = new Worker(new URL('./deep-thought.js', import.meta.url));


function App() {
    const dateRef = useRef(null);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  )
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10))
  const [checked, setChecked] = useState(
    objs.map((item) => ({ name: item.name, checked: true }))
  )
  const [objects, setObjects] = useState(structuredClone(objs))
  const [filtered, setFiltered] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    worker.postMessage({
      question:
        100000000000,
    });
    worker.onmessage = ({ data: { answer } }) => {
      console.log(answer);
    };
  }, [])
  

  useEffect(() => {
    if (filtered) {
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
  }, [filtered])

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
  console.log(dateRef)

  const handleFilter = () => {
    if (new Date(startDate) >= new Date(endDate)) {
      setError("Дата начала должна быть больше даты окончания")
      return
    }
    setFiltered(true)
    setError("")
  }

  const handleReset = () => {
    setFiltered(false)
  }
  return (
    <div className={style.App}>
      <div className={style.filter}>
        <button className={style.but} onClick={handleFilter} disabled={filtered}>Наложить фильтр</button>
        <button className={style.but} onClick={handleReset} disabled={!filtered}>Сбросить фильтр</button>
        {checked.map((item, i) => (
          <div key={`checkbox${i}`}>
            <input 
              disabled={filtered}
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
          disabled={filtered}
          type="date"
          id="startdate"
          value={startDate}
          className={style.date}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          ref={dateRef}
          disabled={filtered}
          type="date"
          id="enddate"
          onClick={() =>{dateRef.current.showPicker()}}
          value={endDate}
          className={style.date}
          onChange={(e) => setEndDate(e.target.value)}
        />
        {error&&<span className={style.error}>{error}</span>}
      </div>
      <div className="charts">
        {objects.map((item, i) => (
          <Object key={i} object={item} height={600} width={800} margin={35} />
        ))}
      </div>
      
    </div>
  )
}
export default App
