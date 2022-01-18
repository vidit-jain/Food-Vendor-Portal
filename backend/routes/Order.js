const router = require('express').Router();
let Order = require('../models/Order');
let Food = require('../models/Food')
let Vendor = require('../models/Vendor');
const Vendor = require('../models/Vendor');

router.route('/').get((req, res) => {
  Order.find()
    .then(order => res.json(order))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/register').post((req, res) => {
  const placed_time = req.body.placed_time;
  const canteen = req.body.canteen;
  const item_name = req.body.item_name;
  const quantity = req.body.quantity; 
  const cost = req.body.cost;
  const rating = req.body.rating || 0;
  const status = 0;
  const newOrder = new Order({
      placed_time,
      canteen,
      item_name,
      quantity,
      status,
      cost,
      rating
  });

  newOrder.save()
  .then(() => res.json('Order registered!'))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Order.findById(req.params.id)
    .then(order => res.json(order))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Order.findByIdAndDelete(req.params.id)
    .then(() => res.json('Order deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/canteen/:canteen').get((req, res) => {
  Order.find({"canteen" : req.params.canteen})
    .then(food => res.json(food))
    .catch(err => res.status(400).json('Error: ' + err));
});
router.route('/reject/:id').post((req, res) => {
    Order.findById(req.params.id)
        .then(order => {
            if (order.status == 5) {
                res.status(400).json('Error: Order already rejected');
            }
            else if (order.status != 0) {
                res.status(400).json('Error: Order has already been accepted');
            }
            else {
                order.status = 5; 
                order.save()
                    .then(() => res.json('Order Rejected'))
                    .catch(() => res.status(400).json('Error: ' + err));
            }
        })
        .catch(err => res.status(400).json('Error: ' + err));
});
// Update order
router.route('/update/:id').post((req, res) => {
  Order.findById(req.params.id)
    .then(order => {
        if (order.status == 5) {
            res.status(400).json('Error: Order already rejected');
        }
        else if (order.status == 4) {
            res.status(400).json('Error: Order already completed');
        }
        else {
            order.status = order.status + 1;
            switch(order.status) {
                case 1:
                    res.json('Order accepted!');
                    break;
                case 2:
                    res.json('Order is now being cooked!');
                    break;
                case 3:
                    res.json('Order is ready for pickup!');
                    break;
                case 3:
                    res.json('Order is completed');
                    break;
            }
        }
      order.save()
        .then(() => {
                res.json('Order updated!');
                if (order.status == 1) {
                    // Updating food item sold stats 
                    const food = Food.findOne({
                        "item_name": order.item_name, 
                        "canteen": order.canteen
                    });
                    food.times_sold++;
                    food.save();
                    // Updating vendor order stats
                    const vendor = Vendor.findOne({
                        "shop_name": order.canteen
                    });
                    vendor.order_stats.placed++;
                    vendor.order_stats.pending++;
                    vendor.save();
                }
                else if (order.status == 4) {
                    // Updating vendor order stats
                    const vendor = Vendor.findOne({
                        "shop_name": order.canteen
                    });
                    vendor.order_stats.completed++;
                    vendor.order_stats.pending--;
                    vendor.save();
                }
            }
        
        )
        .catch(err => res.status(400).json('Error: ' + err));
    
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
