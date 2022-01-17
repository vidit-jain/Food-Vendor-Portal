const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const FoodSchema = new Schema({
	item_name: {
		type: String,
		required: true
	},
	canteen: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true,
	},
	rating:{
		type: String,
        default: 0
	},
    non_veg:{
        type: Boolean,
        required: true,
    },
    toppings:[{name: {type: String, required: true}, price: {type: Number, required: true}}],
	tags:[String]
});

module.exports = Food = mongoose.model("Food", FoodSchema);