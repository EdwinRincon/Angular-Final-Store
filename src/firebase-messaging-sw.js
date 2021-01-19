// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');
// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: 'AIzaSyDugIL4yakkAOpksU0WrRh-z86Dl41DIf8',
    authDomain: 'ecommerce-final-d64fc.firebaseapp.com',
    databaseURL: 'https://ecommerce-final-d64fc.firebaseio.com',
    projectId: 'ecommerce-final-d64fc',
    storageBucket: 'ecommerce-final-d64fc.appspot.com',
    messagingSenderId: '787421388739',
    appId: '1:787421388739:web:0fe12825e04ad2856f2776'
});
// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
