var admin = require('firebase-admin');
var express = require('express');
var moment = require('moment');

var db = admin.firestore();

const routerBloodNeeded = express.Router();

//get all blood needed posts
routerBloodNeeded.get('/', function (req, res) {
    const blood_need_posts = [];

    db.collection("posts").doc("blood_needed_posts").collection("blood_needed_posts").get().
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
                blood_need_posts.push(dataArray)

            });

            console.log("blood_need_posts: " + JSON.stringify(blood_need_posts))
            res.send(JSON.stringify(blood_need_posts))
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
});

module.exports = routerBloodNeeded;