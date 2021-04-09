/**
 * Here is is the code snippet to initialize Firebase Messaging in the Service
 * Worker when your app is not hosted on Firebase Hosting.
 // Give the service worker access to Firebase Messaging.
 // Note that you can only use Firebase Messaging here. Other Firebase libraries
 // are not available in the service worker.*/
 importScripts('https://www.gstatic.com/firebasejs/8.3.2/firebase-app.js');
 importScripts('https://www.gstatic.com/firebasejs/8.3.2/firebase-messaging.js');

 // Initialize the Firebase app in the service worker by passing in
 // your app's Firebase config object.
 // https://firebase.google.com/docs/web/setup#config-object
 
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

 // Retrieve an instance of Firebase Messaging so that it can handle background
 // messages.
const messaging = firebase.messaging();

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// Keep in mind that FCM will still show notification messages automatically 
// and you should use data messages for custom notifications.
// For more info see: 
// https://firebase.google.com/docs/cloud-messaging/concept-options
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});











 