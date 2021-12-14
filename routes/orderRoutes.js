const express = require('express');
const router = express.Router();
// const {
//   authenticateUser,
//   authorizeRoles,
// } = require('../middleware/authentication');
const {
  authenticateUser,
  authorizeRoles,
} = require('../middleware/full-auth');

const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
  pendingOrders,
  completedOrders
} = require('../controllers/orderController');

router
  .route('/')
  .post(authenticateUser, createOrder)
  .get(authenticateUser, authorizeRoles('admin'), getAllOrders);

router
  .route('/pending')
  .get(authenticateUser, authorizeRoles('admin'), pendingOrders);

router
  .route('/completed')
  .get(authenticateUser, authorizeRoles('admin'), completedOrders);


router.route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrders);

router
  .route('/:id')
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder);

module.exports = router;
