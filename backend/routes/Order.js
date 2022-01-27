const router = require('express').Router();
let Order = require('../models/Order');
let Food = require('../models/Food')
const Vendor = require('../models/Vendor');

router.route('/').get((req, res) => {
  Order.find()
    .then(order => res.json(order))
    .catch(err => res.status(200).json('Error: ' + err));
});

router.route('/register').post(async (req, res) => {
  const placed_time = req.body.placed_time;
  const buyer = req.body.buyer;
  const food = req.body.food;
  const a = await Food.findById(food)
  const canteen = a.canteen;
  const quantity = req.body.quantity; 
  const status = 0;
  const cost = req.body.cost;
  const rating = req.body.rating || 0;
  const toppings = req.body.toppings || []
  const newOrder = new Order({
      placed_time,
      buyer,
      food,
      canteen,
      quantity,
      status,
      cost,
      rating,
      toppings
  });
  const b = await Vendor.findById(canteen);
  b.order_stats.placed++;
  b.save();
  newOrder.save()
  .then(() => res.json({ status: 0, }))
  .catch(err => res.status(200).json({status: 1, error: err}));
});

router.route('/:id').get((req, res) => {
    Order.findById(req.params.id)
    .then(order => res.json(order))
    .catch(err => res.status(200).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Order.findByIdAndDelete(req.params.id)
    .then(() => res.json('Order deleted.'))
    .catch(err => res.status(200).json('Error: ' + err));
});

router.route('/canteen/:canteen').get((req, res) => {
  Order.find({"canteen" : req.params.canteen})
    .then(food => res.json(food))
    .catch(err => res.status(200).json('Error: ' + err));
});
router.route('/reject/:id').get((req, res) => {
    Order.findById(req.params.id)
        .then(order => {
            if (order.status == 5) {
                res.status(200).json('Error: Order already rejected');
            }
            else if (order.status != 0) {
                res.status(200).json('Error: Order has already been accepted');
            }
            else {
                order.status = 5; 
                order.save()
                    .then(() => res.json('Order Rejected'))
                    .catch(() => res.status(200).json('Error: ' + err));
            }
        })
        .catch(err => res.status(200).json('Error: ' + err));
});
router.route("/buyer/:id").get(async (req, res) => {
    Order.find({buyer: req.params.id})
    .then((orders) => {
        return res.status(200).json({
            status: 0,
            orders: orders 
        })
    })
    .catch((err) => {
        return res.status(200).json({
            status: 1,
            error: err
        })
    });

});
router.route("/vendor/:id").get(async (req, res) => {
    Order.find({vendor: req.params.id})
    .then((orders) => {
        return res.status(200).json({
            status: 0,
            orders: orders 
        })
    })
    .catch((err) => {
        return res.status(200).json({
            status: 1,
            error: err
        })
    });

});
// Update order
router.route('/update/:id').get(async (req, res) => {
  let order = await Order.findById(req.params.id);
	if (order.status == 5) {
			res.status(200).json({
					status: 1,
					error: 'Order already rejected'
			})
	}
	else if (order.status == 4) {
			res.status(200).json({
					status: 1,
					error: 'Order already completed'
			})
	}
	else {
			if (order.status === 0 && order.multi === 10) {
					return res.status(200).json({
							status: 1,
							error: "Please finish cooking the other orders"
					});
			}
			order.status = order.status + 1;
			switch(order.status) {
					case 1:
							res.status(200).json({
									status: 0,
									message: 'Order accepted!'
							})
							order.multi++;
							break;
					case 2:
							res.status(200).json({
									status: 0,
									message: 'Order is now being cooked!'
							})
							break;
					case 3:
							res.status(200).json({
									status: 0,
									message: 'Order is ready for pickup!'
							})
							order.multi--;
							break;
					case 4:
							res.status(200).json({
									status: 0,
									message: 'Order is completed!'
							})
							break;
			}
	}
	order.save()
	if (order.status === 1) {
			// Updating food item sold stats 
			const food = await Food.findById(order.food);
			food.times_sold += order.quantity;
			food.save();
			// Updating vendor order stats
			const vendor = await Vendor.findById(order.canteen);
			vendor.order_stats.pending++;
			vendor.save();
	}
	else if (order.status == 4) {
			// Updating vendor order stats
			const vendor = await Vendor.findById(order.canteen);
			vendor.order_stats.completed++;
			vendor.order_stats.pending--;
			vendor.save();
	}
			
});

module.exports = router;
