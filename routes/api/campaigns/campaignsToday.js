var admin = require('firebase-admin');
var express = require('express');

var db = admin.firestore();

//get date
var date = new Date();
// console.log(date);

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

var today = formatDate(date);
console.log(today);

const campaignstoday = express.Router();

//get all the blood donation campaigns Today
campaignstoday.get('/', function (req, res) {
    const todayPost = [];

    db.collection("campaigns").where('date', '==', today).get().
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


                // push data to the posts array
                todayPost.push(dataArray);

            });

            // console.log("posts: " + JSON.stringify(posts))
            res.send(JSON.stringify(todayPost))
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
});

module.exports = campaignstoday;