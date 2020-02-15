var admin = require('firebase-admin');
var express = require('express');
var moment = require('moment');

var db = admin.firestore();

const routerViewReq = express.Router();

// Get campaign requests
// get all the blood donation campaign requests
routerViewReq.get('/', function (req, res) {
    const campaign_requests = [];

    db.collection("campaigns-requests").where('status', '==', 'pending').get().
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
                dataArray.publishedDateTimeAgo = moment(
                    doc.data().publishedDateTime
                ).fromNow();

                // push data to the posts array
                campaign_requests.push(dataArray)

            });

            // console.log("posts: " + JSON.stringify(posts))
            res.send(JSON.stringify(campaign_requests))
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
});

module.exports = routerViewReq;