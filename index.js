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

var today=formatDate(date);
// console.log(today);

// get all the blood donation campaigns
app.get('/api/campaigns', function (req, res) {
    const posts = [];

    db.collection("posts").doc("campaign_posts").collection("campaign_posts").where('status', '==', 'accepted').get().
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
                posts.push(dataArray)

            });

            // console.log("posts: " + JSON.stringify(posts))
            res.send(JSON.stringify(posts))
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
});

//get all the blood donation campaigns Today
app.get('/api/campaignstoday', function (req, res) {
    const posts = [];

    db.collection("posts").doc("campaign_posts").collection("campaign_posts").where('date', '==', today).get().
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
                posts.push(dataArray)

            });

            // console.log("posts: " + JSON.stringify(posts))
            res.send(JSON.stringify(posts))
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
});



// insert a new campaign request to the db
app.post('/api/campaigns', function (req, res) {

    db.collection("posts").doc("campaign_posts").collection("campaign_posts").add({
        organizerID: req.body.organizerID,
        organizerName: req.body.organizerName,
        address: req.body.address,
        province: req.body.province,
        district: req.body.district,
        date: req.body.date,
        time: req.body.time,
        lat: req.body.lat,
        lng: req.body.lng,
        publishedDateTime: req.body.publishedDateTime
    })
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
            res.send(200, "Document written with ID: ", docRef.id)
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
});

// accepting a new campaign request to the db
app.post('/api/campaignreq/:cid', function (req, res) {
    const cid = req.params.cid


    const docRef = db.collection("posts").doc("campaign_posts").collection("campaign_posts").where("campaignID", '==', cid);
    docRef.update({
        status: 'accepted'
    })
        .then(function (docRef) {
            console.log("Updated successfully: ", docRef.id);
            res.send(200, "Document written with ID: ", docRef.id)
        })
        .catch(function (error) {
            console.error("Error updating document: ", error);
        });
});


// get all the blood donation campaign requests
app.get('/api/campaignreq', function (req, res) {
    const campaign_requests = [];

    db.collection("posts").doc("campaign_posts").collection("campaign_posts").where('status', '==', 'pending').get().
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
                campaign_requests.push(dataArray)

            });

            // console.log("posts: " + JSON.stringify(posts))
            res.send(JSON.stringify(campaign_requests))
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
});


// insert a new campaign request to the db
app.post('/api/campaignreq', function (req, res) {

    db.collection("campaigns").doc("campaign_requests").collection("campaign_requests").add({
        organizerID: req.body.organizerID,
        organizerName: req.body.organizerName,
        address: req.body.address,
        province: req.body.province,
        district: req.body.district,
        date: req.body.date,
        time: req.body.time,
        publishedDateTime: req.body.publishedDateTime
    })
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
            res.send(200, "Document written with ID: ", docRef.id)
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
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


// get all organizers
app.get('/api/organizers', function (req, res) {
    const organizers = [];

    db.collection("users").doc("organizers").collection("organizers").get().
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
                dataArray.registeredDateTimeAgo = moment(
                    doc.data().createdAt
                ).fromNow();

                // push data to the posts array
                organizers.push(dataArray)

            });

            // console.log("posts: " + JSON.stringify(posts))
            res.send(JSON.stringify(organizers))
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });

});

// insert a new organizer to the db
app.post('/api/organizer', function (req, res) {

    db.collection("users").doc("organizers").collection("organizers").add({
        organizerID: req.body.organizerID,
        organizerName: req.body.organizerName,
        contactPerson: req.body.contactPerson,
        contactPersonNIC: req.body.contactPersonNIC,
        contactNo: req.body.contactNo,
        address: req.body.address,
        email: req.body.email,
        createdAt: req.body.createdAt,
        role: req.body.role,
        status: req.body.status
    })
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
            res.send(200, "Document written with ID: ", docRef.id)
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
});

