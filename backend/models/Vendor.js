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
	order_stats:{
		placed:{type: Number, required: true, default: 0},
		pending:{type: Number, required: true, default: 0},
		completed:{type: Number, required: true, default: 0}
	}
});

module.exports = Vendor = mongoose.model("Vendors", VendorScheme);