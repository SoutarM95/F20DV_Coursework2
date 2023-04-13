//DID NOT IMPLEMENT FULLY


// Set up the width and height of the SVG element
const Piewidth = 600;
const Pieheight = 600;

// Create the SVG element
const svg = d3.select("#chart-container svg")
  .attr("width", Piewidth)
  .attr("height", Pieheight);

// Load the data from the CSV file
d3.csv("https://raw.githubusercontent.com/SoutarM95/F20DV_Coursework2/main/data/population-and-demography-FullData.csv").then(data => {

  // Convert the population data to numbers
  data.forEach(d => {
    d.population = +d.population;
    d.year = +d.year; // add year as a number
  });

  // Define the color scale for the pie chart slices
  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.country))
    .range(d3.schemeCategory10);

  // Define the pie layout
  const pie = d3.pie()
    .value(d => d.population);

  // Define the arc generator for the pie chart slices
  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(Math.min(Piewidth, Pieheight) / 2 - 10);

  // Add a dropdown menu to select a year
  const years = [...new Set(data.map(d => d.year))]; // get unique years
  const yearDropdown = d3.select("#year-dropdown");
  yearDropdown.selectAll("option")
    .data(years)
    .enter()
    .append("option")
    .text(d => d)
    .attr("value", d => d);

  // Initialize the pie chart with the first year of data
  updatePieChart(years[0]);

  // Add an event listener to update the pie chart when the year dropdown changes
  yearDropdown.on("change", function() {
    const selectedYear = +this.value;
    updatePieChart(selectedYear);
  });

  // Define a function to update the pie chart based on the selected year
  function updatePieChart(year) {
    // Filter the data by the selected year
    const filteredData = data.filter(d => d.year === year);

    // Generate the pie chart data
    const pieData = pie(filteredData);

    // Create the pie chart slices
    const slices = svg.selectAll("path")
      .data(pieData);

    slices.enter()
      .append("path")
      .merge(slices)
      .attr("d", arc)
      .attr("fill", d => color(d.data.country))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .append("title")
      .text(d => `${d.data.country}: ${d.data.population.toLocaleString()} population`);

    slices.exit().remove();
  }

});
