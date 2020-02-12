var admin = require('firebase-admin');
var express = require('express');

var db = admin.firestore();

const routerOrgByID = express.Router();

// get organizer by id
routerOrgByID.get('/', function (req, res) {
    const uid = req.params.uid

    // matches the uid with the given parameter
    db.collection("users").doc("organizers").collection("organizers").where("uid", "==", uid).get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                res.send(JSON.stringify(doc.data()))
            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
});

module.exports = routerOrgByID;