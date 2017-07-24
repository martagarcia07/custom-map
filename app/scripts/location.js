function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition);
    }
}

function setPosition(position){
	located=[position.coords.latitude,position.coords.longitude];
}
