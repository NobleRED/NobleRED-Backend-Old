var admin = require('firebase-admin');
var express = require('express');
var bodyparser = require('body-parser');

var serviceAccount = require("./account/serviceAccount.json");
var email = "damsarar@gmail.com";
var uid = "jcez807hoXVqnJcttor5zdK2OuM2"

var app = express();
app.use(bodyparser.json());
app.listen(4200, () => console.log("Backend started"));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://noble-red-9d387.firebaseio.com"
})

admin.auth().getUserByEmail(email)
    .then(function (userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully fetched user data:', userRecord.toJSON());
    })
    .catch(function (error) {
        console.log('Error fetching user data:', error);
    });


admin.auth().getUser(uid)
    .then(function (userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully fetched user data:', userRecord.toJSON());
    })
    .catch(function (error) {
        console.log('Error fetching user data:', error);
    });


app.get('/', function (req, res) {
    res.send("NobleRED Backend");
});

app.get('/users', function (req, res) {
    function listAllUsers(nextPageToken) {
        // List batch of users, 1000 at a time.
        admin.auth().listUsers(1000, nextPageToken)
            .then(function (listUsersResult) {
                listUsersResult.users.forEach(function (userRecord) {
                    console.log('user', userRecord.toJSON());
                });
                if (listUsersResult.pageToken) {
                    // List next batch of users.
                    listAllUsers(listUsersResult.pageToken);
                }
            })
            .catch(function (error) {
                console.log('Error listing users:', error);
            });
    }
    // Start listing users from the beginning, 1000 at a time.
    listAllUsers();
});