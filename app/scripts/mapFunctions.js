// on drag option
var index=20; // the bigger the slower motion
var drag = d3.behavior.drag()
    .on("dragstart", function() {
    // Adapted from http://mbostock.github.io/d3/talk/20111018/azimuthal.html and updated for d3 v3
      var proj = projection.rotate();
      m0 = [d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY];
      o0 = [-proj[0],-proj[1]];
    })
    .on("drag", function() {
      if (m0) {
        var m1 = [d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY],
            o1 = [o0[0] + (m0[0] - m1[0]) / index, o0[1] + (m1[1] - m0[1]) / index];
        projection.rotate([-o1[0], -o1[1]]);
      }
    // Update the map
      path = d3.geo.path()
        .projection(projection)
        .pointRadius(radius);

      d3.selectAll("path").attr("d", path);
    });

// Define color scale
var projection = d3.geo.mercator()
    .scale(scale)
    // Customize the projection to make the center of Thailand become the center of the map
    .rotate([-located[1],-located[0]])
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection)
    .pointRadius(radius);

var zoom = d3.behavior.zoom()
    .translate(projection.translate())
    .scale(projection.scale())
    .scaleExtent([height, 8 * height])
    .on("zoom", zoomed);

// Set svg width & height
var svg = d3.select('#custom-map')
    .attr('width', width)
    .attr('height', height);
// Add background
svg.append('rect')
    .attr('class', 'background')
    .attr('width', width)
    .attr('height', height)
    .on('click', clicked)
    .on('wheel', wheel)
    .call(drag)
    .call(zoom);
var g = svg.append('g');
//var effectLayer = g.append('g')
//    .classed('effect-layer', true);
var mapLayer = g.append('g')
    .classed('map-layer', true);
var bigText = g.append('text')
    .classed('big-text', true)
    .style('font-size',20/scaleWheel+'px')
    .attr('x', 280)
    .attr('y', 230);

// Get province color
function fillFn(d){
	  if (d.geometry.type=="Point"){		  		
        return fillColor;
  	}else{
  		  return color(nameLength(d));
  	}
}

function fillWidthFn(d){
	  if (d.geometry.type!="MultiPolygon" && d.geometry.type!="Polygon"){
		  return fillWidth;
	  }
}
function strokeFn(d){
    if (d.geometry.type!="MultiPolygon" && d.geometry.type!="Polygon"){
  		  return strokeColor;
  	}
}
		
// When clicked, zoom in/out
function clicked(d) {
    var x, y, k;
    // Compute centroid of the selected path
    if (d && d.geometry.type!="MultiPolygon"  && d.geometry.type!="Polygon"){
        // if point scale to 1
        if (d && centered !== d) {
            var centroid = path.centroid(d);
            x = centroid[0];
            y = centroid[1];
            k = 4;
            centered = d;
        } else {
            x = width / 2;
            y = height / 2;
            k = 1;
            centered = null;
        }
        mapLayer.selectAll('path')
          .style('fill', function(d){return centered && d===centered ? '#D5708B' : fillFn(d);});
        // Zoom
        g.transition()
          .duration(750)
          .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')');
        g.selectAll('text')
            .style('font-size', function(d){return 20/k+'px';})
            .attr('x', x)
            .attr('y', y);          
    } else {
        //if country polygon scale to fit the area
        var centroid = path.centroid(d);
        x = centroid[0];
        y = centroid[1];
        //zoom proportion to country area more or less..
        var b = path.bounds(d),
            scale = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
            translation = [(width - scale * (b[1][0] + b[0][0])) / 2, (height - scale * (b[1][1] + b[0][1])) / 2];

        centered = d;
        // Highlight the clicked province
        mapLayer.selectAll('path')
            .style('fill', function(d){return centered && d===centered ? '#D5708B' : fillFn(d);});
        // Zoom
        g.transition()
            .duration(750)
            .attr('transform', 'translate(' + translation +  ')scale(' + scale + ')');
        g.selectAll('text')
            .style('font-size', function(d){return 20/scale+'px';})
            .attr('x', x)
            .attr('y', y);
    }


}
function zoomed() {
    projection.translate(d3.event.translate).scale(d3.event.scale);
    g.selectAll("path").attr("d", path);
    g.selectAll('text')
     .style('font-size', function(d){ return d3.event.scale+'px';})
      .attr('x', x)
      .attr('y', y);
}
function wheel(d) {
	  event.preventDefault();
	  event.stopPropagation();
    var x, y, k;
    // Compute centroid of the selected path
    if (d ) {
        var centroid = path.centroid(d);
        x = centroid[0];
        y = centroid[1];
        
        if (event.deltaY >0 && scaleWheel > 1){
          	scaleWheel = scaleWheel-1;
        }else if (event.deltaY >0 && scaleWheel <= 1 && scaleWheel >0.1){
        	  scaleWheel=scaleWheel/2;      	
        }else if (event.deltaY < 0 ){
        	  scaleWheel = scaleWheel+1;
        }
        centered = d;
    } 
  
  g.transition()
	    .duration(750) // rotate
	    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + scaleWheel + ')translate(' + -x + ',' + -y + ')');
  g.selectAll('text')
      .style('font-size', function(d){ return 20/scaleWheel+'px';})
      .attr('x', x)
      .attr('y', y);
}
function mouseover(d){
    // Highlight hovered province
    d3.select(this).style('fill', '#b266ff');
    // Draw effects
    if (labels){
      	textArt(nameFn(d));
    }
    g.selectAll('text')
        .style('font-size', function(d){ return 20/scaleWheel+'px';})
        .attr('x', x)
        .attr('y', y);    
}
function mouseout(d){
    // Reset province color
    mapLayer.selectAll('path')
        .style('fill', function(d){return centered && d===centered ? '#D5708B' : fillFn(d);});

    bigText.text('');
}
var BASE_FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function textArt(text){
    // Use random font
    var fontFamily = BASE_FONT;
    bigText
        .style('font-family', fontFamily)
        .text(text);
}