importScripts('https://www.gstatic.com/firebasejs/8.3.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.0/firebase-messaging.js');
  firebase.initializeApp({
    apiKey: "AIzaSyAtCSdklLZJKt7t2sjd4edRbofqZL7-UCw",
    authDomain: "kiotthe-307407.firebaseapp.com",
    projectId: "kiotthe-307407",
    databaseURL:"https://kiotthe-307407-default-rtdb.firebaseio.com/",
    storageBucket: "kiotthe-307407.appspot.com",
    messagingSenderId: "83286799966",
    appId: "1:83286799966:web:b46ce89fcbbdf4c0f2e6cf",
    measurementId: "G-866JPR188B"
});
  const messaging = firebase.messaging();