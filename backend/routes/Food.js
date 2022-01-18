const router = require('express').Router();
let Buyer = require('../models/Buyer');
let Food = require('../models/Food');

router.route('/').get((req, res) => {
  Food.find()
    .then(food => res.json(food))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/register').post((req, res) => {
  const item_name = req.body.item_name;
  const canteen = req.body.canteen;
  const price = req.body.price;
  const rating = req.body.rating || 0;
  const non_veg = req.body.non_veg;
  const times_sold = 0;
  const toppings = req.body.toppings || [];
  const tags = req.body.tags || [];
  const favorites = req.body.favorites || [];
  const newFood = new Food({
      item_name,
      canteen,
      price,
      rating,
      non_veg,
      times_sold,
      toppings,
      tags,
      favorites
  });

  newFood.save()
  .then(() => res.json('Food registered!'))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Food.findById(req.params.id)
    .then(food => res.json(food))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Food.findByIdAndDelete(req.params.id)
    .then(() => res.json('Food deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/canteen/:canteen').get((req, res) => {
  Food.find({"canteen" : req.params.canteen})
    .then(food => res.json(food))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Food.findById(req.params.id)
    .then(food => {
      food.item_name = req.body.item_name;
      food.canteen = req.body.canteen;
      food.price = req.body.price;
      food.rating = req.body.rating || 0;
      food.non_veg = req.body.non_veg;
      food.toppings = req.body.toppings || [];
      food.tags = req.body.tags || [];

      food.save()
        .then(() => res.json('Food updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});
router.route('/:id/favorite/:item').post((req, res) => {
  Buyer.findById(req.params.id)
    .then(buyer => {
      Food.findById(req.params.item)
        .then(food => {
          let index = buyer.favorites.indexOf(item);
          if (index > -1) {
            buyer.favorites = buyer.favorites.splice(item);
          }
          else {
            buyer.favorites.push(item);
          }
        })
        .catch(err => res.status(400).json("Error: " + err));
    })
    .catch(err => res.status(400).json("Error: " + err));
});
module.exports = router;
