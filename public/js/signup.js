'use strict';

var toaster = document.getElementsByClassName('toaster')[0];
var form = document.querySelector('form');

GentleForm(form, function (event) {
  event.preventDefault();


  if (this.isValid()) {
    addToast('success', 'Yay, the form is valid!');
  }
  else addToast('error', 'Oops, the form is invalid.');
});



function addToast(type, message) {
  var toast = document.createElement('div');

  toast.classList.add('toast');
  toast.classList.add('toast--' + type);
  toast.innerHTML = message;

  toaster.appendChild(toast);

  toast.addEventListener('transitionend', function (event) {
    if (event.propertyName !== 'transform') return;

    if (toast.classList.contains('toast--show')) {
      setTimeout(function () {
        toast.classList.remove('toast--show');
      }, 4000);
    } else {
      toaster.removeChild(toast);
    }
  }, false);

  setTimeout(function () {
    return toast.classList.add('toast--show');
  }, 100);
}





// Initialize Firebase
var config = {
  apiKey: "AIzaSyAaCoXVFI12HtEUR89viMhAJIjZJNCW9mM",
  authDomain: "dropzonetest.firebaseapp.com",
  databaseURL: "https://dropzonetest.firebaseio.com",
  projectId: "dropzonetest",
  storageBucket: "dropzonetest.appspot.com",
  messagingSenderId: "54896432504"
};
firebase.initializeApp(config);


/***************Firebase Auth****************/

// Get elements
var username = document.getElementById('username');
var txtEmail = document.getElementById('useremail');
var usernumber = document.getElementById('usernumber');
var userpass = document.getElementById('userpass');
var btnSignUp = document.getElementById('btnSignUp');
var btnLogIn = document.getElementById('btnLogIn');


  //Add signup event
  btnSignUp.addEventListener('click', e => {
    // Get email and pass
    // TODO:0 CATCH ALL ERRORS


      var email = txtEmail.value;
      var pass = userpass.value;
      var name = username.value;
      var number = usernumber.value;







      firebase.auth().createUserWithEmailAndPassword(email, pass).then(function(user) {
       var root = firebase.database().ref();
       var uid = user.uid;

       firebase.database().ref('users/' + uid).set({
        name: name,
        number: number
      })
      .then(function() {
        console.log("Sync success");
        window.location.href = "send.html";
      })
      .catch(function() {
        console.log("Sync failed");
      });

     }).catch(e => console.log(e.message));




  });




/*********************  THAT'S ALL FOLKS *********************/
