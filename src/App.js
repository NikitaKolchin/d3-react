import "./App.css"
import Object from "./components/Object"
import objects from "./objects"

function App() {
  
  const objs = objects
  return (
    <div className="App">
      {objs.map((item, i)=><Object key={i} object={item} height={600} width={800} margin = {35}/>)}
        
    </div>
  )
}

export default App
