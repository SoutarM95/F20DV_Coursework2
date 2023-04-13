// Define some constants for the size of the chart and margins
const MAPWIDTH = 600;
const MAPHEIGHT = 500;

const MAP = d3
  .select(".World-Map")
  .append("svg")
  .attr("class", ".World-Map")
  .attr("width", MAPWIDTH)
  .attr("height", MAPHEIGHT);

  const MAPSVG = d3
  .select(".World-Map")
  .append("svg")
  .attr("class", ".World-Map")
  .attr("width", 400)
  .attr("height", 800);

const PROJECTION = d3
  .geoMercator()
  .scale(100)
  .translate([MAPWIDTH / 2, MAPHEIGHT / 1.8]);

const PATH = d3.geoPath(PROJECTION);

  // declare map grouping
const MAPG = MAP.append("g");
  
  // global temp storage
var arr = [];
  
  // callback function when selecting country
  function CountrySELECT(Country) {
    for (var i = 0; i < arr.length; i++) {
      // if country matches any in storage update components
      if (arr[i].Country === Country) {
        MakeLineChart(Country, Increase, svg);
        MakeTheSelector(Country, Increase);
      }
    }
    // add selected class to country on map
    d3.select(".selected").classed("selected", false);
    d3.select(`[name=${Country.replace(/\s/g, "")}]`).classed("selected", true);
  }

function MakeMap(){
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
    .then((data) => {
    }))
}