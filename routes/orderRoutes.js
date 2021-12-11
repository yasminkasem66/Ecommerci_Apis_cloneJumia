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
} = require('../controllers/orderController');

router
  .route('/')
  .post(authenticateUser, createOrder)
  .get(authenticateUser, authorizeRoles('admin'), getAllOrders);

router.route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrders);

router
  .route('/:id')
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder);

module.exports = router;
