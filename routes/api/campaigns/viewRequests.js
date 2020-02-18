var admin = require('firebase-admin');
var express = require('express');
var moment = require('moment');

var db = admin.firestore();

const routerViewReq = express.Router();

// Get campaign requests
// get all the blood donation campaign requests

module.exports = routerViewReq;