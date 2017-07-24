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
		            o1 = [o0[0] + (m0[0] - m1[0]) / 20, o0[1] + (m1[1] - m0[1]) / 20];
		        projection.rotate([-o1[0], -o1[1]]);
		      }
		    // Update the map
		      path = d3.geo.path().projection(projection);
		      d3.selectAll("path").attr("d", path);
		    });
		// Define color scale

		var projection = d3.geo.mercator()
		  .scale(scale)
		  // Customize the projection to make the center of Thailand become the center of the map
		  .rotate([-located[1],-located[0]])
		  .translate([width / 2, height / 2]);
		var path = d3.geo.path()
		  .projection(projection);
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
		  .call(drag);
		var g = svg.append('g');
		var effectLayer = g.append('g')
		  .classed('effect-layer', true);
		var mapLayer = g.append('g')
		  .classed('map-layer', true);
		var bigText = g.append('text')
		  .classed('big-text', true)
		  .attr('x', 20)
		  .attr('y', 45);
		// Get province color
		function fillFn(d){
			if (d.geometry.type=="Point"){		  		
		  		return fillColor;
		  	}else{
		  		return color(nameLength(d));
		  	}
		}
		function fillWidthFn(d){
			if (d.geometry.type!="MultiPolygon"){
				return fillWidth;
			}
		}
		function strokeFn(d){
			if (d.geometry.type!="MultiPolygon"){
		  		return strokeColor;
		  	}
		}
		function widthFn(d){
			if (d.geometry.type!="MultiPolygon"){
		  		return strokeWidth || "0";
		  	}
		}
				
		// When clicked, zoom in
		function clicked(d) {
		  var x, y, k;
		  // Compute centroid of the selected path
		  if (d && centered !== d) {
		    var centroid = path.centroid(d);
		    x = centroid[0];
		    y = centroid[1];
		    //k = 4;
		    //zoom proportion to country area more or less..

		    scale = ((109-(Math.sqrt(path.area(d))))/13 )>0?parseInt((109-(Math.sqrt(path.area(d))))/13 ):1;
		    centered = d;
		  } else {
		    x = width / 2;
		    y = height / 2;
		    scale = 1;
		    centered = null;
		  }
		  // Highlight the clicked province
		  mapLayer.selectAll('path')
		    .style('fill', function(d){return centered && d===centered ? '#D5708B' : fillFn(d);});
		  // Zoom
		  g.transition()
		    .duration(750)
		    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + scale + ')translate(' + -x + ',' + -y + ')');
		d3.selectAll("path").attr("r", 5/1000)

		
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
              if (event.deltaY >0 && scale > 1){
              	scale = scale-1;
              }else if (event.deltaY < 0 ){
              	scale = scale+1;
              }
              centered = d;
            } else {
              x = event.pageX - (document.body.offsetWidth-event.target.width.baseVal.value)/2 //width / 2 + event.target.width.baseVal.value;
              y = event.pageY - (document.body.offsetHeight-event.target.height.baseVal.value)/2 
              if (event.deltaY >0 && scale > 1){
              	scale = scale-1;
              }else if (event.deltaY >0 && scale <= 1 && scale >0.1){
              	scale=scale/2;
              }else if (event.deltaY < 0 ){
              	scale = scale+1;
              }
           	  centered = null;
            }
			  // Zoom
		    g.transition()
			    .duration(750)
			    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + scale + ')translate(' + -x + ',' + -y + ')');
		
		}
		function mouseover(d){
		  // Highlight hovered province
		  d3.select(this).style('fill', '#b266ff');
		  // Draw effects
		  if (labels){
		  	textArt(nameFn(d));
		  }
		}
		function mouseout(d){
		  // Reset province color
		  mapLayer.selectAll('path')
		    .style('fill', function(d){return centered && d===centered ? '#D5708B' : fillFn(d);});
		  // Remove effect text
		  effectLayer.selectAll('text').transition()
		    .style('opacity', 0)
		    .remove();
		  // Clear province name
		  bigText.text('');
		}
		// Gimmick
		// Just me playing around.
		// You won't need this for a regular map.
		var BASE_FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

		function textArt(text){
		  // Use random font
		  var fontFamily = BASE_FONT;
		  bigText
		    .style('font-family', fontFamily)
		    .text(text);

		  // Generate the positions of the text in the background

		  var positions = [];
		  var rowCount = 0;
		  var selection = effectLayer.selectAll('text')
		    .data(positions, function(d){return d.text+'/'+d.index;});
		  // Clear old ones
		  selection.exit().transition()
		    .style('opacity', 0)
		    .remove();
		  // Create text but set opacity to 0
		  selection.enter().append('text')
		    .text(function(d){return d.text;})
		    .attr('x', function(d){return d.x;})
		    .attr('y', function(d){return d.y;})
		    .style('font-family', fontFamily)
		    .style('fill', '#777')
		    .style('opacity', 0);
		  selection
		    .style('font-family', fontFamily)
		    .attr('x', function(d){return d.x;})
		    .attr('y', function(d){return d.y;});
		  // Create transtion to increase opacity from 0 to 0.1-0.5
		  // Add delay based on distance from the center of the <svg> and a bit more randomness.
		  selection.transition()
		    .delay(function(d){
		      return d.distance * 0.01 + Math.random()*1000;
		    })
		    .style('opacity', function(d){
		      return 0.1 + Math.random()*0.4;
		    });
		}