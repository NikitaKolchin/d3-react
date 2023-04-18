import "./App.css"
import * as d3 from "d3"
import { useEffect, useRef, useState, useMemo } from "react"

function App() {
  const xAxisRef = useRef(null)
  const yAxisRef = useRef(null)
  const xGridRef = useRef(null)
  const yGridRef = useRef(null)
  const [data1, setData1] = useState([])
  const [data2, setData2] = useState([])
  const height = 600
  const width = 500
  const margin = 35
  const date = new Date("2023-04-18T11:00:00").getTime()
  const axisWidth = () => width - 2 * margin
  const axisHeight = () => height - 2 * margin
  const rawData1 = useMemo(
    () => [
      { date: date + 0 * 24 * 60 * 60 * 1000, lv: 0 },
      { date: date + 1 * 24 * 60 * 60 * 1000, lv: 20 },
      { date: date + 2 * 24 * 60 * 60 * 1000, lv: 30 },
      { date: date + 3 * 24 * 60 * 60 * 1000, lv: 70 },
      { date: date + 4 * 24 * 60 * 60 * 1000, lv: 20 },
      { date: date + 5 * 24 * 60 * 60 * 1000, lv: 30 },
    ],
    [date]
  )

  const rawData2 = useMemo(
    () => [
      { date: date + 0 * 24 * 60 * 60 * 1000, lv: 0 },
      { date: date + 1 * 24 * 60 * 60 * 1000, lv: 40 },
      { date: date + 2 * 24 * 60 * 60 * 1000, lv: 60 },
      { date: date + 3 * 24 * 60 * 60 * 1000, lv: 90 },
      { date: date + 4 * 24 * 60 * 60 * 1000, lv: 50 },
      { date: date + 5 * 24 * 60 * 60 * 1000, lv: 10 },
    ],
    [date]
  )

  const line = d3
    .line()
    .x((d) => d.x)
    .y((d) => d.y)

  const startDate = new Date("2023-04-18T00:00:00").getTime()
  const endDate = startDate + 6 * 24 * 60 * 60 * 1000

  const startValue = 100
  const endValue = 0

  const xScale = d3
    .scaleTime()
    .domain([startDate, endDate])
    .range([0, axisWidth()])
  const yScale = d3
    .scaleLinear()
    .domain([startValue, endValue])
    .range([0, axisHeight()])

  useEffect(() => {
    const xAxis = d3
      .axisBottom()
      .scale(xScale)
      .ticks(6)
      .tickFormat(d3.timeFormat("%d.%m"))
    const yAxis = d3.axisLeft().scale(yScale).ticks(10)
    d3.select(xAxisRef.current).call(xAxis)
    d3.select(yAxisRef.current).call(yAxis)

    const xGrid = d3
      .axisBottom(xScale)
      .ticks(6)
      .tickFormat("")
      .tickSize(-axisHeight())

    d3.select(xGridRef.current).call(xGrid).classed("grid-line", true)

    const yGrid = d3
      .axisLeft(yScale)
      .ticks(10)
      .tickFormat("")
      .tickSize(-axisWidth())

    d3.select(yGridRef.current).call(yGrid).classed("grid-line", true)
  }, [startDate, endDate, xScale, yScale])

  useEffect(() => {
    setData1(
      rawData1.map((item) => ({
        x: xScale(item.date) + margin,
        y: yScale(item.lv) + margin,
      }))
    )
    setData2(
      rawData2.map((item) => ({
        x: xScale(item.date) + margin,
        y: yScale(item.lv) + margin,
      }))
    )
  }, [rawData1, rawData2, xScale, yScale])

  return (
    <div className="App">
      <svg width={width} height={height}>
        <g
          className="axis"
          ref={xAxisRef}
          transform={`translate(${margin}, ${height - margin})`}
        />
        <g
          className="axis"
          ref={yAxisRef}
          transform={`translate(${margin}, ${margin})`}
        />
        <g
          ref={xGridRef}
          transform={`translate(${margin}, ${height - margin})`}
        />
        <g ref={yGridRef} transform={`translate(${margin}, ${margin})`} />
        <g>
          <path className="data1" d={line(data1)} />
        </g>
        <g>
          <path className="data2" d={line(data2)} />
        </g>

        <g>
          {data1.map((d, i)=><polygon key={i} className="dot1" points={`${d.x},${d.y + 10} ${d.x - 10},${d.y} ${d.x},${d.y - 10} ${d.x + 10},${d.y}`}/>)}
        </g>
        <g>
          {data2.map((d, i)=><circle key={i} className="dot2" r={10} cx={d.x} cy={d.y}/>)}
        </g>
        <g>
          {data1.map((item, i) => (
            <line
              key={i}
              className="lines"
              x1={item.x}
              y1={item.y}
              x2={data2[i].x}
              y2={data2[i].y}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}

export default App
