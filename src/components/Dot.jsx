import { useEffect } from "react"

const Dot = (props) => {
  const {d} = props
  useEffect(() => {
    console.log("effect")


  }, [])
  
  return (
    <polygon
      stroke="green"
      strokeWidth={1}
      fill={d.status}
      points={`${d.x},${d.y + 10} ${d.x - 10},${d.y} ${d.x},${d.y - 10} ${d.x + 10},${d.y}`}
    />
  )
}

export default Dot
