const router = require('express').Router();
let Buyer = require('../models/Buyer');
let Food = require('../models/Food');
let mongoose = require("mongoose");
let Order = require("../models/Order");

router.route('/').get((req, res) => {
  Food.find()
    .then(food => res.json({
      status: 0,
      food: food
    }))
    .catch(err => res.status(200).json({
      status: 1,
      error: err
    }));
});

router.route('/register').post(async (req, res) => {
  const item_name = req.body.item_name;
  const canteen = req.body.canteen;
  const price = req.body.price;
  const non_veg = req.body.non_veg;
  const times_sold = 0;
  const toppings = req.body.toppings || [];
  const tags = req.body.tags || [];
  const newFood = new Food({
      item_name,
      canteen,
      price,
      non_veg,
      times_sold,
      toppings,
      tags,
  });
  const food = await Food.countDocuments({canteen: canteen, item_name: item_name});
  if (food > 0) {
    return res.status(200).json({
      status: 1,
      error: "You already have a food item of the same name"
    })
  }
  newFood.save()
  .then(() => res.json({
      status: 0
  }
  ))
  .catch(err => res.status(200).json({
    status: 1,
    error: err
  }));
});

router.route('/:id').get((req, res) => {
    Food.findById(req.params.id)
    .then(food => res.json(food))
    .catch(err => res.status(200).json('Error: ' + err));
});
router.route("/rate/:id").get(async (req,res) => {
    let food = req.params.id;
    let docs = await Order.aggregate([
      { $match: {$and: [{ food : new mongoose.Types.ObjectId(food)}, {rating: {$gte: 1}}] }},
      { $group: {_id: null, sum : { $sum : "$rating"}, count: {$sum : 1}}}
    ]);
    let rating = 0
    if (docs.length != 0 && docs[0]["count"]!= 0) {
      rating = docs[0]["sum"] / docs[0]["count"];
    }
    return res.status(200).json(rating);
})
router.route('/:id').delete(async (req, res) => {
  Food.findByIdAndDelete(req.params.id)
    .then(() => res.json({
      status: 0,
    }))
    .catch(err => res.status(200).json({
      status: 1,
      error: err
    }));
    Buyer.find()
      .then((buyers) => {
        buyers.map((buyer) => {
          let index = buyer.favorites.indexOf(req.params.id);
          if (index > -1) buyer.favorites.splice(req.params.id, 1);
          buyer.save();
        })
      })
    let a = await Order.deleteMany({food: new mongoose.Types.ObjectId(req.params.id)})
});

router.route('/canteen/:canteen').get(async (req, res) => {
  let foods = await Food.find({"canteen" : req.params.canteen})
  foods.sort((a, b) => b.times_sold - a.times_sold);
  return res.status(200).json({status: 0, food: foods});
});

router.route('/update/:id').post((req, res) => {
  Food.findById(req.params.id)
    .then(food => {
      food.item_name = req.body.item_name || food.item_name;
      food.price = req.body.price || food.price;
      food.non_veg = req.body.non_veg || food.non_veg;
      food.toppings = req.body.toppings || food.toppings;
      food.tags = req.body.tags || food.tags;

      food.save()
        .then(() => res.json({
          status: 0,
        }))
        .catch(err => res.status(200).json({
          status: 1,
          error: err
        }));
    })
    .catch(err => res.status(200).json({
      status: 1,
      error: err
    }));
});
module.exports = router;
