const router = require('express').Router();
let Buyer = require('../models/Buyer');

router.route('/').get((req, res) => {
  Buyer.find()
    .then(buyers => res.json(buyers))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/register').post((req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const age = req.body.age;
  const contact_number = req.body.contact_number;
  const batch_name = req.body.batch_name;
  const wallet = req.body.wallet || 0;
  const newBuyer = new Buyer({
      name, 
      email,
      age, 
      contact_number,
      batch_name,
      wallet
  });

  newBuyer.save()
  .then(() => res.json('Buyer registered!'))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Buyer.findById(req.params.id)
    .then(buyer => res.json(buyer))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Buyer.findByIdAndDelete(req.params.id)
    .then(() => res.json('Buyer deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Buyer.findById(req.params.id)
    .then(buyer => {
      buyer.name = req.body.name;
      buyer.email = req.body.email;
      buyer.age = req.body.age;
      buyer.batch_name = req.body.batch_name;
      buyer.wallet = req.body.wallet;

      buyer.save()
        .then(() => res.json('Buyer updated!'))
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
