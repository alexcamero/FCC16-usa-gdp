// FETCH THE DATA

const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

fetch(url)
.then(response => response.json())
.then(data => {
  const parseTime = d3.timeParse("%Y-%m-%d");
  let GDP = data["data"]
  .map(d => {
    return {
      "data-date": d[0],
      "data-time": parseTime(d[0]),
      "data-gdp": d[1]
    };
  });
  
  // MAKE THE CHART
  
  const H = 500;
  const W = 800;
  const pad = 50;

  const svg = d3.select("body")
  .append("svg")
  .attr("width",W)
  .attr("height",H)
  
  const xScale = d3.scaleTime().domain([d3.min(GDP, (d) => d["data-time"]),d3.max(GDP, (d) => d["data-time"])]).range([pad,W-pad]);
  
  
  
  const yScale = d3.scaleLinear();
  yScale.domain([0,d3.max(GDP, (d) => d["data-gdp"])]);
  yScale.range([H-pad,pad]);
  
   svg
  .selectAll("rect")
  .data(GDP)
  .enter()
  .append("rect")
  .attr("data-date", (d) => d['data-date'])
  .attr("data-gdp", (d) => d['data-gdp'])
  .attr("y",(d) => yScale(d['data-gdp']))
  .attr("x", (d) => xScale(d['data-time']))
  .attr("height", (d) => H - pad - yScale(d['data-gdp']))
  .attr("width", ((W-2*pad)/GDP.length))
  .attr("fill", "black")
  .attr("class", "bar")
  .on("mouseover", handleMouseOver)
  .on("mouseout", handleMouseOut);
  
  
  const xAxis = d3.axisBottom(xScale)
  .ticks(d3.timeYear.every(5), '%Y');
  
  const yAxis = d3.axisLeft(yScale)
  .ticks(10);
  
  svg.append("g")
  .attr("id","x-axis")
  .attr("transform", `translate(0, ${H-pad})`)
  .call(xAxis);
  
  svg.append("g")
  .attr("id","y-axis")
  .attr("transform", `translate(${pad},0)`)
  .call(yAxis);
  
  svg.append("text")
  .text("Gross Domestic Product")
  .attr("transform", `translate(${pad + 20},${pad + 170}) rotate(-90)`);
  
  svg.append("text")
  .text("US GDP")
  .attr("id", "title")
  .attr("x", W/2)
  .attr("y", pad)
  .attr("text-anchor","middle")
  .style("font-size", 40);
  
  const tooltip = d3.select("body").append("div")
  .attr("id", "tooltip");
  
  function handleMouseOver(event) {
    const date = d3.select(this).attr("data-date");
    const gdp = d3.select(this).attr("data-gdp");
    tooltip
    .attr("data-date", date)
    .html(`<h2>${date}:</h2><h3>${gdp}</h3>`)
    .style("display","flex")
    .style("left", `${event.pageX + 30}px`);
  }
  
  function handleMouseOut() {
    tooltip
    .style("display","none");
  }
  
  
});