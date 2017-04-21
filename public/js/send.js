var socket = io();

  // Initialize Firebase
  var config = {
     apiKey: "AIzaSyAaCoXVFI12HtEUR89viMhAJIjZJNCW9mM",
     authDomain: "dropzonetest.firebaseapp.com",
     databaseURL: "https://dropzonetest.firebaseio.com",
     storageBucket: "dropzonetest.appspot.com",
     messagingSenderId: "54896432504"
  };
  firebase.initializeApp(config);



function success(position) {
  console.log(position.coords);
}

function error(msg) {
  alert("Dropzone wants to use your location, but first you need to go to Settings and enable Location.")
  console.log(msg);
}


if (navigator.geolocation){
  navigator.geolocation.getCurrentPosition(success, error);
}else {
  console.error('not supported');
}

var recNumber = document.getElementById('recNumber');
var btnShip = document.getElementById('ship');
var logoutLink2 = document.getElementById('logoutLink2');

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    //Nothing happens
  } else {
    window.location.href = "login.html";
  }
});


logoutLink2.addEventListener('click', e => {
  var auth = firebase.auth();
  firebase.auth().signOut();
});

btnShip.addEventListener('click', e => {

  /*** Grab input value ***/
  var myNum = recNumber.value;
  if (myNum.charAt(0) === '0') {
    myNum = myNum.slice(1);
  }
  var number = "+254" + myNum;
  console.log(number);


  var regExNumber = new RegExp("\([0-9]{10})");
  if (regExNumber.test(number)) {



    /*** Fetch sender data from db ***/
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        database = firebase.database();

        /*** Trigger loading screen ***/
        function loadsender() {
          $('#loader').toggleClass('visible');
          $('.dark-overlay').show();


          var userId = firebase.auth().currentUser.uid;

          return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
            var sender = snapshot.val();
            console.log(sender.name);
            var senderName = sender.name;
            var senderNum = sender.number;
            console.log(senderNum);
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
                      var senderAddress = (lat + ', ' + lon);
                      socket.emit('pickup', {
                        senderName: senderName,
                        senderNum: senderNum,
                        senderAddress: senderAddress
                      });

                      console.log(sender);
                  });
              }
              locateme();

              /*************** END GET ADDRESS ******************/


              /***** Generate UNIQUE ID to database *****/
              var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
              var token = '';
              for (var i = 16; i > 0; --i){
                token += chars[Math.round(Math.random() * (chars.length - 1))];
              }
              /****** End unique ID generation *****/

              socket.emit('recipient', {
                senderName: senderName,
                recNumber: number,
                token: token
              });

              console.log(token);
              /***** Save unique id to database *****/
              firebase.database().ref('token/' + token).set({
                recNumber: number
              })
              .then(function() {
                console.log("Unique ID write success");
              })
              .catch(function() {
                console.log(error);
              });


            /*** End data fetch ***/
          });
        }

        loadsender();
        console.log('Yay');
        // User is signed in.
      } else {
         window.location.href = "login.html";
      }
    });

  } else {
    alert("Invalid details");
  }





});


socket.on('complete' , function(data) {
    console.log(data.status);
    window.location.assign("ontheway.html");
})
