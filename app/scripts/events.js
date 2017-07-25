function setEvents(){
	document.getElementById ("palette").addEventListener ("click", tooglePalette, false);
	document.getElementById ("fill-color").addEventListener ("change", setFillColor, false);
	document.getElementById ("fill-num").addEventListener ("change", setFillNum, false);
	document.getElementById ("stroke").addEventListener ("change", setStrokeNum, false);
	document.getElementById ("stroke-color").addEventListener ("change", setStrokeColor, false);
	document.getElementById ("labels").addEventListener ("change", setLabels, false);

}

function setFillNum(){
	//0.5 scale radius
	radius = event.target.value/2;
	var path = d3.geo.path()
  		.projection(projection)
  		.pointRadius(radius);

	d3.geo.path().projection(projection);
    d3.selectAll("path").attr("d", path);  

}
// on icon click expand palette
function tooglePalette(event){
	if (event.target.parentElement.style.width=="300px"){
		event.target.parentElement.style.width="20px";
		event.target.parentElement.style.height="22px";
	}else{
		event.target.parentElement.style.width="300px";
		event.target.parentElement.style.height="400px";
	}
}
// set the point border width
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
// set the point border color
function setStrokeColor(){
	strokeColor=event.target.value;
	d3.selectAll("path").style("stroke", fillStroke);
}
function fillStroke(d){
	if (d.geometry.type=="Point"){		  		
		return event.target.value;
	}else{
	  	return "grey";
	}
}	
//set the point color
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
//display data label
function setLabels(){
	if (event.target.checked==true){ 
		labels=true;
	}else{
		labels=false;
	}
}