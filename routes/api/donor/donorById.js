var admin = require('firebase-admin');
var express = require('express');

var db = admin.firestore();

const routerDonorId = express.Router();

// get donor by id
routerDonorId.get('/', function (req, res) {
    const uid = req.params.uid

    db.collection("users").doc("donors").collection("donors").where("uid", "==", uid).get()
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

module.exports = routerDonorId;