const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const VendorScheme = new Schema({
	manager_name: {
		type: String,
		required: true
	},
	shop_name: {
		type: String,
		required: true,
        unique: true
	},
	email:{
		type: String,
		required: true,
        unique: true
	},
    contact_number:{
        type: String,
        required: true
    },
    canteen_timings:{
        open:{type: Number, required: true}, 
        close:{type: Number, required: true}
    },
});

module.exports = Vendor = mongoose.model("Vendors", VendorScheme);