var admin = require("firebase-admin");
var express = require("express");
var moment = require("moment");

var db = admin.firestore();

const routeraddbloodneed = express.Router();

routeraddbloodneed.post("/", function(req, res) {
  db.collection("posts-blood_needed")
    .add({
      userID: req.body.userID,
      userName: req.body.userName,
      phoneNumber: req.body.phoneNumber,
      bloodType: req.body.bloodType,
      imgSrc: req.body.imgSrc,
      createdAt: req.body.publishedDateTimeAgo
    })
    .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
      res.send(200, "Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
});

module.exports = routeraddbloodneed;
