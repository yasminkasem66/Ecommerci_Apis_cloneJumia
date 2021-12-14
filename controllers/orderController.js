const Order = require('../models/Order');
const Product = require('../models/Product');

const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');

// let newQuantity;

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = 'someRandomValue';
  return { client_secret, amount };
};


const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError("No cart items provided");
  }
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      "Please provide tax and shipping fee"
    );
  }

  //................................................................
  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    console.log(item);
    const dbProduct = await Product.findOne({ _id: item.id });
    console.log(dbProduct.quantity);
    console.log(item.quantity);
    let newQuantity = Number(dbProduct.quantity) - Number(item.quantity);

    if (newQuantity <= 0) {
      Product.findOneAndDelete({ _id: item.id }, function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("Deleted User : ", docs);
        }
      });
    }

    const newdbProduct = await Product.findOneAndUpdate(
      { _id: item.id },
      { $set: { quantity: newQuantity } },
      { new: true }
    );

    console.log(newdbProduct);
    if (!dbProduct) {
      throw new CustomError.NotFoundError(
        `No product with id : ${item.product}`
      );
    }
    const { nameEn:name, price, image, _id } = dbProduct;
    const singleOrderItem = {
      amount: item.quantity,
      name,
      price,
      image,
      product: _id,
    };
    // add item to order
    orderItems = [...orderItems, singleOrderItem];
    // orderItems.push(singleOrderItem)
    // calculate subtotal
    subtotal += item.quantity * price;
  }
  // calculate total
  const total = tax + shippingFee + subtotal;
  // get client secret
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  });

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};



const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
  }
  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};
const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};


const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
  }
  checkPermissions(req.user, order.user);
  order.paymentIntentId = paymentIntentId;
  order.status = 'paid';
  await order.save();

  res.status(StatusCodes.OK).json({ order });
};

// get pending projects
const pendingOrders = async (req, res) => {
  const noPendingOrder = await Order.find({status:"pending"}).countDocuments();
  res.status(StatusCodes.OK).json({ noPendingOrder  });
};
//// get completed projects
const completedOrders = async (req, res) => {
  const noCompletedOrder = await Order.find({status:"completed"}).countDocuments();
  res.status(StatusCodes.OK).json({ noCompletedOrder  });
};



// -----------------------------------------------
//   Update:
// router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
//   try {
//     const updatedProject = await Project.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: req.body,
//       },

//       { new: true }
//     );
//     const saveproject = await updatedProject.save();
//     res.status(200).json(saveproject);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// new update remove cart items
// const removeCartItems = (req, res) => {
//   const { productId } = req.body.payload;
//   if (productId) {
//     Order.update(
//       { user: req.user.userId },
//       total,
//       subtotal,
//       tax,
//       {
//         $pull: {
//           orderItems: {
//             product: productId,
//           },
//         },
//       }
//     ).exec((error, result) => {
//       if (error) return res.status(400).json({ error });
//       if (result) {
//         res.status(202).json({ result });
//       }
//     });
//   }
// };

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
  pendingOrders,
  completedOrders
};




// const createOrder = async (req, res) => {
//   const { items: cartItems, tax, shippingFee } = req.body;
//   if (!cartItems || cartItems.length < 1) {
//     throw new CustomError.BadRequestError('No cart items provided');
//   }
//   if (!tax || !shippingFee) {
//     throw new CustomError.BadRequestError(
//       'Please provide tax and shipping fee'
//     );
//   }

//   //................................................................
//   let orderItems = [];
//   let subtotal = 0;

//   for (const item of cartItems) {
//     const dbProduct = await Product.findOne({ _id: item.product });
//     if (!dbProduct) {
//       throw new CustomError.NotFoundError(
//         `No product with id : ${item.product}`
//       );
//     }
//     const { name, price, image, _id } = dbProduct;
//     const singleOrderItem = {
//       amount: item.quantity,
//       name,
//       price,
//       image,
//       product: _id,
//     };
//     // add item to order
//     orderItems = [...orderItems, singleOrderItem];
//     // orderItems.push(singleOrderItem)
//     // calculate subtotal
//     subtotal += item.quantity * price;
//   }
//   // calculate total
//   const total = tax + shippingFee + subtotal;
//   // get client secret
//   const paymentIntent = await fakeStripeAPI({
//     amount: total,
//     currency: 'usd',
//   });

//   const order = await Order.create({
//     orderItems,
//     total,
//     subtotal,
//     tax,
//     shippingFee,
//     clientSecret: paymentIntent.client_secret,
//     user: req.user.userId,
//   });

//   res
//     .status(StatusCodes.CREATED)
//     .json({ order, clientSecret: order.clientSecret });
// };
