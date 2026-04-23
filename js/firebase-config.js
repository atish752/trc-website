// firebase-config.js
// Using Firebase v8 Compat SDK for simple CDN usage
const firebaseConfig = {
  apiKey: "AIzaSyDYgJYYZ5Gc7fdLw1gRVwX0OdhzOidelmQ",
  authDomain: "sale-trc.firebaseapp.com",
  projectId: "sale-trc",
  storageBucket: "sale-trc.firebasestorage.app",
  messagingSenderId: "333525498476",
  appId: "1:333525498476:web:18ac977bc06b6e3f1ef649",
  measurementId: "G-MQV98N84WB"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const dbStore = firebase.firestore();
const TRC_DOC = dbStore.collection('trc').doc('main_site');
