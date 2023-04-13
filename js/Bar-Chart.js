// Define the dimensions of the SVG element
const Barwidth = 600;
const Barheight = 400;
const margin = { top: 20, right: 20, bottom: 30, left: 50 };
const innerWidth = Barwidth - margin.left - margin.right;
const innerHeight = Barheight - margin.top - margin.bottom;

// Create the SVG element and append it to the DOM
const svg = d3.select(".Bar-Chart")
  .append("svg")
  .attr("width", Barwidth)
  .attr("height", Barheight);

// Create a group element for the chart and apply margins
const chart = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data from the CSV file
d3.csv("https://raw.githubusercontent.com/SoutarM95/F20DV_Coursework2/main/data/population-and-demography-FullData.csv")
  .then(function(data) {

    // Convert the data strings to numbers
    data.forEach(function(d) {
      d.Year = +d.Year;
      d.Population = +d.Population;
    });

    // Set the scales for the x and y axes
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.Year))
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.Population))
      .range([innerHeight, 0]);

    // Create the line generator function
    const line = d3.line()
      .x(d => xScale(d.Year))
      .y(d => yScale(d.Population));

    // Add the line to the chart
    chart.append("path")
      .datum(data)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2);

    // Add the x and y axes
    chart.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

    chart.append("g")
      .call(d3.axisLeft(yScale));

    // Add a chart title
    svg.append("text")
      .attr("x", Barwidth / 2)
      .attr("y", margin.top)
      .attr("text-anchor", "middle")
      .text("World Population Over Time");

  })
  .catch(function(error) {
    console.log(error);
  });
