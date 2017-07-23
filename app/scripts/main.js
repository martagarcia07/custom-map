(function() {
	getLocation();
	document.getElementById ("palette").addEventListener ("click", tooglePalette, false);
	document.getElementById ("fill-color").addEventListener ("change", setFillColor, false);
	document.getElementById ("fill-num").addEventListener ("change", setFillNum, false);
	document.getElementById ("stroke").addEventListener ("change", setStrokeNum, false);
	document.getElementById ("stroke-color").addEventListener ("change", setStrokeColor, false);
	document.getElementById ("blending").addEventListener ("change", setBlending, false);
	document.getElementById ("labels").addEventListener ("change", setLabels, false);
    
    var strokeWidth=1;
    var strokeColor="black";
    var fillWidth=1;
    var fillColor="white";
    var blendy="multiply";
    var labels = false;


    var selectedColor ;
	var scale=1300;
	var location=[40.416879, -3.703351];
	var carto='/assets/cartodb-query.geojson'
	var geojson	='/assets/custom.geo.json'
	var width = 700,
	    height = 420,
	    centered;
	 
	setMap();

	function setStrokeNum(){
		d3.selectAll("path").style("stroke-width", stNum);
		strokeWidth=event.target.value;
	}
	function stNum(d){
		if (d.geometry.type=="Point"){		  		
			return event.target.value;
		}else{
			return 1;
		}
	}
	function setStrokeColor(){
		strokeColor=event.target.value;
		d3.selectAll("path").style("stroke", fillStroke);

	}
	function setFillNum(){
		d3.selectAll("path").style("width", event.target.value)
		fillWidth=event.target.value;
	}
	function fillStroke(d){
		if (d.geometry.type=="Point"){		  		
			return event.target.value;
		}else{
		  	return "black";
		}
	}	
	function setFillColor(){
		fillColor=event.target.value;
		d3.selectAll("path").style("fill", fill);

	}
	function fill(d){
		if (d.geometry.type=="Point"){		  		
			return event.target.value;
		}else{
		  	return color(nameLength(d));
		}
	}
	function setFillNum(){
		fillWidth=event.target.value;
		d3.selectAll("path").style("cx", event.target.value);
		d3.selectAll("path").style("cy", event.target.value);
		d3.selectAll("path").style("r", event.target.value);

	}
	function setStroke(){
	d3.selectAll("path").style("fill", "blue")
		
	}
	function setBlending(){
	d3.selectAll("path").style("fill", "blue")
		
	}
	function setLabels(){
		debugger

		if (event.target.checked==true){ 
			labels=true;
		}else{
			labels=false;
		}
		
	}

	function tooglePalette(event){
		if (event.target.parentElement.style.width=="300px"){
			event.target.parentElement.style.width="20px";
			event.target.parentElement.style.height="22px";
		}else{
			event.target.parentElement.style.width="300px";
			event.target.parentElement.style.height="400px";
		}
	}

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
/*************************************************************/
	function setMap() {

 
		// Define color scale

		var projection = d3.geo.mercator()
		  .scale(scale)
		  // Customize the projection to make the center of Thailand become the center of the map
		  .rotate([+3.703351,-40.416879])
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
		  .on('wheel', wheel);
		var g = svg.append('g');
		var effectLayer = g.append('g')
		  .classed('effect-layer', true);
		var mapLayer = g.append('g')
		  .classed('map-layer', true);
		var bigText = g.append('text')
		  .classed('big-text', true)
		  .attr('x', 20)
		  .attr('y', 45);
		// Load map data
		//svg.symbol().type('triangle-up');
		d3.json(geojson, function(error, mapData) {
			//concatenate both files to display points and map borders
			d3.json(carto, function(error2, mapData2) {
			
		  	    var tmp=mapData.features;
		  	    tmp = tmp.concat(mapData2.features);
		  	    mapData['features']=tmp;
			    var features = mapData.features;
			    // Update color scale domain based on data
			    color.domain([0, d3.max(features, nameLength)]);
			    // Draw each province as a path
			    mapLayer.selectAll('path')
			        .data(features)
			        .enter().append('path')
			        .attr('d', path)
			        .attr('vector-effect', 'non-scaling-stroke')
			        .style('fill', fillFn)
			        .style('size', fillWidthFn)
			        .style('stroke', strokeFn)
			        .style('stroke-width', widthFn)
			        .on('mouseover', mouseover)
			        .on('mouseout', mouseout)
		  			.on('wheel', wheel)
			        .on('click', clicked);
			});
		});
		// Get country name

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

		    scale = parseInt((109-(Math.sqrt(path.area(d))))/13 )>0?parseInt((109-(Math.sqrt(path.area(d))))/13 ):1;
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

	}
	function getLocation() {
	    if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(setPosition);
	    }
	}

	function setPosition(position){
		location=[position.coords.latitude,position.coords.longitude];
	}

}());