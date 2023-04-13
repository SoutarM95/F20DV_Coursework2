// Define some constants for the size of the chart and margins
const WIDTH = 800;
const HEIGHT = 500;

const SECONDWIDTH = 800;
const SECONDHEIGHT = 300;

const MARGIN = {
  top: 40,
  right: 30,
  bottom: 40,
  left: 100,
};

const SECOND_MARGIN = {
  top: 40,
  right: 40,
  bottom: 40,
  left: 400,
};

// Load the CSV data from a URL using D3's csv function
const csv = d3.csv(
  "https://raw.githubusercontent.com/SoutarM95/F20DV_Coursework2/main/data/population-and-demography-FullData.csv"
);

// Create an empty array to store the data for the selected country
var Increase = [];

// Create scales for the x and y axes
var x = d3.scaleTime().range([0, WIDTH]);
var y = d3.scaleLinear().range([HEIGHT, 0]);

// Create variables to store references to the two lines that will be drawn on the chart
var line, line2;

// Create an SVG element to hold the chart and set its size
var svg = d3
  .select(".Line-Chart")
  .append("svg")
  .attr("width", WIDTH + MARGIN.left + MARGIN.right)
  .attr("height", HEIGHT + MARGIN.top + MARGIN.bottom)
  .append("g")
  .attr("transform", "translate(" + MARGIN.left + "," + MARGIN.top + ")");

var sec = d3
.select(".Line-Chart")
 .append("svg")
 .attr("width", SECONDWIDTH - SECOND_MARGIN.left - SECOND_MARGIN.right)
 .attr("height", SECONDHEIGHT - SECOND_MARGIN.top - SECOND_MARGIN.bottom)
 .append("g")
 .attr("transform", "translate(" - SECOND_MARGIN.left - "," + SECOND_MARGIN.top - ")");



// Add a header element to the chart
d3.select(".Line-Chart")
  .append("h1")
  .text("Select Which Year to focus On.")
  .classed("Header", true);

// Create a second SVG element to hold the brush selector and set its size
var sec = d3
  .select(".Line-Chart")
  .append("svg")
  .attr("width", SECONDWIDTH + MARGIN.left + MARGIN.right)
  .attr("height", SECONDHEIGHT + MARGIN.top + MARGIN.bottom)
  .append("g")
  .attr("transform", "translate(" + MARGIN.left + "," + MARGIN.top + ")");

// Create scales for the x and y axes of the brush selector
var secX = d3.scaleTime().range([0, SECONDWIDTH]);
var secY = d3.scaleLinear().range([SECONDHEIGHT, 0]);

