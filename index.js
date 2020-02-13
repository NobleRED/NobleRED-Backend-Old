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

// CAMPAIGNS

// Get all accepted campaign details
const campaignAccept = require('./routes/api/campaigns/viewAccepted');
app.use('/api/campaigns/accepted', campaignAccept );

// Get all campaign requests
const campaignReq = require('./routes/api/campaigns/viewRequests');
app.use('/api/campaigns/requests', campaignReq );

// insert a new campaign request to the db
const newCampaignReq = require('./routes/api/campaigns/insertNew');
app.use('/api/campaigns/new', newCampaignReq );

// accepting a new campaign request to the db
const acceptReq = require('./routes/api/campaigns/acceptReq');
app.use('/api/campaigns/requests', acceptReq );


// POSTS

//get all blood needed posts
const bloodReq = require('./routes/api/posts/bloodNeeded');
app.use('/api/blood_needed_posts', bloodReq );


// ORGANIZERS

// get all organizers
const viewOrgs = require('./routes/api/organizers/viewOrg');
app.use('/api/organizers', viewOrgs );   

// insert a new organizer to the db
const newOrg = require('./routes/api/organizers/insertNewOrg');
app.use('/api/neworganizer', newOrg );

// get organizer by id
const orgId = require('./routes/api/organizers/orgById');
app.use('/api/organizers/:uid', orgId );

// get the next organizer id
const nextOrg = require('./routes/api/organizers/nextOrgId');
app.use('/api/organizers/nextid', nextOrg );


// DONORS

// get all donors
const viewDonor = require('./routes/api/donor/viewDonors');
app.use('/api/donors', viewDonor );

// get donor by id
const donId = require('./routes/api/donor/donorById');
app.use('/api/donors/:uid', donId );

// get the next donor id
const nextDonId = require('./routes/api/donor/nextDonorId');
app.use('/api/donors/nextid', nextDonId );

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