var admin = require("firebase-admin");
var express = require("express");
var bodyparser = require("body-parser");
var moment = require("moment");

var serviceAccount = require("./account/serviceAccount.json");

var app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.listen(process.env.PORT || 4200, () =>
  console.log("Server Started on port 4200")
);

// To enable cross-origin access
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://noble-red-9d387.firebaseio.com"
});

var db = admin.firestore();
var auth = admin.auth();
var storage = admin.storage();

app.get('/api', function (req, res) {
  res.send("NobleRED Backend");
});

// Get all accepted campaign details
const campaignAccept = require("./routes/api/campaigns/viewAccepted");
app.use("/api/campaigns/accepted", campaignAccept);

// Get all campaign requests
const campaignReq = require("./routes/api/campaigns/viewRequests");
app.use("/api/campaigns/requests", campaignReq);
//get all the blood donation campaigns Today
const campaignsToday = require('./routes/api/campaigns/campaignsToday');
app.use('/api/campaignstoday', campaignsToday);

// insert a new campaign request to the db
const newCampaignReq = require("./routes/api/campaigns/insertNew");
app.use("/api/campaigns/new", newCampaignReq);

// accepting a new campaign request to the db
// const acceptReq = require('./routes/api/campaigns/acceptReq');
// app.use('/api/campaigns/accept/:cid', acceptReq);
app.post("/api/campaigns/accept/:cid", function (req, res) {
  const cid = req.params.cid;
  console.log(cid.organizerID);

  const docRef = db
    .collection("campaigns-requests")
    .where("campaignID", "==", cid);
  db.collection("campaigns").add(docRef);
  console.log("Updated successfully: ", docRef.id);
  db.collection("campaigns-requests")
    .where("campaignID", "==", cid)
    .delete();
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
const greyMarkers = require("./routes/api/maps/greyMarkers");
app.use("/api/maps/greyMarkers", greyMarkers);


// POSTS

//get all blood needed posts
const bloodReq = require("./routes/api/posts/bloodNeeded");
app.use("/api/blood_needed_posts", bloodReq);

// get last 4 blood need posts
const lastposts = require("./routes/api/posts/last4posts");
app.use("/api/bloodneededposts/lastfour", lastposts);

//blood need posts id generator
app.get("/api/posts/nextId", function (req, res) {
  const needPosts = [];
  var lastID;
  var tempID;
  var nextID;

  console.log("here");

  db.collection("posts-blood_needed")
    .orderBy("publishedDateTime", "desc")
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log("No matching documents.");
        res.send("PST-000001");
        return;
      }

      snapshot.forEach(doc => {
        var dataArray = doc.data();
        needPosts.push(dataArray);
      });

      lastID = parseInt(needPosts[0].postID.substring(4));
      tempID = lastID + 1;

      if (tempID < 1000000 && tempID >= 100000) {
        nextID = "PST-" + tempID;
      } else if (tempID < 100000 && tempID >= 10000) {
        nextID = "PST-0" + tempID;
      } else if (tempID < 10000 && tempID >= 1000) {
        nextID = "PST-00" + tempID;
      } else if (tempID < 1000 && tempID >= 100) {
        nextID = "PST-000" + tempID;
      } else if (tempID < 100 && tempID >= 10) {
        nextID = "PST-0000" + tempID;
      } else if (tempID < 10) {
        nextID = "PST-00000" + tempID;
      } else {
        nextID = "Limit exceeded!";
      }

      console.log("Posts: ", lastID, nextID);
      res.send(nextID);
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });
});

// Add blood need posts
const addBloodPosts = require("./routes/api/posts/addBloodneed");
app.use("/api/addBloodPosts", addBloodPosts);

//Delete blood need posts
app.get("/api/posts/deletePosts/:postID", function (req, res) {
  const deleteDoc = req.params.postID;
  console.log(deletedoc);
  db.collection("posts-blood_needed")
    .doc(deleteDoc)
    .delete()
    .then(
      function () {
        console.log("Successfully Deleted");
      }.catch(function (error) {
        console.log("Error removing document", error);
      })
    );
});
//Update blood need posts

//--------------------------------------------------------------------------------------------------------//
// ORGANIZERS

// get all organizers
const viewOrgs = require("./routes/api/organizers/viewOrg");
app.use("/api/organizers", viewOrgs);

// insert a new organizer to the db
const newOrg = require("./routes/api/organizers/insertNewOrg");
app.use("/api/neworganizer", newOrg);

// get organizer by id
// const orgId = require('./routes/api/organizers/orgById');
// app.use('/api/organizers/:uid', orgId);

// get organizer by id
app.get("/api/organizers/:uid", function (req, res) {
  const uid = req.params.uid;

  // matches the uid with the given parameter
  db.collection("users-organizer")
    .where("uid", "==", uid)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        res.send(JSON.stringify(doc.data()));
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
// app.get("/api/donors/:uid", function(req, res) {
//   const uid = req.params.uid;

//   db.collection("users-donor")
//     .where("uid", "==", uid)
//     .get()
//     .then(function(querySnapshot) {
//       querySnapshot.forEach(function(doc) {
//         // doc.data() is never undefined for query doc snapshots
//         console.log(doc.id, " => ", doc.data());
//         res.send(JSON.stringify(doc.data()));
//       });
//     })
//     .catch(function(error) {
//       console.log("Error getting documents: ", error);
//     });
// });

// get donor by id


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

app.get("/api/last", function (req, res) {
  res.send("Last API");
});
