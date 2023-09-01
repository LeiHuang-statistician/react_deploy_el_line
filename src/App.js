
import './App.css';
import Svgx from './Svgx';
import Display from './display';
import * as d3 from 'd3';
import { useState,useEffect } from 'react';
import csvFilePath from './bmi_plot.csv';
import csvToJSON from './csvreader'
import plotx from './plotx'

function App() {
  const [title, setTitle]=useState("All")
  const [data, setData]=useState([])
  const [ymax, setYmax]=useState(40)
    
  useEffect( () => {  
    
    const xdata=csvToJSON(csvFilePath)
    //console.log(xdata)
    const rd= function(){
        fetch(csvFilePath)
        .then( response => response.text() )
        .then( responseText => {
          var x=csvToJSON(responseText)
          //console.log(x)
          
          x.map(d=>d.spending=+d.spending)
            setData(x)
            plotx(x,title,ymax)
          })
        }
      rd()
    
  },[ymax])


    
  
  return (
    <div className="App">
      <Display setYmax={setYmax}/>
      <Svgx title={title}
            
            />

    </div>
  );
}

export default App;
