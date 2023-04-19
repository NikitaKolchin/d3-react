const Dot = (props) => {
  const {d} = props
  console.log(d)

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
