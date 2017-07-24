var strokeWidth=1;
var strokeColor="black";
var fillWidth=1;
var fillColor="white";
var blendy="multiply";
var labels = false;
var data;

var selectedColor ;
var scale=1400;
var scaleWheel=1;
var scalePoint=1500;

var located=[40.416879, -3.703351];
var carto='/assets/cartodb-query.geojson'
var geojson	='/assets/custom.geo.json'
var width = 700,
    height = 470,
    centered;
 
function nameFn(d){
  return d && d.properties ? d.properties.name : null;
}
// Get province name length
function nameLength(d){
  var n = nameFn(d);
  return n ? n.length : 0;
}
var color = d3.scale.linear()
  .domain([1, 20])
  .clamp(true)
  .range(['#fff', '#000000']);	
  