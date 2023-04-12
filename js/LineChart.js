d3.csv("https://raw.githubusercontent.com/SoutarM95/F20DV_Coursework2/main/data/world_population.csv?token=GHSAT0AAAAAAB55H2DWZUIPQJ4HXB5A23PKZBWTAVA")
.then(function(data) {
        
        // Convert string data to numbers
        data.forEach(function(d) {
          d.Year = +d.Year;
          d.Population = +d.Population;
        });

        // Set the dimensions and margins of the chart
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };
        const Linewidth = 600 - margin.left - margin.right;
        const Lineheight = 400 - margin.top - margin.bottom;

        // Append the svg object to the body of the page
        const svg = d3.select("svg")
          .attr("width", Linewidth + margin.left + margin.right)
          .attr("height", Lineheight + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Add X axis --> it is a date format
        const x = d3.scaleLinear()
          .domain(d3.extent(data, d => d.Year))
          .range([0, Linewidth]);
        svg.append("g")
          .attr("transform", "translate(0," + Lineheight + ")")
          .call(d3.axisBottom(x));

        // Add Y axis
        const y = d3.scaleLinear()
          .domain([0, d3.max(data, d => d.Population)])
          .range([Lineheight, 0]);
        svg.append("g")
          .call(d3.axisLeft(y));

        // Add the line
        svg.append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 2)
          .attr("d", d3.line()
            .x(d => x(d.Year))
            .y(d => y(d.Population))
          )
          .transition()
          .duration(2000) // adjust the duration to control the speed of the animation
          .attrTween("d", function(d) {
              var previous = d3.select(this).attr("d");
              var current = d3.line()
                  .x(function(d) { return x(d.Year); })
                  .y(function(d) { return y(d.Population); })(d);
              return d3.interpolatePath(previous, current);
          });
        
        svg.select(".x-axis")
          .transition()
          .duration(1000) // adjust the duration to control the speed of the animation
          .call(d3.axisBottom(x));

        svg.select(".y-axis")
          .transition()
          .duration(1000) // adjust the duration to control the speed of the animation
          .call(d3.axisLeft(y));

        svg.select(".line")
          .transition()
          .duration(1000) // adjust the duration to control the speed of the animation
          .attr("stroke", function(d) {
        // Replace "steelblue" with a function that returns a color based on the data
          return "steelblue";
    });


  })




      
