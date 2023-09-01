import * as d3 from 'd3'
import { useState} from 'react';

const Display = ({setYmax}) => {
    const [sinput, setSinpt]=useState()

    const ymaxchange=(ymax)=>{
        d3.select(".svg1").remove();
        setYmax(ymax)
    }

    const inputchange=(e)=>{
        e.preventDefault()
        var varx=e.target.value
        if (varx=="") varx="40"
        setSinpt(varx)
    }

    const inputsubmit=()=>{
        d3.select(".svg1").remove();
        setYmax(sinput)
    }

    return (
    <div className='cs'>
        <div id="divselect">
            <button className='divselect' onClick={e=>ymaxchange(40)}>Scale: 40</button> 
            <button className='divselect' onClick={e=>ymaxchange(10)}>Scale: 10</button> 
            <button className='divselect' onClick={e=>ymaxchange(5)}>Scale: 5</button> 
            <button className='divselect' onClick={e=>ymaxchange(3)}>Scale: 3</button> 
            <div className="range">
               <p >Please Input Scale:</p>
                <input className="rmax"
                onChange={inputchange}
                />
                <button className='changesb'type="submit" onClick={inputsubmit}>Submit</button>
             </div>
       
        </div>
        <div id="dtndiv">
            <p>
            <a href="" id="link" download="image.png">
            <button className='dtndiv'>Download PNG</button>
            </a>
            </p>
            <p>
                <button className='dtndiv' id="download">Download PDF</button>
            </p>
        </div>
    </div>
  )
}

export default Display
