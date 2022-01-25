const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const OrderSchema = new Schema({
    placed_time: {
        type: Date,
        required: true
    },
	buyer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Buyer',
		required: true
	},
	canteen: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Vendor',
		required: true
	},
	food: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Food',
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
	},
    toppings:[String],
});

module.exports = Order = mongoose.model("Order", OrderSchema);