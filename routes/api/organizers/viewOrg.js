var admin = require('firebase-admin');
var express = require('express');
var moment = require('moment');

var db = admin.firestore();

const routerViewOrg = express.Router();

// get all organizers
routerViewOrg.get('/', function (req, res) {
    const organizers = [];

    db.collection("users-organizer").get().
        then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            }

            snapshot.forEach(doc => {
                // console.log(doc.id, '=>', doc.data());

                // putting data to dataArray from firebase data object
                var dataArray = doc.data();

                // using moment to format date to "10 hours ago format"
                dataArray.registeredDateTimeAgo = moment(
                    doc.data().createdAt
                ).fromNow();

                // push data to the posts array
                organizers.push(dataArray)

            });

            // console.log("posts: " + JSON.stringify(posts))
            res.send(JSON.stringify(organizers))
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });

});

module.exports = routerViewOrg;