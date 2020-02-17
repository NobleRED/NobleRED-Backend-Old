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
app.listen(4200, () => console.log("Server Started on port 4200"));

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
console.log(today);

// Get all accepted campaign details
const campaignAccept = require('./routes/api/campaigns/viewAccepted');
app.use('/api/campaigns/accepted', campaignAccept);

//get all the blood donation campaigns Today
app.get('/api/campaignstoday', function (req, res) {
    const todayPost = [];

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

//get male donors
app.get('/api/donorsmale', function (req, res) {git
    const users = [];

    db.collection("users").doc("donors").collection("donors").where('gender', '==', 'male').get().
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

//get female donors
app.get('/api/donorsfemale', function (req, res) {
    const users = [];

    db.collection("users").doc("donors").collection("donors").where('gender', '==', 'female').get().
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
//get A+ donors
app.get('/api/donorsAplus', function (req, res) {
    const users = [];

    db.collection("users").doc("donors").collection("donors").where('bloodType', '==', 'A+').get().
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
//get A- donors
app.get('/api/donorsAmin', function (req, res) {
    const users = [];

    db.collection("users").doc("donors").collection("donors").where('bloodType', '==', 'A-').get().
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
//get B+ donors
app.get('/api/donorsBplus', function (req, res) {
    const users = [];

    db.collection("users").doc("donors").collection("donors").where('bloodType', '==', 'B+').get().
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
//get B- donors
app.get('/api/donorsBmin', function (req, res) {
    const users = [];

    db.collection("users").doc("donors").collection("donors").where('bloodType', '==', 'B-').get().
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
//get AB+ donors
app.get('/api/donorsABplus', function (req, res) {
    const users = [];

    db.collection("users").doc("donors").collection("donors").where('bloodType', '==', 'AB+').get().
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
//get AB- donors
app.get('/api/donorsABmin', function (req, res) {
    const users = [];

    db.collection("users").doc("donors").collection("donors").where('bloodType', '==', 'AB-').get().
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
//get O+ donors
app.get('/api/donorsOplus', function (req, res) {
    const users = [];

    db.collection("users").doc("donors").collection("donors").where('bloodType', '==', 'O+').get().
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
//get O- donors
app.get('/api/donorsOmin', function (req, res) {
    const users = [];

    db.collection("users").doc("donors").collection("donors").where('bloodType', '==', 'O-').get().
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



// insert a new campaign request to the db
const newCampaignReq = require('./routes/api/campaigns/insertNew');
app.use('/api/campaigns/new', newCampaignReq);

// accepting a new campaign request to the db
// const acceptReq = require('./routes/api/campaigns/acceptReq');
// app.use('/api/campaigns/accept/:cid', acceptReq);
app.post('/api/campaigns/accept/:cid', function (req, res) {
    const cid = req.params.cid

    const docRef = db.collection("campaigns-requests").where("campaignID", '==', cid);
    db.collection("campaigns").add(docRef);
    console.log("Updated successfully: ", docRef.id);
    db.collection("campaigns-requests").where("campaignID", '==', cid).delete();
    res.send(200, "Document written with ID: ", docRef.id);
});

// get last 4 campaign posts
const last = require('./routes/api/campaigns/last4campaigns');
app.use('/api/campaignposts/lastfour', last);


// const viewreq = require("./routes/api/campaigns/viewRequests");
// app.use('/api/campaigns/requests', viewreq);

app.get('/api/organizers/nextid', function (req, res) {
    const organizers = [];
    var lastID;
    var tempID;
    var nextID;

    db.collection("users-organizer").orderBy("createdAt", "DESC").limit(1).get().
        then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
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

            console.log("posts: ", lastID, nextID)
            res.send(nextID)
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });


});

app.get('/api/donors/nextid', function (req, res) {
    const donors = [];
    var lastID;
    var tempID;
    var nextID;

    console.log("here")

    db.collection("users-donor").orderBy("createdAt", "desc").get().
        then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                res.send('DNR-000001')
                return;
            }

            snapshot.forEach(doc => {
                var dataArray = doc.data();
                donors.push(dataArray);
            });

            lastID = parseInt(donors[0].donorID.substring(4));
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

            console.log("posts: ", lastID, nextID)
            res.send(nextID)
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
});


app.get('/api/admins/nextid', function (req, res) {
    const admins = [];
    var lastID;
    var tempID;
    var nextID;

    console.log("here")

    db.collection("users-admin").orderBy("createdAt", "desc").get().
        then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                res.send('ADM-000001')
                return;
            }

            snapshot.forEach(doc => {
                var dataArray = doc.data();
                admins.push(dataArray);
            });

            lastID = parseInt(admins[0].adminID.substring(4));
            tempID = lastID + 1;

            if (tempID < 1000000 && tempID >= 100000) {
                nextID = 'ADM-' + tempID;
            } else if (tempID < 100000 && tempID >= 10000) {
                nextID = 'ADM-0' + tempID;
            } else if (tempID < 10000 && tempID >= 1000) {
                nextID = 'ADM-00' + tempID;
            } else if (tempID < 1000 && tempID >= 100) {
                nextID = 'ADM-000' + tempID;
            } else if (tempID < 100 && tempID >= 10) {
                nextID = 'ADM-0000' + tempID;
            } else if (tempID < 10) {
                nextID = 'ADM-00000' + tempID;
            } else {
                nextID = "Limit exceeded!"
            }

            console.log("posts: ", lastID, nextID)
            res.send(nextID)
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
});




// MAPS

// get past campaign markers in grey
const greyMarkers = require('./routes/api/maps/greyMarkers');
app.use('/api/maps/greyMarkers', greyMarkers);

// get past campaign markers in red
// const redMarkers = require('./routes/api/maps/redMarkers');
// app.use('/api/maps/redMarkers', redMarkers);


// // get past campaign markers in orange
// const orangeMarkers = require('./routes/api/maps/orangeMarkers');
// app.use('/api/maps/orangeMarkers', orangeMarkers);

// // get past campaign markers in yellow
// const yellowMarkers = require('./routes/api/maps/yellowMarkers');
// app.use('/api/maps/yellowMarkers', yellowMarkers);



// POSTS

//get all blood needed posts
const bloodReq = require('./routes/api/posts/bloodNeeded');
app.use('/api/blood_needed_posts', bloodReq);

// get last 4 blood need posts
const lastposts = require('./routes/api/posts/last4posts');
app.use('/api/bloodneededposts/lastfour', lastposts);

// ORGANIZERS

// get all organizers
const viewOrgs = require('./routes/api/organizers/viewOrg');
app.use('/api/organizers', viewOrgs);

// insert a new organizer to the db
const newOrg = require('./routes/api/organizers/insertNewOrg');
app.use('/api/neworganizer', newOrg);

// get organizer by id
// const orgId = require('./routes/api/organizers/orgById');
// app.use('/api/organizers/:uid', orgId);

// get organizer by id
app.get('/api/organizers/:uid', function (req, res) {
    const uid = req.params.uid

    // matches the uid with the given parameter
    db.collection("users-organizer").where("uid", "==", uid).get()
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

app.get('/api/admins/:uid', function (req, res) {
    const uid = req.params.uid

    // matches the uid with the given parameter
    db.collection("users-admin").where("uid", "==", uid).get()
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


app.get('/api/admins', function (req, res) {
    const posts = [];

    db.collection("users-admin").get().
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


// DONORS


// get all donors
const viewDonor = require('./routes/api/donor/viewDonors');
app.use('/api/donors', viewDonor);

// get donor by id
// const donId = require('./routes/api/donor/donorById');
// app.use('/api/donors/:uid', donId);

// get donor by id
app.get('/api/donors/:uid', function (req, res) {
    const uid = req.params.uid

    db.collection("users-donor").where("uid", "==", uid).get()
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
// const nextDonId = require('./routes/api/donor/nextDonorId');
// app.use('/api/donors/nextid', nextDonId);

// app.get('/api/donors/nextid', function (req, res) {
//     const donors = [];
//     var lastID;
//     var tempID;
//     var nextID;

//     console.log("here")

//     db.collection("users").doc("donors").collection("donors").orderBy('createdAt', "desc").limit(1).get().
//         then(snapshot => {
//             if (snapshot.empty) {
//                 console.log('No matching documents.');
//                 res.send('DNR-000001')
//                 return;
//             }

//             snapshot.forEach(doc => {
//                 var dataArray = doc.data();
//                 console.log(dataArray)
//                 donors.push(dataArray);
//             });

//             lastID = parseInt(donors[0].donorID.substring(4));
//             tempID = lastID + 1;

//             if (tempID < 1000000 && tempID >= 100000) {
//                 nextID = 'DNR-' + tempID;
//             } else if (tempID < 100000 && tempID >= 10000) {
//                 nextID = 'DNR-0' + tempID;
//             } else if (tempID < 10000 && tempID >= 1000) {
//                 nextID = 'DNR-00' + tempID;
//             } else if (tempID < 1000 && tempID >= 100) {
//                 nextID = 'DNR-000' + tempID;
//             } else if (tempID < 100 && tempID >= 10) {
//                 nextID = 'DNR-0000' + tempID;
//             } else if (tempID < 10) {
//                 nextID = 'DNR-00000' + tempID;
//             } else {
//                 nextID = "Limit exceeded!"
//             }

//             console.log("posts: ", lastID, nextID)
//             res.send(nextID)
//         })
//         .catch(err => {
//             console.log('Error getting documentssss', err);
//         });
// });


app.get('/api/last', function (req, res) {
    res.send("Last API")
})
