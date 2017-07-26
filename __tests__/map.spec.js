var $ = require('jquery');
var fs = require('fs')

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
    beforeEach(function(done) {
        setTimeout(function() {

            done();
        }, 1);
    });


	it('should load the palette icon', function() {
		// ...
		document.documentElement.innerHTML = html;
		expect(document.getElementById('palette').className).toEqual("icon");
		expect(document.getElementsByClassName('palette')[0]).toBeTruthy();
		expect(true).toBeTruthy();
	});

  	it('should create the map component', function() {

		var d3 = eval('('+ fs.readFileSync("./__tests__/mockD3",'utf-8') +')');
		expect($('custom-map')).toBeTruthy();
  	});
	
});


