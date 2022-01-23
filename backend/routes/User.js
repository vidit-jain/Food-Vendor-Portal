const router = require('express').Router();
let bcrypt = require("bcrypt")
let moment = require('moment');
let Buyer = require('../models/Buyer');
let Vendor = require('../models/Vendor');
let jwt = require("jsonwebtoken");
require('dotenv').config();
router.route("/info").post(async (req, res) => {
    res.send(req.usertoken); 
});
router.route("/profile").post(async (req, res) => {
    let usertoken = req.usertoken;
    let user; 
    if (usertoken.type == "buyer") {
        user = await Buyer.findOne({email: usertoken.email});
    }
    else {
        user = await Vendor.findOne({email: usertoken.email});
    }
    console.log(user);
    res.status(200).json(user);
})
module.exports = router;