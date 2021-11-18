const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizeRoles,
} = require('../middleware/full-auth');

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require('../controllers/productController');

const { getSingleProductReviews } = require('../controllers/reviewController');

router
  .route('/')
  .post([authenticateUser, authorizeRoles('admin')], createProduct)
  .get(getAllProducts);

router
  .route('/uploadImage')
  .post(uploadImage);
// [authenticateUser, authorizeRoles('admin')]


  

router
  .route('/:id')
  .get(getSingleProduct)
  .patch([authenticateUser, authorizeRoles('admin')], updateProduct)
  .delete([authenticateUser, authorizeRoles('admin')], deleteProduct);

router.route('/:id/reviews').get(getSingleProductReviews);

module.exports = router;
