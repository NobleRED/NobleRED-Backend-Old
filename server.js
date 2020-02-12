var admin = require('firebase-admin');
var express = require('express');
var bodyparser = require('body-parser');
var moment = require('moment');

var serviceAccount = require("./account/serviceAccount.json");

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

app.use('/api/campaigns/requests', './routes/api/')

app.get('/api', function (req, res) {
    res.send("NobleRED Backend");
});

//get requested campaign details
app.get('/api/campaigns/requests', (req, res) => {
    const requests = [];

    db.collection("campaigns-requests").get().
    then(snap => {
        if(snap.empty){
            console.log('No matching documents.');
            return;
        }
        snap.forEach(doc => {
            console.log(doc.id, '=>', doc.data());

            //get data from doc and append it to requests array
            var arr = doc.data();

            //using moment to format date to "10 hours ago" format
            arr.publishedDateTimeAgo = moment(
                doc.data().publishedDateTime
            ).fromNow();

            requests.push(arr);
        });

        console.log("campaign requests : "+JSON.stringify(posts))
        res.send(JSON.stringify(requests))
    })
    .catch(err => {
        console.log("Error getting documents", err);
    })
})

// get accepted campaign details
app.get('/api/campaigns-accepted', function (req, res) {
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