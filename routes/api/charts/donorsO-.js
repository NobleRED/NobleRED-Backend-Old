var admin = require('firebase-admin');
var express = require('express');
var db = admin.firestore();

const oneg = express.Router();

//get O- donors
oneg.get('/', function (req, res) {
    const users = [];

    db.collection("users-donor").where('bloodType', '==', 'O-').get().
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

module.exports = oneg;