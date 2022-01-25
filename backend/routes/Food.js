const router = require('express').Router();
let Buyer = require('../models/Buyer');
let Food = require('../models/Food');

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
  const rating = req.body.rating || 0;
  const non_veg = req.body.non_veg;
  const times_sold = 0;
  const toppings = req.body.toppings || [];
  const tags = req.body.tags || [];
  const newFood = new Food({
      item_name,
      canteen,
      price,
      rating,
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

router.route('/:id').delete((req, res) => {
  Food.findByIdAndDelete(req.params.id)
    .then(() => res.json('Food deleted.'))
    .catch(err => res.status(200).json('Error: ' + err));
});

router.route('/canteen/:canteen').get((req, res) => {
  Food.find({"canteen" : req.params.canteen})
    .then(food => res.json({
      status: 0,
      food: food
    }))
    .catch(err => res.status(200).json({
      status: 1,
      error: err
    }));
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
        .then(() => res.json('Food updated!'))
        .catch(err => res.status(200).json('Error: ' + err));
    })
    .catch(err => res.status(200).json('Error: ' + err));
});
module.exports = router;
