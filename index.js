var admin = require('firebase-admin');
var express = require('express');
var bodyparser = require('body-parser');
var moment = require('moment');

var serviceAccount = require("./account/serviceAccount.json");
// var email = "damsarar@gmail.com";
// var uid = "jcez807hoXVqnJcttor5zdK2OuM2"

var app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.listen(4200, () => console.log("Server Started!"));

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
var auth = admin.auth();
var storage = admin.storage();

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

            // console.log("posts: " + JSON.stringify(posts))
            res.send(JSON.stringify(posts))
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
});

//get all blood needed posts
app.get('/api/blood_needed_posts', function (req, res) {
    const blood_need_posts = [];

    db.collection("posts").doc("blood_needed_posts").collection("blood_needed_posts").get().
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
                blood_need_posts.push(dataArray)

            });

            console.log("blood_need_posts: " + JSON.stringify(blood_need_posts))
            res.send(JSON.stringify(blood_need_posts))
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
});

app.get('/api/organizers', function (req, res) {
    const posts = [];

    db.collection("users").doc("organizers").collection("organizers").get().
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
              // dataArray.publishedDateTimeAgo = moment(
                //     doc.data().publishedDateTime
                // ).fromNow();

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
       

app.get('/api/donors', function (req, res) {
    const posts = [];

    db.collection("users").doc("donors").collection("donors").get().
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
                dataArray.registeredDateTimeAgo = moment(
                    doc.data().createdAt
                ).fromNow();

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

app.post('/api/signup/donor', function (req, res) {
    var firstName = req.body.fname
    var lastName = req.body.lname
    var nic = req.body.nic
    var dob = req.body.dob
    var address = req.body.inputAddress
    var contactNo = req.body.contactNo
    var radios = req.body.radios
    var img = req.body.img
    var email = req.body.email
    var password = req.body.password

    auth.createUserWithEmailAndPassword(this.email, this.password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });

    auth.getUserByEmail(this.email).then(function (userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully fetched user data:', userRecord.toJSON());
    })
        .catch(function (error) {
            console.log('Error fetching user data:', error);
        });

    var user = auth.currentUser;

    if (user) {
        // User is signed in.
    } else {
        // No user is signed in.
    }

});


// app.post('/api/login', function (req, res) {
//     var email = req.body.email;
//     var password = req.body.password;
//     res.send("email: " + email + "password" + password);
//     // var verif = false;

//     auth.signInWithEmailAndPassword(email, password)
//         .then(cred => {
//             console.log("User verified");
//             console.log(cred.user);
//             this.verif = true;
//         })
//         .catch(function (error) {
//             var errorCode = error.code;
//             var errorMessage = error.message;

//             console.log("Error, User not verified : " + errorCode);
//         });

//     // console.log("verif is:" + this.verif)

//     // if (verif == true) {
//     //     auth.verifyIdToken(idToken)
//     //         .then(function (decodedToken) {
//     //             let uid = decodedToken.uid;
//     //             console.log("token uid:" + uid);
//     //         })
//     //         .catch(function (error) {
//     //             console.log(error);
//     //         })
//     // }
// });
