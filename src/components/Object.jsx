import * as d3 from "d3"
import Dot from "./Dot"
import { useEffect, useRef, useState, useCallback } from "react"

function Object(props) {
  const object = props.object
  const height = props.height
  const width = props.width
  const margin = props.margin
  const xAxisRef = useRef(null)
  const yAxisRef = useRef(null)
  const xGridRef = useRef(null)
  const yGridRef = useRef(null)
  const [dataPlan, setDataPlan] = useState([])
  const [dataFact, setDataFact] = useState([])

  const axisWidth = useCallback(() => width - 2 * margin, [margin, width])
  const axisHeight = useCallback(() => height - 2 * margin, [height, margin])

  const line = d3
    .line()
    .x((d) => d.x)
    .y((d) => d.y)

  const startDate = new Date(`${object.startYear}-01-01T00:00:00`).getTime()
  const endDate = new Date(`${object.endYear}-01-01T00:00:00`).getTime()

  const startValue = 4000
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
    setDataPlan(
      object.dataPlan
        .map((item) => ({ ...item, date: item.date.getTime() }))
        .map((item) => ({
          x: xScale(item.date) + margin,
          y: yScale(item.lv) + margin,
          status: item.status,
        }))
    )
    setDataFact(
      object.dataFact
        .map((item) => ({ ...item, date: item.date.getTime() }))
        .map((item) => ({
          x: xScale(item.date) + margin,
          y: yScale(item.lv) + margin,
          status: item.status,
        }))
    )
  }, [])

  useEffect(() => {
    const xAxis = d3
      .axisBottom()
      .scale(xScale)
      .ticks(6)
      .tickFormat(d3.timeFormat("%Y"))
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
  }, [])

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
          <path className="data1" d={line(dataPlan)} />
        </g>
        <g>
          <path className="data2" d={line(dataFact)} />
        </g>

        <g>
          {dataPlan.map((d, i) => (
            <Dot key={i} d={d} />
          ))}
        </g>
        <g>
          {dataFact.map((d, i) => (
            <Dot key={i} d={d} />
          ))}
        </g>
        <g>
          {dataPlan.map((item, i) => (
            <line
              key={i}
              className="lines"
              x1={item.x}
              y1={item.y}
              x2={dataFact[i].x}
              y2={dataFact[i].y}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}

export default Object
