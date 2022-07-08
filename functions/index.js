const functions = require("firebase-functions");

const admin = require('firebase-admin');

admin.initializeApp();

const express = require('express');
const app = express();

const firebaseConfig = {
    apiKey: "AIzaSyAeSju1jgoDnSOp3YL2WEG-cOhUyjpN-Wo",
    authDomain: "linkapp-3.firebaseapp.com",
    projectId: "linkapp-3",
    storageBucket: "linkapp-3.appspot.com",
    messagingSenderId: "570683270186",
    appId: "1:570683270186:web:7f646c668d52340de90f53",
    measurementId: "G-TSPKTQGRNH"
  };
  

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);


app.get('/links', (req, res) =>{
    admin.firestore()
    .collection('links')
    .get()
    .then((data) => {
        let links =[];
        data.forEach((doc) => {
            links.push(doc.data());
        });
        return res.json(links);
    })
    .catch((err) => console.error(err));
})


app.post('/scream', (req, res) => {
    const newLink = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date.toISOString()
    };

    admin.firestore()
    .collection('links')
    .add(newLink)
    .then(doc => {
        res.json({ message: `document ${doc.id} created successfully`})
    })
    .catch(err => {
        res.status(500).json({ error: 'Something went wrong'});
        console.error(err);
    });

});


//Signup route

app.post('/signup', (req, res) => {
    const newUser ={
        email : req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };

firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then((data) => {
        return res.status(201).json({
            message: `user ${data.user.uid} signed up successfully`});
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code});
    });
});
exports.api = functions.https.onRequest(app);