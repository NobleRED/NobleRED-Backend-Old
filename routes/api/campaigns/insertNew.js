var admin = require('firebase-admin');
var express = require('express');

var db = admin.firestore();

const routerInsert = express.Router();

// insert a new campaign request to the db
routerInsert.post('/', function (req, res) {

    db.collection("campaigns-requests").add({
        organizerID: req.body.organizerID,
        organizerName: req.body.organizerName,
        address: req.body.address,
        contactNo: req.body.contactNo,
        province: req.body.province,
        district: req.body.district,
        date: req.body.date,
        time: req.body.time,
        lat: req.body.lat,
        lng: req.body.lng,
        publishedDateTime: req.body.publishedDateTime,
        status: "pending"
    })
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
            res.send(200, "Document written with ID: ", docRef.id)
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
});

module.exports = routerInsert;