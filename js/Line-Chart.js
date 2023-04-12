const WIDTH = 800;
const HEIGHT = 500;
const MINIWIDTH = 800;
const MINIHEIGHT = 300;


const MARGIN = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10,
};


const csv = d3.csv(
  "https://raw.githubusercontent.com/SoutarM95/F20DV_Coursework2/main/data/population-and-demography-FullData.csv"
  );


var Increase = [];

var x = d3.scaleTime().range([0, WIDTH]);
var y = d3.scaleLinear().range([HEIGHT, 0]);
var line, line2;


var svg = d3
  .select(".Line-Chart")
  .append("svg")
  .attr("width", WIDTH + MARGIN.left + MARGIN.right)
  .attr("height", HEIGHT + MARGIN.top + MARGIN.bottom)
  .append("g")
  .attr("transform", "translate(" + MARGIN.left + "," + MARGIN.top + ")");


d3.select(".Line-Chart")
  .append("h1")
  .text("Select Which Year to focus On")
  .classed("Header", true);


var mini = d3
  .select(".Line-Chart")
  .append("svg")
  .attr("width", MINIWIDTH + MARGIN.left + MARGIN.right)
  .attr("height", MINIHEIGHT + MARGIN.top + MARGIN.bottom)
  .append("g")
  .attr("transform", "translate(" + MARGIN.left + "," + MARGIN.top + ")");

var miniX = d3.scaleTime().range([0, MINIWIDTH]);
var miniY = d3.scaleLinear().range([MINIHEIGHT, 0]);

const MakeLineChart = (Country, arr, svg) => {
  csv.then((value) => {
    for (var i = 0; i < value.length; i++) {
      if (value[i].Country === Country) {
        arr.push(value[i]);
      }
    }

    arr.forEach(function (d) {
      d.Year = new Date(d.Year);
      d.Population = +d.Population;
    });

    arr.sort(function (a, b) {
      return new Date(b.Year) - new Date(a.Year);
    });

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
          .attr("stroke-opacity", 1)
          .attr("stroke-dasharray", "3.0")
      )
      .call((g) =>
        g.selectAll(".tick text").attr("x", -70).attr("color", "black")
      );
  });
};


const MakeTheSelector = (Country) => {
  csv.then((value) => {
    for (var i = 0; i < value.length; i++) {
      if (value[i].Country === Country) {
        Increase.push(value[i]);
      }}

    var brush = d3
      .brushX()
      .extent([
        [0, MARGIN.top],
        [MINIWIDTH, MINIHEIGHT - MARGIN.bottom],
      ]).on("end", brushed);

    Increase.forEach(function (d) {
      d.Year = new Date(d.Year);
      d.Population = +d.Population;
    });


    Increase.sort(function (a, b) {
      return new Date(b.Year) - new Date(a.Year);
    });


    miniX
      .domain(
        d3.extent(Increase, function (d) {
          return d.Year;
        })
      )
      .range([0, MINIWIDTH]);
    miniY
      .domain([
        0,
        d3.max(Increase, function (d) {
          return d.Population;
        }),
      ])
      .range([MINIHEIGHT - MARGIN.bottom, MARGIN.top]);

    var LineValue = d3
      .line()
      .x(function (d) {
        return miniX(d.Year);
      })
      .y(function (d) {
        return miniY(d.Population);
      });

    line2 = mini
      .append("g")
      .attr("clip-path", "url(#clip)")
      .append("path")
      .data([Increase])
      .attr("class", "line")
      .attr("d", LineValue)
      .attr("class", "lineOrange");


    line2.append("g").attr("class", "brush").call(brush);
    mini.append("g").attr("class", "brush").call(brush);

    function brushed(event) {
      const selection = event.selection;

      if (!selection) {
        d3.extent(Increase, function (d) {
          return d.Year;
        });
      } else {
        x.domain([x.invert(selection[0]), x.invert(selection[1])]);
 
        mini.select(".brush").call(brush.move, null);
      }

      svg
        .selectAll("#xAxis")
        .transition()
        .duration(1000)
        .call(d3.axisBottom(x));

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
    }

    mini
      .append("g")
      .attr("transform", `translate(0,${MINIHEIGHT - MARGIN.bottom})`)
      .call(d3.axisBottom(miniX).tickFormat(d3.timeFormat("%b %y")).ticks(12))
      .attr("id", "miniXAxis")
      .attr("class", "axisBlack")
      .call((g) => g.selectAll(".tick text"));

    mini
      .append("g")
      .call(d3.axisRight(miniY).tickSize(MINIWIDTH))
      .attr("id", "miniYAxis")
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick:not(:first-of-type) line")
          .attr("stroke-opacity", 1)
          .attr("stroke-dasharray", "3.0")
      )
      .call((g) =>
        g.selectAll(".tick text").attr("x", -70).attr("color", "black")
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

