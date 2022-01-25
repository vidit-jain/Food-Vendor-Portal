const router = require('express').Router();
let bcrypt = require("bcrypt")
let moment = require('moment');
let Buyer = require('../models/Buyer');
let Vendor = require('../models/Vendor');
let jwt = require("jsonwebtoken");
require('dotenv').config();
router.route("/login").post(async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    let token;
    if (req.body.type === "buyer") {
        let buyer = await Buyer.findOne({email: email});
        if (!buyer) {
            return res.status(200).json({
                status: 1,
                error : "No such user"
            })
        }
        const verify = await bcrypt.compare(password, buyer.password);
        if (!verify) {
            console.log(2);
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
        let vendor = await Vendor.findOne({email: email});
        if (!vendor) {
            return res.status(200).json({
                status: 1,
                error : "No such user"
            })
        }
        const verify = await bcrypt.compare(password, vendor.password);
        if (!verify) {
            console.log(3);
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
    if (req.body.type === "buyer") {
        let duplicate = await Buyer.findOne({email: email});
        if (duplicate) {
            return res.status(200).json({
                status: 1,
                error: "The email you've entered is already registered"
            });
        }
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
        let duplicate = await Vendor.findOne({email: email});
        if (duplicate) {
            return res.status(200).json({
                status: 1,
                error: "The email you've entered is already registered"
            });
        }
        const shop_name = req.body.shop_name;
        duplicate = await Vendor.findOne({shop_name: shop_name});
        if (duplicate) {
            return res.status(200).json({
                status: 1,
                error: "A canteen with that name is already registered"
            });
        }
        const canteen_timings = {
            open: moment(req.body.opentiming).format("HH:mm"),
            close: moment(req.body.closetiming).format("HH:mm")
        }
        const order_stats = {
            placed: 0,
            pending: 0,
            completed: 0
        } 
        const newVendor = new Vendor({
            name, 
            shop_name,
            email,
            contact_number, 
            canteen_timings,
            order_stats,
            password
        });
        console.log(newVendor);
        newVendor.save()
        .then(() => res.json('Vendor registered!'))
        .catch(err => res.status(200).json({
            status: 1,
            error: err
        }));
    }
});
module.exports = router;