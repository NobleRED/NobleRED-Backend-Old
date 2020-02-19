var admin = require("firebase-admin");
var express = require("express");
var moment = require("moment");

var db = admin.firestore();

const last4 = express.Router();

last4.get("/", function(req, res) {
  const bloodposts = [];
  var lastID;
  var tempID;
  var nextID;

  db.collection("posts-blood_needed")
    .orderBy("publishedDateTime", "desc")
    .limit(4)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      }
      snapshot.forEach(doc => {
        var dataArray = doc.data();
        dataArray.publishedDateTimeAgo = moment(
          doc.data().publishedDateTime
        ).fromNow();

        bloodposts.push(dataArray);
      });

      // console.log("blood_need_posts: " + JSON.stringify(bloodposts))
      res.send(JSON.stringify(bloodposts));
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });
});

module.exports = last4;
