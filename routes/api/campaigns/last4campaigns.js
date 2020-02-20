var admin = require('firebase-admin');
var express = require('express');
var moment = require('moment');

var db = admin.firestore();

const lastcamp = express.Router();

lastcamp.get('/', function (req, res) {
    const campaignposts = [];
    var lastID;
    var tempID;
    var nextID;

    db.collection("campaigns").orderBy('date', "asc").limit(4).get().
        then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            }
            snapshot.forEach(doc => {
                var dataArray = doc.data();
                dataArray.publishedDateTimeAgo = moment(
                    doc.data().publishedDateTime
                ).fromNow();
                campaignposts.push(dataArray)
            });

            // console.log("blood_need_posts: " + JSON.stringify(bloodposts))
            res.send(JSON.stringify(campaignposts))
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
});

module.exports = lastcamp;