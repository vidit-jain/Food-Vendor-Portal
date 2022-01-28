const router = require('express').Router();
let Vendor = require('../models/Vendor');
let Order = require('../models/Order');
let mongoose = require('mongoose');

router.route('/').get((req, res) => {
  Vendor.find()
    .then(vendors => res.json(vendors))
    .catch(err => res.status(200).json('Error: ' + err));
});

router.route('/register').post((req, res) => {
  const name = req.body.name;
  const shop_name = req.body.shop_name;
  const email = req.body.email;
  const contact_number = req.body.contact_number;
  const canteen_timings = req.body.canteen_timings;
  const order_stats = [0,0];
  const newVendor = new Vendor({
      name, 
      shop_name,
      email,
      contact_number, 
      canteen_timings,
      order_stats
  });

  newVendor.save()
  .then(() => res.json('Vendor registered!'))
  .catch(err => res.status(200).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Vendor.findById(req.params.id)
    .then(vendor => res.json({
      status: 0,
      vendor: vendor 
    }))
    .catch(err => res.status(200).json({
      status: 1,
      error: err
    }));
});

router.route('/pending/:id').get(async (req, res) => {
    let doc = await Order.aggregate([
      {$match : {$and : [{canteen: new mongoose.Types.ObjectId(req.params.id)}, 
                          {$and : [{status: {$gte: 1}}, {status: {$lte: 3}}]} 
                        ]
                }
      }
    ])
    return res.status(200).json({
      status: 0,
      pending: doc.length
    })
});
router.route("/batchwise/:id").get(async (req, res) => {
  const myMap = new Map();
  let doc = await Order.find({"canteen": req.params.id, "status": 4});
  for (let i in doc) {
    let a = doc[i];
    let b = await Buyer.findById(a.buyer);
    if (!myMap.has(b.batch_name)) myMap.set(b.batch_name, 0);

    myMap.set(b.batch_name, myMap.get(b.batch_name) + 1);
  }
  let orders = Array.from(myMap);
  orders.sort();
  let labels = []
  let count = []
  for (let i in orders) {
    labels.push(orders[i][0])
    count.push(orders[i][1])
  }
  return res.status(200).json({
    status: 0,
    labels: labels,
    count: count
  })
}
);
router.route("/agewise/:id").get(async (req, res) => {
  const myMap = new Map();
  let doc = await Order.find({"canteen": req.params.id, "status": 4});
  for (let i in doc) {
    let a = doc[i];
    let b = await Buyer.findById(a.buyer);
    if (!myMap.has(b.age)) myMap.set(b.age, 0);

    myMap.set(b.age, myMap.get(b.age) + 1);
  }
  let orders = Array.from(myMap);
  orders.sort();
  let labels = []
  let count = []
  for (let i in orders) {
    labels.push(orders[i][0])
    count.push(orders[i][1])
  }
  return res.status(200).json({
    status: 0,
    labels: labels,
    count: count
  })
}
);
router.route('/:id').delete((req, res) => {
  Vendor.findByIdAndDelete(req.params.id)
    .then(() => res.json({
      status: 0
    }))
    .catch(err => res.status(200).json({
      status: 1,
      error: err
    }));
});

router.route('/update/:id').post((req, res) => {
  Vendor.findById(req.params.id)
    .then(vendor => {
      vendor.name = req.body.name;
      vendor.shop_name = req.body.shop_name;
      vendor.email = req.body.email;
      vendor.contact_number = req.body.contact_number;
      vendor.canteen_timings = req.body.canteen_timings;

      vendor.save()
        .then(() => res.json('Vendor updated!'))
        .catch(err => res.status(200).json('Error: ' + err));
    })
    .catch(err => res.status(200).json('Error: ' + err));
});

module.exports = router;
