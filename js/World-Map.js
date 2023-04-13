//DID NOT IMPLEMENT FULLY

// Define the dimensions of the SVG container
const WorldMapwidth = 960;
const WorldMapheight = 600;

// Create the SVG container
const svg = d3.select(".World-Map")
  .append('svg')
  .attr('width', WorldMapwidth)
  .attr('height', WorldMapheight);

// Define a projection for the map
const projection = d3.geoMercator()
  .scale(130)
  .translate([WorldMapwidth / 2, WorldMapheight / 1.5]);

// Define a path generator for the map
const path = d3.geoPath()
  .projection(projection);

// Load the world map data
d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
  .then(function(worldData) {
    // Load the population data
    d3.csv('https://raw.githubusercontent.com/SoutarM95/F20DV_Coursework2/main/data/population-and-demography-FullData.csv')
      .then(function(popData) {
        // Merge the population data with the map data
        const mergedData = mergeData(worldData, popData);

        // Draw the map
        svg.selectAll('path')
          .data(mergedData.features)
          .enter()
          .append('path')
          .attr('d', path)
          .style('fill', function(d) {
            return color(d.properties.population);
          })
          .on('mouseover', function(d) {
            tooltip.html(d.properties.name + '<br/>' + d.properties.population.toLocaleString())
              .style('left', (d3.event.pageX + 10) + 'px')
              .style('top', (d3.event.pageY + 10) + 'px')
              .style('display', 'block');
          })
          .on('mouseout', function() {
            tooltip.style('display', 'none');
          });

        // Define a color scale for the population data
        const color = d3.scaleThreshold()
          .domain([100000, 1000000, 10000000, 100000000, 1000000000])
          .range(d3.schemeBlues[6]);

        // Define a tooltip for the map
        const tooltip = d3.select(".World-Map")
          .append('div')
          .attr('class', 'tooltip');
      });
  });

    // Function to merge the population data with the map data
function mergeData(worldData, popData) {
  popData.forEach(function(d) {
    const country = worldData.features.find(function(f) {
      return f.properties.name === d.country;
    });
    if (country) {
      country.properties.population = +d.population;
    }
  });
  return worldData;
}

// Define a color scale for the population data
const color = d3.scaleThreshold()
  .domain([100000, 1000000, 10000000, 100000000, 1000000000])
  .range(d3.schemeBlues[6]);

// Draw the legend for the color scale
const legend = svg.append('g')
  .attr('class', 'legend')
  .attr('transform', 'translate(20, 20)');

legend.append('text')
  .attr('x', 0)
  .attr('y', -10)
  .text('Population');

const legendItems = legend.selectAll('g')
  .data(color.range().map(function(d) {
    const colorRange = color.invertExtent(d);
    if (!colorRange[0]) colorRange[0] = 0;
    return {
      color: d,
      value: colorRange
    };
  }))
  .enter()
  .append('g')
  .attr('transform', function(d, i) {
    return 'translate(0,' + (i * 20) + ')';
  });

legendItems.append('rect')
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', 15)
  .attr('height', 15)
  .style('fill', function(d) {
    return d.color;
  });

legendItems.append('text')
  .attr('x', 20)
  .attr('y', 10)
  .text(function(d) {
    return d.value[0].toLocaleString() + ' - ' + d.value[1].toLocaleString();
  });

