var admin = require('firebase-admin');
var express = require('express');

var db = admin.firestore();

const nextAdmin = express.Router();

//get admins next id
nextAdmin.get('/', function (req, res) {
    const admins = [];
    var lastID;
    var tempID;
    var nextID;

    console.log("here")

    db.collection("users-admin").orderBy("createdAt", "desc").get().
        then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                res.send('ADM-000001')
                return;
            }

            snapshot.forEach(doc => {
                var dataArray = doc.data();
                admins.push(dataArray);
            });

            lastID = parseInt(admins[0].adminID.substring(4));
            tempID = lastID + 1;

            if (tempID < 1000000 && tempID >= 100000) {
                nextID = 'ADM-' + tempID;
            } else if (tempID < 100000 && tempID >= 10000) {
                nextID = 'ADM-0' + tempID;
            } else if (tempID < 10000 && tempID >= 1000) {
                nextID = 'ADM-00' + tempID;
            } else if (tempID < 1000 && tempID >= 100) {
                nextID = 'ADM-000' + tempID;
            } else if (tempID < 100 && tempID >= 10) {
                nextID = 'ADM-0000' + tempID;
            } else if (tempID < 10) {
                nextID = 'ADM-00000' + tempID;
            } else {
                nextID = "Limit exceeded!"
            }

            console.log("posts: ", lastID, nextID)
            res.send(nextID)
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
});

module.exports = nextAdmin;