// get the next organizer id
app.get('/api/organizers/nextid', function (req, res) {
    const organizers = [];
    var lastID;
    var tempID;
    var nextID;

    db.collection("users").doc("organizers").collection("organizers").orderBy('createdAt', "desc").limit(1).get().
        then(snapshot => {
            if (snapshot.empty) {
                // console.log('No matching documents.');
                res.send('ORG-000001')
                return;
            }

            snapshot.forEach(doc => {
                var dataArray = doc.data();
                organizers.push(dataArray);
            });

            lastID = parseInt(organizers[0].organizerID.substring(4));
            tempID = lastID + 1;

            if (tempID < 1000000 && tempID >= 100000) {
                nextID = 'ORG-' + tempID;
            } else if (tempID < 100000 && tempID >= 10000) {
                nextID = 'ORG-0' + tempID;
            } else if (tempID < 10000 && tempID >= 1000) {
                nextID = 'ORG-00' + tempID;
            } else if (tempID < 1000 && tempID >= 100) {
                nextID = 'ORG-000' + tempID;
            } else if (tempID < 100 && tempID >= 10) {
                nextID = 'ORG-0000' + tempID;
            } else if (tempID < 10) {
                nextID = 'ORG-00000' + tempID;
            } else {
                nextID = "Limit exceeded!"
            }

            // console.log("posts: ", lastOrganizerID, nextOrganizerID)
            res.send(nextID)
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
});

// get all donors
app.get('/api/donors', function (req, res) {
    const posts = [];

    db.collection("users").doc("donors").collection("donors").get().
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


// get donor by id
app.get('/api/donors/:uid', function (req, res) {
    const uid = req.params.uid

    db.collection("users").doc("donors").collection("donors").where("uid", "==", uid).get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                res.send(JSON.stringify(doc.data()))
            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
});

// get the next donor id
app.get('/api/donors/nextid', function (req, res) {
    const donors = [];
    var lastID;
    var tempID;
    var nextID;

    db.collection("users").doc("donors").collection("donors").orderBy('createdAt', "desc").limit(1).get().
        then(snapshot => {
            if (snapshot.empty) {
                // console.log('No matching documents.');
                res.send('DNR-000001')
                return;
            }

            snapshot.forEach(doc => {
                var dataArray = doc.data();
                donors.push(dataArray);
            });

            lastID = parseInt(donors[0].organizerID.substring(4));
            tempID = lastID + 1;

            if (tempID < 1000000 && tempID >= 100000) {
                nextID = 'DNR-' + tempID;
            } else if (tempID < 100000 && tempID >= 10000) {
                nextID = 'DNR-0' + tempID;
            } else if (tempID < 10000 && tempID >= 1000) {
                nextID = 'DNR-00' + tempID;
            } else if (tempID < 1000 && tempID >= 100) {
                nextID = 'DNR-000' + tempID;
            } else if (tempID < 100 && tempID >= 10) {
                nextID = 'DNR-0000' + tempID;
            } else if (tempID < 10) {
                nextID = 'DNR-00000' + tempID;
            } else {
                nextID = "Limit exceeded!"
            }

            // console.log("posts: ", lastOrganizerID, nextOrganizerID)
            res.send(nextID)
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
});

// get organizer by id
app.get('/api/organizers/:uid', function (req, res) {
    const uid = req.params.uid

    // matches the uid with the given parameter
    db.collection("users").doc("organizers").collection("organizers").where("uid", "==", uid).get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                res.send(JSON.stringify(doc.data()))
            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
});



// app.post('/api/signup/donor', function (req, res) {
//     var firstName = req.body.fname
//     var lastName = req.body.lname
//     var nic = req.body.nic
//     var dob = req.body.dob
//     var address = req.body.inputAddress
//     var contactNo = req.body.contactNo
//     var radios = req.body.radios
//     var img = req.body.img
//     var email = req.body.email
//     var password = req.body.password

//     auth.createUserWithEmailAndPassword(this.email, this.password).catch(function (error) {
//         // Handle Errors here.
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         // ...
//     });

//     auth.getUserByEmail(this.email).then(function (userRecord) {
//         // See the UserRecord reference doc for the contents of userRecord.
//         // console.log('Successfully fetched user data:', userRecord.toJSON());
//     })
//         .catch(function (error) {
//             console.log('Error fetching user data:', error);
//         });

//     var user = auth.currentUser;

//     if (user) {
//         // User is signed in.
//     } else {
//         // No user is signed in.
//     }

// });


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
