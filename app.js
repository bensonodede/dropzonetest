var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var firebase = require("firebase");
var $ = require('jquery');
var twilio = require('twilio');
var bodyParser = require('body-parser');
var admin = require("firebase-admin");
app.use(bodyParser.urlencoded({ extended: true }));

//Setting up firebase
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "dropzonetest",
    clientEmail: "dropzonetest@appspot.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDRCPb/k+quyIQ1\nGB/55mShV0jykPLuVVRT63k9RSns42c80Mhu1kS9H+asoXGHsSH/TAVHzeumWPG+\nyOyJr5b7oGhCYRZOHn6C43te3jBC19IU506wZjt8bYvcnnsggkMuSkdID8jG6RsM\nWEwhgAXCD4YoMuILpTkFpJZn6I2nKJHV41Vv8ULnqF0F/+2m26Sbo2oFI6gZW8p8\nGG593PpbvyZBW0d/ZRkJnBn0u+EquFhJrQ/FprtZtZBoPmu9YANvX0d+HF5fF0lI\nuJ5DHfsrn8/v8J9gVDFQGrczf6n5RJCzl6MkUbmHA/ahM9PIp5AYsU0B5aH5B4uu\n9rZAx6sjAgMBAAECggEBAMIQK5dtEKSBvdO4+P69OVFcQnoHvbEsgOSEKQOL8Xde\nSxr3zgywWhKmyjYcj9TkyuZEAmb+Mrc1vgFccdUFsgsbiY+OqPGPd+42GPQjHPUB\nfqUvdStpTfKflQgWDcNJi+suxGyPUtvvz8+vLcawHyhh1y/8xUUAeCbX/VasXM4A\nu3RdGjQ06g8sqFHIhgU3DqwZDPOdOhGXlqJzlvpf8jzXb17MfvGhTUz6j0Z1Mide\nRkE/y0R6HYydlJwhwgiodeTdb8xiha+jDP+Y5XsDtQYYf6e6FcBIDrbf7XRcOXuj\nai+TN5/uCr48DwgBrclLPgciRLQ0z2+Byh88b1pVI1ECgYEA7QVX3gvPq1dt7qcs\neYMIAwy+GRO6AxKJlyMrg2RR5OFY0KT6ftCzDb6RrADq8RgIN2AUynqkRYFwKHao\ng3I/estD8VrJKTSgdtLBZhXXgUrKDGyBWgr/lZ+ZizBhpRjWxp6DYxxUUEexZ6If\nAaTHzqqHmPBqkluK5ieLNAR0WVsCgYEA4cXxkZCkdEQQeb7rL2GaA2vDjfmWUl2p\nhE3/XMm2uNdkZvqH7prCUsuJJJ1eu98rQGH8ORtXNW2ny2Czg+ZJbtsV4GHMIePy\nW3oaJ4cn/O6B4g8tSkvz4o/OFJIZfyCspHvUesn+N1T/FXguGLNsRQQDeWm8cqWf\nlElNMe9+V9kCgYEA2by33I8DJsc5gSzoCXSa7ppNJCJgFiR4a3Ruq9SD+vwdKAb2\n63rzkiPIFLf/HJ5UJfLJBr0lnYhsLW/cHGze7gI/F0CsXYMwChhQfGSCRg8bj9A6\nACrsYlpsplY6zX0FCQ9jabADsIA79BUV4N+sgilcSd5KOMuJzSb0lUOmUtMCgYBJ\nQB6rOsGQk1DBH0dQ3RrKB1mwI4049fh8242BflSRThjeLGST7pQjprO9NG27CKIQ\nxnm90XgO9p/dJWe44Ktskxpa7X/8cud79Hat4nT/5CYxwPjRxSjAliWnmOs6ytAY\nobCDkiuvqh0EyzQxgW0cSzwRVVP14nSO+OVZ0TktqQKBgQCgc3aKJq2Ub3FBD2v1\nGhIO3jMLmaRpcoM1uzv0qiH2L2p+lNHZR3+G5pw/SnXsGyqHAbAS6Y2xrmfhcPw0\ncxbmLY8UHd4cpCKyLZH/lk8Cp+8zkMj2IUlqJsRv3vq33UwrAEogCJTSEPArd5/r\ntsJPYR/dHAuYR+u0X9emewUdtw==\n-----END PRIVATE KEY-----\n"
  }),
  databaseURL: "https://dropzonetest.firebaseio.com"
});


//Twilio Credentials
var accountSid = 'ACfefa7ab7db30fedd3ba418d0838bbe11';
var authToken = '248923d6ebb40fa7a445edfe1e668a42';

// Require  the twiio module and create a REST client
var client = require('twilio')(accountSid, authToken);


