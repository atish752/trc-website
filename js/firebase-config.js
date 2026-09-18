// firebase-config.js
// Using Firebase v8 Compat SDK for simple CDN usage
const firebaseConfig = {
  apiKey: "AIzaSyBZFpvKe_VPFz5a51spID3yfzoV-kI6lQM",
  authDomain: "sales-trc.firebaseapp.com",
  projectId: "sales-trc",
  storageBucket: "sales-trc.firebasestorage.app",
  messagingSenderId: "1032649255547",
  appId: "1:1032649255547:web:75994655153b8c2dbd10de",
  measurementId: "G-E31FX7QZVH"
};
// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const dbStore = firebase.firestore();
const storage = firebase.storage();
const TRC_DOC = dbStore.collection('trc').doc('main_site');
