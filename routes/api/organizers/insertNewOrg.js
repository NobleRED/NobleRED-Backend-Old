var admin = require('firebase-admin');
var express = require('express');

var db = admin.firestore();

const routerInsertOrg = express.Router();

// insert a new organizer to the db
routerInsertOrg.post('/', function (req, res) {

    db.collection("users-organizer").add({
        organizerID: req.body.organizerID,
        organizerName: req.body.organizerName,
        contactPerson: req.body.contactPerson,
        contactPersonNIC: req.body.contactPersonNIC,
        contactNo: req.body.contactNo,
        address: req.body.address,
        email: req.body.email,
        createdAt: req.body.createdAt,
        role: req.body.role,
        status: req.body.status
    })
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
            res.send(200, "Document written with ID: ", docRef.id)
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
});

module.exports = routerInsertOrg;