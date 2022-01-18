const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const OrderSchema = new Schema({
    placed_time: {
        type: Date,
        required: true
    },
	canteen: {
		type: String,
		required: true
	},
	item_name: {
		type: String,
		required: true
	},
    quantity:{
        type: Number,
        default: 1
    },
    status: {
        type: Number,
        required: true
    },
	cost: {
		type: Number,
		required: true,
	},
	rating:{
		type: String,
        default: 0
	}
});

module.exports = Order = mongoose.model("Order", OrderSchema);