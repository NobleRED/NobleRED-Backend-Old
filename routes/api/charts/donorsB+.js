var admin = require('firebase-admin');
var express = require('express');
var db = admin.firestore();

const bplus = express.Router();

//get B+ donors
bplus.get('/', function (req, res) {
    const users = [];

    db.collection("donors").where('bloodType', '==', 'B+').get().
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
                users.push(dataArray);

            });

            // console.log("posts: " + JSON.stringify(posts))
            res.send(JSON.stringify(users))
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
});

module.exports = bplus;