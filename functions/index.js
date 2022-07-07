const functions = require("firebase-functions");

const admin = require('firebase-admin');

admin.initializeApp();

const express = require('express');
const app = express();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

exports.getLinks = functions.https.onRequest((req,res) => {
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
});


exports.createLinks = functions.https.onRequest((req, res) => {

    const newLink = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: admin.firestore.Timestamp.fromDate(new Date())
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