// Define a function to create the line chart for the selected country
const MakeLineChart = (Country, arr, svg) => {
  // Wait for the CSV data to be loaded before continuing
  csv.then((value) => {
    // Filter the data to only include the selected country
    for (var i = 0; i < value.length; i++) {
      if (value[i].Country === Country) {
        arr.push(value[i]);
      }
    }

    // Convert the year and population data to the correct data types
    arr.forEach(function (d) {
      d.Year = new Date(d.Year);
      d.Population = +d.Population;
    });

    // Sort the data by year in descending order
    arr.sort(function (a, b) {
      return new Date(b.Year) - new Date(a.Year);
    });

    // Set the domains for the x and y scales based on the data
    x.domain(
      d3.extent(arr, function (d) {
        return d.Year;
      })
    ).range([0, WIDTH]);
    y.domain([
      0,
      d3.max(arr, function (d) {
        return d.Population;
      }),
    ]).range([HEIGHT - MARGIN.bottom, MARGIN.top]);


    var LineValue = d3
      .line()
      .x(function (d) {
        return x(d.Year);
      })
      .y(function (d) {
        return y(d.Population);
      });

    line = svg
      .append("g")
      .attr("clip-path", "url(#clip)")
      .append("path")
      .data([arr])
      .attr("class", "line")
      .attr("d", LineValue)
      .attr("class", "lineOrange");

    svg
      .append("g")
      .attr("transform", `translate(0,${HEIGHT - MARGIN.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")).ticks(12))
      .attr("id", "xAxis")
      .attr("class", "axisBlack")
      .call((g) => g.selectAll(".tick text"));

    svg
      .append("g")
      .call(d3.axisRight(y).tickSize(WIDTH))
      .attr("id", "yAxis")
      .call((g) => g.select(".domain").remove())

      .call((g) =>
        g
          .selectAll(".tick:not(:first-of-type) line")
          .attr("stroke-dasharray", "5.0")
          .attr("stroke-opacity", 1)
          
      )
      .call((g) =>
        g.selectAll(".tick text").attr("x", -69).attr("color", "black")
      );
  });
};


const MakeTheSelector = (Country) => {
  // Call csv.then() method which returns a promise that resolves when the CSV file has been loaded and parsed
  csv.then((value) => {
    // Iterate through the CSV data
    for (var i = 0; i < value.length; i++) {
      // If the Country property of the current data object matches the input Country parameter, push it into the Increase array
      if (value[i].Country === Country) {
        Increase.push(value[i]);
      }
    }
    // Define a brush for the navigator chart using d3
    var brush = d3
      .brushX()
      .extent([
        [0, MARGIN.top],
        [SECONDWIDTH, SECONDHEIGHT - MARGIN.bottom],
      ]).on("end", brushed);


    // Convert the Year property of each data object in the Increase array into a Date object and cast the Population property as a number
    Increase.forEach(function (d) {
      d.Year = new Date(d.Year);
      d.Population = +d.Population;
    });

    // Sort the data objects in the Increase array in descending order by their Year property
    Increase.sort(function (a, b) {
      return new Date(b.Year) - new Date(a.Year);
    });

    // Define scales for the navigator chart using d3
    secX
      .domain(
        d3.extent(Increase, function (d) {
          return d.Year;
        })
      ).range([0, SECONDWIDTH]);
    secY
      .domain([
        0,
        d3.max(Increase, function (d) {
          return d.Population;
        }),
      ]).range([SECONDHEIGHT - MARGIN.bottom, MARGIN.top]);

    // Define a line generator for the navigator chart using d3
    var LineValue = d3
      .line()
      .x(function (d) {
        return secX(d.Year);
      })
      .y(function (d) {
        return secY(d.Population);
      });

      // Create a group element for the navigator chart and add a clip path to it
      // Append a path element to the group element and bind the data in the Increase array to it
      // Set the class of the path element to "line" and "lineOrange"
      // Set the "d" attribute of the path element to the result of LineValue(Increase)
      line2 = sec
      .append("g")
      .attr("clip-path", "url(#clip)")
      .append("path")
      .data([Increase])
      .attr("class", "line")
      .attr("d", LineValue)
      .attr("class", "lineOrange");


     // Append a brush element to the line chart and the navigator chart
    line2.append("g").attr("class", "brush").call(brush);
    sec.append("g").attr("class", "brush").call(brush);


    // Define a function called brushed that takes an event object as a parameter
 // This function is called when the user interacts with the brush selector on the line chart.
function brushed(event) {
  // Get the current selection of the brush
  const selection = event.selection;

  // If there is no selection, reset the x domain to show all data.
  if (!selection) {
    d3.extent(Increase, function (d) {
      return d.Year;
    });
  } else {
    // Otherwise, update the x domain to match the brush selection.
    x.domain([x.invert(selection[0]), x.invert(selection[1])]);
    
    // Reset the brush selection.
    sec.select(".brush").call(brush.move, null);
  }

  // Update the x-axis with the new domain.
  svg
    .selectAll("#xAxis")
    .transition()
    .duration(800)
    .call(d3.axisBottom(x));

  // Update the line chart with the new x domain.
  line
    .transition()
    .duration(800)
    .attr(
      "d",d3
        .line()
        .x(function (d) {
          return x(d.Year);
        })
        .y(function (d) {
          return y(d.Population);
        })
    );
}

    sec
      .append("g")
      .attr("transform", `translate(0,${SECONDHEIGHT - MARGIN.bottom})`)
      .call(d3.axisBottom(secX).tickFormat(d3.timeFormat("%b %y")).ticks(10))
      .attr("id", "secXAxis")
      .attr("class", "axisBlack")
      .call((g) => g.selectAll(".tick text"));

    sec
      .append("g")
      .call(d3.axisRight(secY).tickSize(SECONDWIDTH))
      .attr("id", "secYAxis")
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick:not(:first-of-type) line")
          .attr("stroke-dasharray", "5.0")
          .attr("stroke-opacity", 1)
          
      )
      .call((g) =>
        g.selectAll(".tick text").attr("x", -69).attr("color", "black")
      );
  });

  // add a reset button which resets domains of charts
  d3.select(".Line-Chart")
    .append("button")
    .text("reset")
    .on("click", function (d) {
      x.domain(
        d3.extent(Increase, function (d) {
          return d.Year;
        })
      );
      d3.select("#xAxis").transition().duration(1000).call(d3.axisBottom(x));
      line
        .transition()
        .duration(1000)
        .attr(
          "d",
          d3
            .line()
            .x(function (d) {
              return x(d.Year);
            })
            .y(function (d) {
              return y(d.Population);
            })
        );
    });
};


// create line chart and navigator
MakeLineChart("Asia (UN)", Increase, svg);
MakeTheSelector("Asia (UN)");
