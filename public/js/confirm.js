var socket = io();

window.onload = function() {

    /********************* GET ADDRESS ******************/

    //Geolocation function
   function lat(callback) {
        navigator.geolocation.getCurrentPosition(function(position) {
          {
            enableHighAccuracy: true;
          }
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            callback.call(null, lat, lon);
        }, function(error) {
            alert("Please check your location settings and try again.")
            console.log("Something went wrong: ", error);
        });
    }


      function locateme() {
          lat(function(latitude, longitude) {
              var lat = latitude.toString();
              var lon = longitude.toString();
              var address = (lat + ', ' + lon);
              console.log(address);
              socket.emit('dropoff', {
                address: address
              });
          });
      }
      locateme();
}
