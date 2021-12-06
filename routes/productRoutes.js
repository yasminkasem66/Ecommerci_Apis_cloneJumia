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
  getCategories,
  getParentCategories
} = require('../controllers/productController');

const { getSingleProductReviews } = require('../controllers/reviewController');

router
  .route('/')
  .post([authenticateUser, authorizeRoles('admin')], createProduct)
  .get(getAllProducts);

router
  .route('/uploadImage')
  .post( uploadImage);
 
// 222
// router
//   .route('/upload')
//   .post([authenticateUser, authorizeRoles('admin')], upload.single('image'));


router.route('/categories').get(getCategories);
router.route('/ParentCategories').get(getParentCategories);

  

router
  .route('/:id')
  .get(getSingleProduct)
  .patch([authenticateUser, authorizeRoles('admin')], updateProduct)
  .delete([authenticateUser, authorizeRoles('admin')], deleteProduct);

router.route('/:id/reviews').get(getSingleProductReviews);




module.exports = router;