//What3Words package import and options
var What3Words = require('./node_modules/geo.what3words/lib/geo.what3words.js'),
    w3w = new What3Words('F06KL8FA', {
        language: 'en'
    });

//Give access to css and js files
app.use(express.static('public'));

//Routing goes here
app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/number', function(req, res){
  res.sendFile(__dirname + '/public/number.html');
});


app.get('/confirm/:token', function(req, res){
  app.use(express.static(__dirname + '/public/css'));
  //Token/Hash variables
  var data = req.params;
  var hash = data.token;
  console.log(hash);

  //Firebase db variables
  var db = admin.database();
  var ref = db.ref("token").child(hash);


  //Check db for token and hash match
  ref.on("value", function(snapshot){
    if (snapshot.val() === null) {
      console.log("Token not found.");
      res.sendFile(__dirname + '/public/404.html');
    }
    else {
      res.sendFile(__dirname + '/public/confirm.html');
      var recNum = snapshot.val().recNumber;
      console.log("DROPOFF TEXT");
      console.log(recNum);
      //Get address
      io.on('connection', function (socket){
        socket.on('dropoff', function (data){
          //Start reverse Geocoding
          w3w.reverse({
            coords:data.address
          }).then(function(response){
              console.log(response);

            //Send dropoff info to courier
      /*    client.messages.create({
            to: "+254724645546",//Courier number(s) go here
            from: "+16466797502",
            body: "DROPOFF at" + "\n" + response + "\n" + "Contact: " + recNum
            }, function(err, message) {
            console.log(err);
            });*/
            //End dropoff info

          });
          //End Geocoding
        });
      });
      //End get address

    }
  });
  //End db check

});



app.get('/send', function(req, res){
  res.sendFile(__dirname + '/public/send.html');
});

app.get('/signup', function(req, res){
  res.sendFile(__dirname + '/public/signup.html');
});

app.get('/login', function(req, res){
  res.sendFile(__dirname + '/public/login.html');
});

app.get('/ontheway', function(req, res){
  res.sendFile(__dirname + '/public/ontheway.html');
});

app.get('/sitemap', function(req, res){
  res.sendFile(__dirname + '/public/sitemap.xml');
});

app.get('/robots.txt', function(req, res){
  res.sendFile(__dirname + '/public/robots.txt');
});

app.get('/google5789020687f2746e', function(req, res){
  res.sendFile(__dirname + 'public/google5789020687f2746e.html');
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
  res.sendFile(__dirname + '/public/404.html');
});
// Initialize Firebase
var config = {
  apiKey: "AIzaSyBaPMtJs4kLq81Csc7ykcI-ZNtvEwBUaUA",
  authDomain: "droptest-9d6f4.firebaseapp.com",
  databaseURL: "https://droptest-9d6f4.firebaseio.com",
  storageBucket: "droptest-9d6f4.appspot.com",
  messagingSenderId: "1032993018707"
};
firebase.initializeApp(config);


// socket to get coords and display on homepage
/*
io.on('connection', function (socket) {
  socket.on('getcoords', function (data) {
    w3w.reverse({
      coords: data.my
    }).then(function(response) {
      console.log(response);
      socket.emit('getw3w', {
        w3w: response
      });
    });
  });
});
*/


//socket to get recipient's form details
io.on('connection', function(socket) {



  /**** PICKUP ****/
  socket.on('pickup', function (data) {
    console.log("PICKUP TEXT");
    console.log(data.senderName);
    console.log(data.senderNum);

    w3w.reverse({
      coords: data.senderAddress
    }).then(function(response) {
      console.log(response);

      //Pickup text
     /*client.messages.create({
          to: "+254724645546",//Courier number(s) go here
          from: "+16466797502",
          body: "PICKUP at " + "\n" + response + "\n" + "Name: " + data.senderName + "\n" + "Contact: " + data.senderNum,
        }, function(err, message) {
           console.log(err);
         });*/
         //End pickup text
        socket.emit('complete', {
          status: "Done."
        });
      });
    });
    /**** END PICKUP ****/

    /***** RECIPIENT TEXT *****/
    socket.on('recipient', function (data) {
     console.log("RECIPIENT TEXT");
      console.log(data.recNumber);
      console.log(data.senderName);
      console.log(data.token);
      //Confirm text
    /*client.messages.create({
      to: data.recNumber,// Recipient's number goes here
      //to: "+254716305157",
      from: "+16466797502",
      body: data.senderName + " wants to send you a package" + " click the link below to confirm" + "\n" + "https://dropzoneapp.herokuapp.com/confirm/" + data.token
    }, function(err, message) {
    console.log(err);
  });*/
    //End confirm text
  });
  /***** END RECIPIENT TEXT *****/


});



//Launch Server
http.listen(process.env.PORT || 4000);
