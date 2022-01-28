const router = require('express').Router();
let Buyer = require('../models/Buyer');

router.route('/').get((req, res) => {
  Buyer.find()
    .then(buyers => res.json(buyers))
    .catch(err => res.status(200).json('Error: ' + err));
});

router.route('/register').post((req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const age = req.body.age;
  const contact_number = req.body.contact_number;
  const batch_name = req.body.batch_name;
  const wallet = req.body.wallet || 0;
  const favorites = req.body.favorites || [];
  const newBuyer = new Buyer({
      name, 
      email,
      age, 
      contact_number,
      batch_name,
      wallet,
      favorites
  });

  newBuyer.save()
  .then(() => res.json('Buyer registered!'))
  .catch(err => res.status(200).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Buyer.findById(req.params.id)
    .then(buyer => res.json(buyer))
    .catch(err => res.status(200).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Buyer.findByIdAndDelete(req.params.id)
    .then(() => res.json('Buyer deleted.'))
    .catch(err => res.status(200).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Buyer.findById(req.params.id)
    .then(buyer => {
      buyer.name = req.body.name;
      buyer.email = req.body.email;
      buyer.age = req.body.age;
      buyer.batch_name = req.body.batch_name;

      buyer.save()
        .then(() => res.json('Buyer updated!'))
        .catch(err => res.status(200).json('Error: ' + err));
    })
    .catch(err => res.status(200).json('Error: ' + err));
});

router.route('/favorite/:id').post((req, res) => {
  let usertoken = req.usertoken;
  Buyer.findOne({email: usertoken.email})
    .then(buyer => {
      Food.findById(req.params.id)
        .then(food => {
          let index = buyer.favorites.indexOf(req.params.id);
          if (index > -1) {
            buyer.favorites.splice(index, 1);
          }
          else {
            buyer.favorites.push(req.params.id);
          }
          buyer.save()
            .then (() => res.status(200).json({ status: 0 }))
            .catch ((err) => res.json({status: 1, error: err}));
        })
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
