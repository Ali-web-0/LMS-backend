const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middlewares/auth.js');
const { addRequest } = require('../service/addRequest.js');
const { getAllRequest } = require('../service/getAllRequest.js');
const { getRequestById } = require('../service/getRequestById.js');
const { getRequestByUserId } = require('../service/getRequestByUserId.js');
const { getLeavesCountByUserId } = require('../service/getLeavesCountByUserId.js');
const { getRequestByManagerId } = require('../service/getRequestByManagerId.js');
const { updateRequest } = require('../service/updateRequest.js');
const { deleteRequest } = require('../service/deleteRequest.js');
const { viewNotificationRequestById } = require('../service/viewNotificationRequestById.js');
const { getNewNotification } = require('../service/getNewNotification.js');
const { getOldNotification } = require('../service/getOldNotification.js');
const { checkRole } = require('../middlewares/checkRole.js');
const { addLeaveBalance } = require('../service/addLeaveBalance.js');
// @route   POST /userRequest
// @desc    userRequest
// @access  Private
router.post(
  '/request',
  [
    check('startDate', 'start Date is required').not().isEmpty(),
    check('endDate', 'end Date is required').not().isEmpty(),
    check('leaveCategory', 'Category is required').not().isEmpty(),
    check('leaveDescription', 'leaveCategory is required').not().isEmpty(),
  ],
  auth,
  checkRole(["admin","manager","user"]),
  addRequest
);

router.get('/notification/new-request', auth, checkRole(["admin","manager"]), getNewNotification);

router.get('/notification/old-request', auth, checkRole(["admin","manager"]), getOldNotification);

router.patch('/notification/request/:id', auth, checkRole(["admin","manager"]), viewNotificationRequestById);

// @route   get /userRequest
// @desc    Get all
// @access  Private
router.get('/request', auth, checkRole(["admin","manager","user"]), getAllRequest);

// @route   get by id /userRequest
// @desc    Get Login user
// @access  Private
router.get('/request/:id', auth, checkRole(["admin","manager","user"]), getRequestById);

// @route   get by userid /userRequest
// @desc    Get Login user
// @access  Private
router.get('/request/userleave/:id', auth, checkRole(["admin","manager","user"]), getRequestByUserId);

// @route   get Group by/userRequest
// @desc    Get Group user levae
// @access  Private
router.get('/request/usercount/:id', auth, checkRole(["admin","manager","user"]), getLeavesCountByUserId);

// @route   get by manager /userRequest
// @desc    manager
// @access  Private
router.get('/request/manageleave/:id', auth, checkRole(["admin","manager","user"]), getRequestByManagerId);

// @route   Update /users/userRequest
// @desc    Get user by id
// @access  Private
router.patch('/request/:id', auth, checkRole(["admin","manager"]), updateRequest);

// @route   Delete /User Request
// @desc    Get user by id
// @access  Private
router.delete('/request/:id', auth, checkRole(["admin","manager"]), deleteRequest);

// @route   POST /userRequest
// @desc    userRequest
// @access  Private
router.post(
  '/addLeavesBalance',
  auth,
  checkRole(["admin"]),
  addLeaveBalance
);
module.exports = router;
