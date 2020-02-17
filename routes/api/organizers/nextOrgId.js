var admin = require('firebase-admin');
var express = require('express');

var db = admin.firestore();

const routerNextOrg = express.Router();

// get the next organizer id
routerNextOrg.get('/', function (req, res) {
    const organizers = [];
    var lastID;
    var tempID;
    var nextID;

    db.collection("users-organizer").get().
        then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                res.send('ORG-000001');
                return;
            }

            snapshot.forEach(doc => {
                var dataArray = doc.data();
                organizers.push(dataArray);
            });

            // lastID = parseInt(organizers[0].organizerID.substring(4));
            // tempID = lastID + 1;

            // if (tempID < 1000000 && tempID >= 100000) {
            //     nextID = 'ORG-' + tempID;
            // } else if (tempID < 100000 && tempID >= 10000) {
            //     nextID = 'ORG-0' + tempID;
            // } else if (tempID < 10000 && tempID >= 1000) {
            //     nextID = 'ORG-00' + tempID;
            // } else if (tempID < 1000 && tempID >= 100) {
            //     nextID = 'ORG-000' + tempID;
            // } else if (tempID < 100 && tempID >= 10) {
            //     nextID = 'ORG-0000' + tempID;
            // } else if (tempID < 10) {
            //     nextID = 'ORG-00000' + tempID;
            // } else {
            //     nextID = "Limit exceeded!"
            // }

            // console.log("posts: ", lastOrganizerID, nextOrganizerID)
            res.send(organizers)
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });


});

module.exports = routerNextOrg;