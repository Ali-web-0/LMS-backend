const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const auth = require("../middlewares/auth");
const { getLeaveTypes } = require("../service/getLeaveTypes");
const { getLeaveTypeById } = require("../service/getLeaveTypeById");
const { updateLeaveType } = require("../service/updateLeaveType");
const { deleteLeaveType } = require("../service/deleteLeaveType");
const { addLeaveType } = require("../service/addLeaveType");
const { checkRole } = require("../middlewares/checkRole");

// @route   POST /LeaveTypes
// @desc    Leave Type and number
// @access  Private
router.post('/leave', [
    check("leaveType", "leaveType is required").not().isEmpty(),
    check("numberLeave", "numberLeave is required").not().isEmpty(),
], auth, checkRole(["admin"]), addLeaveType)

// @route   get /Leave
// @desc    Get all
// @access  Public
router.get('/leave', auth, checkRole(["admin","manager","user"]), getLeaveTypes)

// @route   GET /Leave
// @desc    Get leave by id
// @access  Private
router.get("/leave/:id", auth, checkRole(["admin","manager","user"]), getLeaveTypeById);

// @route   Update /Leave
// @desc    Get user by id
// @access  Private
router.patch('/leave/:id', auth, checkRole(["admin"]), updateLeaveType)
// @route   Delete /Leave
// @desc    Get user by id
// @access  Private
router.delete('/leave/:id', auth, checkRole(["admin"]), deleteLeaveType)


module.exports = router;
