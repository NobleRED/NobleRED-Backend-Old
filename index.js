var admin = require('firebase-admin');
var express = require('express');
var bodyparser = require('body-parser');

var serviceAccount = require("./noble-red-9d387-firebase-adminsdk-qefui-25b552376d.json");
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
    res.send("All the users");
});