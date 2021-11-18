const express = require('express');
const router = express.Router();
// const {
//   authenticateUser,
//   authorizePermissions,
// } = require('../middleware/authentication');
const {
  authenticateUser,
  authorizeRoles,
} = require('../middleware/full-auth');
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  getAllAdmins
} = require('../controllers/userController');

router
  .route('/')
  .get(authenticateUser, authorizeRoles('admin'), getAllUsers);

router
  .route('/getAdmins')
  .get(authenticateUser, authorizeRoles('admin'), getAllAdmins);
// router
//   .route('/')
//   .get(authenticateUser, authorizePermissions('admin'), getAllUsers);

router.route('/showMe').get(authenticateUser, showCurrentUser);

router.route('/updateUser').patch(authenticateUser, updateUser);

router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);

router.route('/:id').get(authenticateUser, getSingleUser);

module.exports = router;
