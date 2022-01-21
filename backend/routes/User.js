const router = require('express').Router();
let Vendor = require('../models/Vendor');
let Buyer = require('../models/Buyer');
let bcrypt = require("bcrypt")
let moment = require('moment');
router.route("/register").post(async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const contact_number = req.body.contact_number;
    const x = 10
    const password = await bcrypt.hash(req.body.password, x);
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
        .catch(err => res.status(400).json('Error: ' + err));
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
        const newVendor = new Vendor({
            name, 
            shop_name,
            email,
            contact_number, 
            canteen_timings,
            order_stats,
            password
        });
        newVendor.save()
        .then(() => res.json('Vendor registered!'))
        .catch(err => res.status(400).json('Error: ' + err));
    }
});
module.exports = router;