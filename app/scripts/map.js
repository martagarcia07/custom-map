function setMap() {
	// Load map data
	d3.json(geojson, function(error, mapData) {
		//concatenate both files to display points and map borders
		d3.json(carto, function(error2, mapData2) {
		
	  	    data=mapData.features;
	  	    data = data.concat(mapData2.features);
	  	    mapData['features']=data;
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
		        .on('mouseover', mouseover)
		        .on('mouseout', mouseout)
	  			.on('wheel', wheel)
		        .on('click', clicked);
		});
	});
}