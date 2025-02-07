import Selector from "./components/selector.tsx";
import {useState} from "react";

function App() {
  let [ad,setA] = useState('')
  const fetchProjects = async (page: number,search:string) => {
    const response = await fetch(`https://api.planetofmedicine.com/api/service-categories?page=${page}&search=${search}`);
    const data = await response.json();
    return {data};
  };
  let a = 'https://api.planetofmedicine.com/api/service-categories'
  const dataa = [
    {name: 'hello', id: 1},
    {name: 'bye', id: 2},
    {name: 'goodbye', id: 3},
    {name: 'goodnight', id: 4},
    {name: 'goodmorning', id: 5},
    {name: 'goodafternoon', id: 6},
    {name: 'goodnight', id: 7},
    {name: 'goodmorning', id: 8}
  ]
  return (
     <><Selector KeyShowFn={(item)=>item.name} search={true} getValue={(item)=>setA(item)} array={dataa} multiSelect={true} key={'name'} value={'id'}/></>
  )
}

export default App