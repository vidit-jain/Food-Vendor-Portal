const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;

mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const buyerRouter = require('./routes/Buyer');
const vendorRouter = require('./routes/Vendor');
const foodRouter = require('./routes/Food');
const authRouter = require('./routes/User');

app.use('/buyer', buyerRouter);
app.use('/vendor', vendorRouter);
app.use('/food', foodRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
