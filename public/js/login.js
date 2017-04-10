'use strict';

var toaster = document.getElementsByClassName('toaster')[0];
var form = document.querySelector('form');

GentleForm(form, function (event) {
  event.preventDefault();

/*
  if (this.isValid()) {
    addToast('success', 'Yay, the form is valid!');
    setTimeout(function redirect() {
      window.location.href = "index.html";
    }, 3000)
  }
  else addToast('error', 'Oops, the form is invalid.');
  */
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
      }, 3000);
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
   storageBucket: "dropzonetest.appspot.com",
   messagingSenderId: "54896432504"
};
firebase.initializeApp(config);


/***************Firebase Auth****************/

// Get elements
var username = document.getElementById('username');
var txtEmail = document.getElementById('useremail');
var userpass = document.getElementById('userpass');
var btnSignUp = document.getElementById('btnSignUp');
var btnLogIn = document.getElementById('btnLogIn');
var btnLogOut = document.getElementById('btnLogOut');

// Add login event
btnLogIn.addEventListener('click', e => {
  // Get email and pass
  var email = txtEmail.value;
  var pass = userpass.value;
  var auth = firebase.auth();
  // Sign in
  var promise = auth.signInWithEmailAndPassword(email, pass);

  /************** LET'S CATCH THOSE ERRORS ****************/
  promise.catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode == 'auth/user-not-found') {
      addToast('error', 'Oops, wrong details.');
    }
    else if (errorCode == 'auth/invalid-email') {
      addToast('error', 'Oops, wrong details.');
    }
    else if (errorCode == 'auth/wrong-password') {
      addToast('error', 'Oops, wrong password.');
    }
    else if (errorCode == 'auth/invalid-email') {
      addToast('error', 'Oops, wrong details.');
    }
    else if (errorCode == 'auth/timeout') {
      addToast('error', 'Took too long, please try again.');
    }
    console.log(error);
  });

})

/********** THIS IS WHERE WE SIGN THEM IN **************/
firebase.auth().onAuthStateChanged(firebaseUser => {
  if(firebaseUser) {
    addToast('success', "Yay, you are in.");
    setTimeout(function redirect() {
      window.location.href = "send.html";
    }, 3000);
  } else {
    console.log('not logged in');
  }
});
