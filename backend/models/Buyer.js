const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const BuyerSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	age:{
		type: Number,
		required: true 
	},
    contact_number:{
        type: String,
        required: true
    },
	batch_name:{
		type: String,
		required: true
	},
	wallet: {
		type: Number,
		required: true,
		default: 0
	},
	password:{
		type:String,
		required:true
	}
});

module.exports = Buyer = mongoose.model("Buyers", BuyerSchema);