var admin = require('firebase-admin');
var express = require('express');
var bodyparser = require('body-parser');
var moment = require('moment');

var serviceAccount = require("./account/serviceAccount.json");
var email = "damsarar@gmail.com";
var uid = "jcez807hoXVqnJcttor5zdK2OuM2"

var app = express();
app.use(bodyparser.json());
app.listen(4200, () => console.log("Backend started"));

// To enable cross-origin access
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://noble-red-9d387.firebaseio.com"
})

var db = admin.firestore();

// admin.auth().getUserByEmail(email)
//     .then(function (userRecord) {
//         // See the UserRecord reference doc for the contents of userRecord.
//         console.log('Successfully fetched user data:', userRecord.toJSON());
//     })
//     .catch(function (error) {
//         console.log('Error fetching user data:', error);
//     });


// admin.auth().getUser(uid)
//     .then(function (userRecord) {
//         // See the UserRecord reference doc for the contents of userRecord.
//         console.log('Successfully fetched user data:', userRecord.toJSON());
//     })
//     .catch(function (error) {
//         console.log('Error fetching user data:', error);
//     });


app.get('/api', function (req, res) {
    res.send("NobleRED Backend");
});

// get all the blood donation campaigns
app.get('/api/campaigns', function (req, res) {
    const posts = [];

    db.collection("campaigns-accepted").get().
        then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            }

            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());

                // putting data to dataArray from firebase data object
                var dataArray = doc.data();

                // using moment to format date to "10 hours ago format"
                dataArray.publishedDateTimeAgo = moment(
                    doc.data().publishedDateTime
                ).fromNow();

                // push data to the posts array
                posts.push(dataArray)

            });

            console.log("posts: " + JSON.stringify(posts))
            res.send(JSON.stringify(posts))
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
});