var socket = io();


//Geolocation function
function lat(callback) {
    navigator.geolocation.watchPosition(function(position) {
      {
        enableHighAccuracy: true;
      }
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        callback.call(null, lat, lon);
    }, function(error) {
        console.log("Something went wrong: ", error);
    });
}


//Pass coordinates through w3w api(coords can only be a string separated by a comma)
function locateme() {
    lat(function(latitude, longitude) {
        var lat = latitude.toString();
        var lon = longitude.toString();
        var loc = (lat + ', ' + lon);
        console.log(loc);
        socket.emit('getcoords', {
          my: loc
        });
    });
}
//  locateme();

function spitloc() {
  socket.on('getw3w', function (data) {
      console.log(data.w3w);
      document.getElementById('w3w').innerHTML = data.w3w;
    });
}
//spitloc();
