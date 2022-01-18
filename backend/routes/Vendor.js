const router = require('express').Router();
let Vendor = require('../models/Vendor');

router.route('/').get((req, res) => {
  Vendor.find()
    .then(vendors => res.json(vendors))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/register').post((req, res) => {
  const manager_name = req.body.manager_name;
  const shop_name = req.body.shop_name;
  const email = req.body.email;
  const contact_number = req.body.contact_number;
  const canteen_timings = req.body.canteen_timings;
  const order_stats = [0,0,0];
  const newVendor = new Vendor({
      manager_name, 
      shop_name,
      email,
      contact_number, 
      canteen_timings,
      order_stats
  });

  newVendor.save()
  .then(() => res.json('Vendor registered!'))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Vendor.findById(req.params.id)
    .then(vendor => res.json(vendor))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Vendor.findByIdAndDelete(req.params.id)
    .then(() => res.json('Vendor deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Vendor.findById(req.params.id)
    .then(vendor => {
      vendor.manager_name = req.body.manager_name;
      vendor.shop_name = req.body.shop_name;
      vendor.email = req.body.email;
      vendor.contact_number = req.body.contact_number;
      vendor.canteen_timings = req.body.canteen_timings;

      vendor.save()
        .then(() => res.json('Vendor updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
