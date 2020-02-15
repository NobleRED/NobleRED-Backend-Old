var admin = require('firebase-admin');
var express = require('express');
var moment = require('moment');

var db = admin.firestore();

const router = express.Router();

// accepting a new campaign request to the db
router.post('/', function (req, res) {
    const cid = req.params.cid

    const docRef = db.collection("campaigns-requests").where("campaignID", '==', cid);
    docRef.update({
        status: 'accepted'
    })
        .then(function (docRef) {
            console.log("Updated successfully: ", docRef.id);
            db.collection("campaigns").add(docRef);
            db.collection("campaigns-requests").where("campaignID", '==', cid).delete();
            res.send(200, "Document written with ID: ", docRef.id);

        })
        .catch(function (error) {
            console.error("Error updating document: ", error);
        });
});

module.exports = router;