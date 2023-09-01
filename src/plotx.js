import * as d3 from 'd3';
import * as d3v4 from 'd3v4'



function plotx(data,title, ymax){
    // set the dimensions and margins of the graph
    //var margin = {top: 30, right: 20, bottom: 50, left: 150};
    var margin = { top: 30, right: 160, bottom: 0, left: 105 };
    var widthA = 1000;
    var heightA = 700;
    var fontsize=16;

    const innerWidth = widthA - margin.left - margin.right;
    const innerHeight = heightA - margin.top - margin.bottom;


  // append the svg object to the body of the page
  var svg = d3.select('#svgx')
  .attr("width", widthA + margin.left + margin.right)
  .attr("height", heightA + margin.top + margin.bottom)


  var  svg1=svg.selectAll('.svg1').data([1])
  .enter()
  .append('g')
  .attr('class','svg1')
  .attr('transform', `translate(${margin.left+80},${margin.top+30})`)

  
  //console.log(data)

  const yValue = d => d.spending;
  const lastYValue = d =>yValue(d.values[d.values.length - 1]);


  var sumstat = d3v4.nest() 
      .key(d => d.media)
      .entries(data)
      .sort((a, b) =>
        d3.descending(lastYValue(a), lastYValue(b))
      );
    
  //console.log('sumstat',sumstat)


  //format the year 
  var parseTime = d3.timeParse("%Y");

  data.forEach(function (d) {
      d.year = parseTime(d.year);
  });

  //**************************************scale xAxis 
  const offy=30
  var xExtent = d3.extent(data, d => d.year);
  var xScale = d3.scaleTime().domain(xExtent).range([offy, innerWidth])

  
  const xAxis = d3.axisBottom()
                 .scale(xScale)
                 .ticks(4)
                 .tickPadding(15);


  const xAxisG=svg1.append("g")
    .attr("class", "yaxis")
    .attr('transform', `translate(0,${innerHeight})`)
    .call(xAxis)
    .attr('x', -innerHeight / 2)
    .attr("y", -60) // a little bit below xAxis
    .attr('transform',`translate(0,${innerHeight+10})`)
    

  //**************************************scale yAxis
  //var yExtent = d3.extent(data, d => d.spending);
  //var yMax=d3.max(data,d=>d.spending)
  //var yScale = d3.scaleLinear().domain(yExtent).range([innerHeight, 0])
  var yScale = d3.scaleLinear().domain([0, ymax]).range([innerHeight, 0])
  
    
  const yAxis = d3.axisLeft()
  .scale(yScale)
  .ticks(10)
  

const yAxisG = svg1.append("g")
.attr("class", "axis")
.call(yAxis)
yAxisG.selectAll('text')
      .style('font-size',fontsize) 

//yAxisG.select('.domain').remove();  
xAxisG.selectAll('text').remove(); 

//*************************group data and create color scale
  var mediaName = sumstat.map(d => d.key) 
  const colors=[...d3.schemeCategory10,"#de9ed6"] 
  const colorScale = d3.scaleOrdinal(colors);
  //console.log('colorscale',d3.schemeCategory10)
  //console.log('colorscale',colors)
  var color = colorScale.domain(mediaName.map(d => d.key));


  //select path - three types: curveBasis,curveStep, curveCardinal
  // ********************************************main plot
  d3.select(".svg1")
      .selectAll(".line")
      .append("g")
      .attr("class", "line")
      .data(sumstat)
      .enter()
      .append("path")
      .attr("d", function (d) {
          return d3.line()
              .x(d => xScale(d.year))
              .y(d => yScale(d.spending)).curve(d3.curveCardinal)
              (d.values)
      })
      .attr("fill", "none")
      .attr("stroke", d => color(d.key))
      .attr("stroke-width", 1)

//************************************append circle for line

// d3.select(".svg1")
//     .selectAll("circle")
//     .append("g")
//     .data(data)
//     .enter()
//     .append("circle")
//     .attr("r", 6)
//     .attr("cx", d => xScale(d.year))
//     .attr("cy", d => yScale(d.spending))
//     .style("fill", d => color(d.media))
//     .append('title')
//     .text(d=>d.spending)
var symbolsize=6;
var pathCircle = d3.path()
pathCircle.arc(0, 0, symbolsize, 0,360)

var selfMadeSqare=(dsize)=>{return `M ${dsize} -${dsize} ${dsize} ${dsize} -${dsize} ${dsize} -${dsize} -${dsize} Z`}
var selfMadeDiamondshort=(dsize)=>{return `M 0 -${dsize} ${dsize} 0 0 ${dsize} -${dsize} 0 Z`}
var selfMadeTriangle=(dsize)=>{return `M 0 -${dsize} -${dsize} ${dsize} 0 ${dsize} ${dsize} ${dsize} Z`}

    d3.select(".svg1")
    .selectAll("circle")
    .append("g")
    .data(data)
    .enter()
    .append("path")
    .attr("d",d=>{
      if ((d.symboltype).toLowerCase()==="s") {return selfMadeSqare(symbolsize)}
      if ((d.symboltype).toLowerCase()==="t") {return selfMadeTriangle(symbolsize)}
      if ((d.symboltype).toLowerCase()==="c") {return pathCircle}
      if (d.symboltype.toLowerCase()==="d") {return selfMadeDiamondshort(symbolsize)}
                })
    .attr('transform', (d, i) =>`translate( ${xScale(d.year)}, ${yScale(d.spending)})`)
    .style("fill", d => color(d.media))
    .append('title')
    .text(d=>d.spending)
  
            
//******************************************y label
  svg1.append("g")
      .attr('class','value')
      .attr('transform',`translate( -40,${innerHeight/2})`)
      .append('text')
      .text('Mean number of ambulatory visits')
      .attr("transform", "rotate(-90)")
      .attr('fill', 'black')
      .attr("text-anchor", "middle")
      .style('font-size', fontsize)
      .style('font-family','Helvetica')
 
//*************************************** */ x label     
  var xlab=svg1.append('g')
  .attr('class','xlab')

  const labdata=["18.5 - <25","25 - <30","30 - <35","\u226535"]
  xlab.selectAll(".xlabtext").data(labdata)
  .enter()
    .append('text')
    .attr("class", "xlabtext")
  .text(d=>d)
  .style('font-size', fontsize)
  .style('font-weight', 300)
  .style('font-family','Helvetica')
  .style("text-anchor", "middle")
  .attr('dy', innerHeight)
  .attr('transform',(d,i)=> `translate( ${(innerWidth-offy)/3*i+offy}, 38)`)     

 
  //*******************************append legends
var legend = d3.select(".svg1")
.selectAll('g.legend')
.data(sumstat)
.enter()
  .append("g")
  .attr("class", "legend")
  



// legend.append("circle")
//     .attr("cx", widthA-150)
//     .attr('cy', (d, i) => i * 30 + 30)
//     .attr("r", 6)
//     .style("fill", d => color(d.key))

 legend.append("path")
        .attr("d",d=>{
          if ((d.key)==="Primary care") {return selfMadeSqare(symbolsize)}
          if ((d.key)==="Cardiology") {return selfMadeTriangle(symbolsize)}
          if ((d.key)==="Orthopedics") {return selfMadeDiamondshort(symbolsize)}
          if ((d.key)==="Pulmonology") {return selfMadeSqare(symbolsize)}
          if ((d.key)==="Rheumatology") {return selfMadeTriangle(symbolsize)}
          if ((d.key)==="Nephrology") {return selfMadeDiamondshort(symbolsize)}
          if ((d.key)==="Geriatrics") {return selfMadeSqare(symbolsize)}
          if ((d.key)==="Pain management") {return selfMadeTriangle(symbolsize)}
       
          return pathCircle
        })
        .style("fill", d => color(d.key))
        .attr("transform", (d,i)=> `translate( ${widthA-150}, ${i*30+30})`)
 

legend.append("text")
    .attr("x", widthA-130)
    .attr("y", (d, i) => i * 30 + 38)
    .text(d => d.key)
    .style("font-family", "Helvetica")


//************************************append title
d3.select(".svg1")
    .append("text")
    .attr("x", innerWidth/2+offy)
    .attr("y", innerHeight+70)
    .attr("text-anchor", "middle")
    .text("Body mass index (kg/m\xB2)")
    .style("fill", "black")
    .style('font-weight', 700)
    .style("font-size", 18)
    .style("font-family", "Helvetica")


  // svg.call(d3.zoom().on('zoom', (event)=>{
  //   svg.attr('transform',event.transform.rescaleY(y))
  // }))

  

//***********************************************download 
      const svgS=document.getElementById("svgx")
      const {x,y,width,height}=svgS.viewBox.baseVal;
      var svgData = document.getElementById("svgx").outerHTML;
      var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
      var svgUrl = URL.createObjectURL(svgBlob);
      const image=document.createElement('img');
      image.src=svgUrl
      //console.log(svgData)
    
      image.addEventListener('load', ()=>{
          const canvas=document.createElement('canvas')
          canvas.width=width;
          canvas.height=height;
          const context=canvas.getContext('2d')
          context.drawImage(image,x,y,width, height)
          //console.log('context',context)
          const link=document.getElementById('link');
          link.href=canvas.toDataURL();
          //console.log(link)
          URL.revokeObjectURL(svgUrl);
      })
    
    
      function printToCart2( ) {
        let popupWinindow;
        let innerContents = document.getElementById("svgx").outerHTML;
        popupWinindow = window.open();
        popupWinindow.document.open();
        popupWinindow.document.write('<body onload="window.print()">' + innerContents );
        popupWinindow.document.close();
      }
      document.querySelector("#download").onclick = function(){
      printToCart2()
      }

}

export default plotx