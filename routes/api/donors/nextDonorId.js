var admin = require('firebase-admin');
var express = require('express');
var moment = require('moment');

var db = admin.firestore();

const routerNextDId = express.Router();

// get the next donor id
routerNextDId.get('/', function (req, res) {
    const donors = [];
    var lastID;
    var tempID;
    var nextID;

    db.collection("users-donor").orderBy('createdAt', "desc").limit(1).get().
        then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                res.send('DNR-000001')
                return;
            }

            snapshot.forEach(doc => {
                var dataArray = doc.data();
                donors.push(dataArray);
            });

            lastID = parseInt(donors[0].organizerID.substring(4));
            tempID = lastID + 1;

            if (tempID < 1000000 && tempID >= 100000) {
                nextID = 'DNR-' + tempID;
            } else if (tempID < 100000 && tempID >= 10000) {
                nextID = 'DNR-0' + tempID;
            } else if (tempID < 10000 && tempID >= 1000) {
                nextID = 'DNR-00' + tempID;
            } else if (tempID < 1000 && tempID >= 100) {
                nextID = 'DNR-000' + tempID;
            } else if (tempID < 100 && tempID >= 10) {
                nextID = 'DNR-0000' + tempID;
            } else if (tempID < 10) {
                nextID = 'DNR-00000' + tempID;
            } else {
                nextID = "Limit exceeded!"
            }

            // console.log("posts: ", lastOrganizerID, nextOrganizerID)
            res.send(nextID)
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
});

module.exports = routerNextDId;