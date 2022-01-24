const router = require('express').Router();
let bcrypt = require("bcrypt")
let moment = require('moment');
let Buyer = require('../models/Buyer');
let Vendor = require('../models/Vendor');
let jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library')
require('dotenv').config();
const client = new OAuth2Client(process.env.GOOG_ID)
router.route("/google").post(async (req, res) => {
    const token = req.body.token;
    const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.GOOG_ID });
    const email = ticket.getPayload().email;
    let buyer = await Buyer.findOne({email: email});
    let vendor = await Vendor.findOne({email: email});
    if (!buyer && !vendor) {
        return res.status(200).json({
            status: 1,
            error : "No account with this email exists"
        })
    }
    let tokenx;
    if (buyer) {
        tokenx = {
            email: email,
            type: "buyer"
        } 
    }
    else {
        tokenx = {
            email: email,
            type: "vendor"
        } 
    }
    const signedtoken = jwt.sign(tokenx, process.env.SECRET);
    return res.status(200).json({
        status: 0,
        usertoken: signedtoken 
    })

})
router.route("/login").post(async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    let token;
    let buyer = await Buyer.findOne({email: email});
    let vendor = await Vendor.findOne({email: email});
    if (!buyer && !vendor) {
        return res.status(200).json({
            status: 1,
            error : "No such user"
        })
    }
    if (buyer) {
        const verify = await bcrypt.compare(password, buyer.password);
        if (!verify) {
            return res.status(200).json({
                status: 1,
                error : "Incorrect password"
            })
        }
        token = {
            email: buyer.email,
            type: "buyer"
        } 
    }
    else {
        const verify = await bcrypt.compare(password, vendor.password);
        if (!verify) {
            return res.status(200).json({
                status: 1,
                error : "Incorrect password"
            })
        }
        token = {
            email: vendor.email,
            type: "vendor"
        } 
    }
    const signedtoken = jwt.sign(token, process.env.SECRET);
    return res.status(200).json({
        status: 0,
        usertoken: signedtoken 
    })
});
router.route("/register").post(async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const contact_number = req.body.contact_number;
    const x = 10
    const password = await bcrypt.hash(req.body.password, x);

    let duplicatebuyer = await Buyer.findOne({email: email});
    let duplicatevendor = await Vendor.findOne({email: email});
    if (duplicatebuyer || duplicatevendor) {
        return res.status(200).json({
            status: 1,
            error: "The email you've entered is already registered"
        });
    }
    if (req.body.type === "buyer") {
        const age = req.body.age;
        const batch_name = req.body.batch_name;
        const wallet = req.body.wallet || 0;
        const newBuyer = new Buyer({
            name, 
            email,
            age, 
            contact_number,
            batch_name,
            wallet,
            password
        });
        newBuyer.save()
        .then(() => res.json('Buyer registered!'))
        .catch(err => res.status(200).json({
            status: 1,
            error: err
        }));
    }
    else if (req.body.type === "vendor") {
        const shop_name = req.body.shop_name;
        const canteen_timings = {
            open: moment(req.body.opentiming).format("HH:mm"),
            close: moment(req.body.closetiming).format("HH:mm")
        }
        const order_stats = {
            placed: 0,
            pending: 0,
            completed: 0
        } 
        const multi = 0;
        const newVendor = new Vendor({
            name, 
            shop_name,
            email,
            contact_number, 
            canteen_timings,
            order_stats,
            multi,
            password
        });
        newVendor.save()
        .then(() => res.json('Vendor registered!'))
        .catch(err => res.status(200).json({
            status: 1,
            error: err
        }));
    }
});
module.exports = router;