var admin = require('firebase-admin');
var express = require('express');
var moment = require('moment');

var db = admin.firestore();

const routerGrayMarkers = express.Router();
var today = Date();
console.log('today is ' + today);
// Get accepted campaigns
routerGrayMarkers.get('/', function (req, res) {
    const posts = [];

    db.collection("campaigns").orderBy("date", "desc").get().
        then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            }

            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());

                // putting data to dataArray from firebase data object
                var dataArray = doc.data();

                var todayDate = moment();
                var campaignDate = moment(doc.data().date);

                // todayDate - campaignDate
                var dateDiff = todayDate.diff(campaignDate, 'months')
                // console.log(todayDate, campaignDate)
                // console.log("difference", dateDiff)


                dataArray.dateDeff = dateDiff;

                // using moment to format date to "10 hours ago format"
                // dataArray.publishedDateTimeAgo = moment(
                //     doc.data().publishedDateTime
                // ).fromNow();

                // var timedef

                // push data to the posts array
                posts.push(dataArray)

            });

            // console.log("posts: " + JSON.stringify(posts))
            res.send(JSON.stringify(posts))
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
});

module.exports = routerGrayMarkers;