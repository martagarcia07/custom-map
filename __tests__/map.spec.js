var $ = require('jquery');
var fs = require('fs')

//require('d3');

var html = require('fs').readFileSync('./app/index.html').toString();

var main = fs.readFileSync("./app/scripts/main.js",'utf-8');
var events = fs.readFileSync("./app/scripts/events.js",'utf-8');
var map = fs.readFileSync("./app/scripts/map.js",'utf-8');
var mapFunctions = fs.readFileSync("./app/scripts/mapFunctions.js",'utf-8');
var location = fs.readFileSync("./app/scripts/location.js",'utf-8');
var properties = fs.readFileSync("./app/scripts/properties.js",'utf-8');
var radius=1;
var scale=1;
var width=1;
var height=1;
var geojson="mockfile";
var located=[0,0];
describe('Map code', function() {
//	console.log(eval(fs.readFileSync("./app/scripts/main.js",'utf-8')))

	it('should load the palette icon', function() {
		// ...
		document.documentElement.innerHTML = html;
		expect(document.getElementById('palette').className).toEqual("icon");
		expect(document.getElementsByClassName('palette')[0]).toBeTruthy();
		expect(true).toBeTruthy();
	});

  	it('should create the map component', function() {

		var d3 = eval('('+ fs.readFileSync("./__tests__/mockD3",'utf-8') +')');

  		eval(events);
  		eval(map);
  		eval(mapFunctions);
  		eval(location);
  		eval(properties);

		expect($('custom-map')).toBeTruthy();
  	});
  	it('should toogle the palette', function() {
  		//console.log(
		var d3 = eval('('+ fs.readFileSync("./__tests__/mockD3",'utf-8') +')');
  		eval(properties)
  		eval(events)
  		eval(map)
  		//eval(location)
  		//spyOn('setMap').and.callFake(function(){return true})
  		var mainExe= eval( '(' + main.substr(1,main.length-5)+')' );
  		var locationFn=eval(location.substr(0,128));
  		console.log(locationFn);

  		//spyOn(locationFn).and.callFake(function(){return true})
  		mainExe();

		expect($('custom-map')).toBeTruthy();
		//expect(locationFn).toHaveBeenCalled();
	});

	/*var d3={
		select:function(){
			return{attr:function(){return{attr:function(){return{
					attr:function(){return{on:function(){return{on:function(){}}}}},
					append:function(){return{
						attr:function(){return{attr:function(){return{attr:function(){return{on:function(){return{on:function(){return{call:function(){return{call:function(){return{call:function(){}}}}}}}}}}}}}}},
						append:function(){
							return {
							classed:function(){
								return {
									attr:function(){
								return {
									attr:function(){
										
									}
								}
										
									}
								}
							}
						}
						}
					}}
			}}}}}
		},
		geo: {
		mercator: function(){
			return {scale:function(a){return{rotate:function(a){return{translate:function(a){return{
				translate:function(a){},
				scale:function(a){

				}
			}}}}}}}
										
		},
		path:function(){
			return {projection:function(a){return{
				pointRadius:function(a){},
				scale:function(a){}
			}}}

		}


	},
		behavior: {
		drag: function(){
			return {on:function(a){
				return {on:function(a){} }	
			} }
		},
		zoom:function(){
			return {
				on:function(a){},
				translate:function(a){
					return{
						scale:function(){
							return{
								scaleExtent:function(){
									return{
										on:function(){}
									}
								}

							}
						}
					}
				}
			}
		}

		},
		drag: function(){},
		scale: { 
		linear:function(){
				return {domain:function(){
					return {clamp:function(){
						 return {range:function(){

						 }};
				}};	  							
				}};
			}
		}
	};*/  	
});


