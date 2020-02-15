var admin = require('firebase-admin');
var express = require('express');

var db = admin.firestore();

const lastcamp = express.Router();

lastcamp.get('/', function (req, res) {
    const campaignposts = [];
    var lastID;
    var tempID;
    var nextID;

    db.collection("campaigns").orderBy('publishedDateTime', "desc").limit(4).get().
        then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            }
            snapshot.forEach(doc => {
                var dataArray = doc.data();
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