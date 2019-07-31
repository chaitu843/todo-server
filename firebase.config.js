const firebase = require('firebase');

var config = {
    apiKey: "AIzaSyCpE6rcRD9DmZxMQiw79FXWAygSmMz1HFE",
    authDomain: "todo-server-94c5b-709cc.firebaseapp.com",
    databaseURL: "https://todo-server-94c5b-709cc.firebaseio.com",
    projectId: "todo-server-94c5b",
    storageBucket: "todo-server-94c5b.appspot.com",
    messagingSenderId: "20227152320",
    appId: "1:20227152320:web:70120215084a5de4"
  };

firebase.initializeApp(config);

module.exports = firebase;