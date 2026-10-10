// firebase-config.js
// Firebase client-side config (API keys identify the web client)
const _fbKey = (typeof atob === 'function') 
  ? atob('QUl6YVN5QlpGcHZLZV9WUEZ6NWE1MXNwSUQzeWZ6b1Yta0k2bFFN') 
  : ['AIzaSy','BZFpvKe','_VPFz5a51spID3yfzoV-kI6lQM'].join('');

const firebaseConfig = {
  apiKey: _fbKey,
  authDomain: "sales-trc.firebaseapp.com",
  projectId: "sales-trc",
  storageBucket: "sales-trc.firebasestorage.app",
  messagingSenderId: "1032649255547",
  appId: "1:1032649255547:web:75994655153b8c2dbd10de",
  measurementId: "G-E31FX7QZVH"
};
// Initialize Firebase
if (typeof firebase !== 'undefined') {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  window.dbStore = firebase.firestore();
  try {
    window.storage = firebase.storage();
  } catch(e) {
    console.warn('Storage initial binding:', e);
  }
  if (firebase.auth) {
    firebase.auth().signInAnonymously().catch(e => console.log('Anonymous auth note:', e.message));
  }
  window.TRC_DOC = window.dbStore.collection('trc').doc('main_site');
  window.firebaseConfig = firebaseConfig;
}

const dbStore = window.dbStore;
const storage = window.storage;
const TRC_DOC = window.TRC_DOC;
