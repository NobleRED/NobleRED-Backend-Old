var admin = require('firebase-admin');
var express = require('express');
var bodyparser = require('body-parser');
var moment = require('moment');

var serviceAccount = require("./account/serviceAccount.json");

var app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.listen(process.env.PORT || 4200, () => console.log("Server Started on port 4200"));

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

app.get('/api', function (req, res) {
    res.send("NobleRED Backend");
});

// Get all accepted campaign details
const campaignAccept = require('./routes/api/campaigns/viewAccepted');
app.use('/api/campaigns/accepted', campaignAccept);

//get all the blood donation campaigns Today
const campaignsToday = require('./routes/api/campaigns/campaignsToday');
app.use('/api/campaignstoday', campaignsToday);

// insert a new campaign request to the db
const newCampaignReq = require('./routes/api/campaigns/insertNew');
app.use('/api/campaigns/new', newCampaignReq);

// accepting a new campaign request to the db
// const acceptReq = require('./routes/api/campaigns/acceptReq');
// app.use('/api/campaigns/accept/:cid', acceptReq);
app.post('/api/campaigns/accept/:cid', function (req, res) {
    const cid = req.params.cid
    console.log(cid.organizerID)

    const docRef = db.collection("campaigns-requests").where("campaignID", '==', cid);
    db.collection("campaigns").add(docRef);
    console.log("Updated successfully: ", docRef.id);
    db.collection("campaigns-requests").where("campaignID", '==', cid).delete();
    res.send(200, "Document written with ID: ", docRef.id);
});

// get last 4 campaign posts
const last = require('./routes/api/campaigns/last4campaigns');
app.use('/api/campaignposts/lastfour', last);

// view campaign requests
const viewreq = require("./routes/api/campaigns/viewRequests");
app.use('/api/campaigns/requests', viewreq);

// get next organizer id
const nextOrgID = require('./routes/api/organizers/nextOrgId');
app.use('/api/organizers/nextid', nextOrgID);

// get next id of admin
const adminNextID = require('./routes/api/admins/nextAdminId');
app.use('/api/admins/nextid', adminNextID);


// MAPS

// get past campaign markers in grey
const greyMarkers = require('./routes/api/maps/greyMarkers');
app.use('/api/maps/greyMarkers', greyMarkers);


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



// ADMINS

// view admins
const viewAdmins = require('./routes/api/admins/viewAdmins');
app.use('/api/admins', viewAdmins);

//get admin by id
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


// DONORS


// get all donors
const viewDonor = require('./routes/api/donors/viewDonors');
app.use('/api/donors', viewDonor);

// get next donor id
const nextDonorId = require('./routes/api/donors/nextDonorId');
app.use('/api/donors/nextid', nextDonorId);

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



// const nextDonorId = require('./routes/api/donors/nextDonorId');
// app.use('/api/donors/nextid', nextDonorId);

// Charts

//get male donors
const maleDonors = require('./routes/api/charts/donorsMale');
app.use('/api/donorsmale', maleDonors);

//get female donors
const femaleDonors = require('./routes/api/charts/donorsFemale');
app.use('/api/donorsfemale', femaleDonors);

//get A+ donors
const aplusDonors = require('./routes/api/charts/donorsA+');
app.use('/api/donorsAplus', aplusDonors);

//get A- donors
const aminDonors = require('./routes/api/charts/donorsA-');
app.use('/api/donorsAmin', aminDonors);

//get B+ donors
const bplusDonors = require('./routes/api/charts/donorsB+');
app.use('/api/donorsBplus', bplusDonors);

//get B- donors
const bminDonors = require('./routes/api/charts/donorsB-');
app.use('/api/donorsBmin', bminDonors);

//get AB+ donors
const abplusDonors = require('./routes/api/charts/donorsAB+');
app.use('/api/donorsABplus', abplusDonors);

//get AB- donors
const abnegDonors = require('./routes/api/charts/donorsAB-');
app.use('/api/donorsABmin', abnegDonors);

//get O+ donors
const oplusDonors = require('./routes/api/charts/donorsO+');
app.use('/api/donorsOplus', oplusDonors);

//get O- donors
const onegDonors = require('./routes/api/charts/donorsO-');
app.use('/api/donorsOmin', onegDonors);


app.get('/api/last', function (req, res) {
    res.send("Last API")
})
