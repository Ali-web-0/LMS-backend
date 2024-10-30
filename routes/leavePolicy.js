const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const auth = require("../middlewares/auth");
const { getLeavePolicies } = require("../service/getLeavePolicies");
const { getLeavePolicyById } = require("../service/getLeavePolicyById");
const { updateLeavePolicy } = require("../service/updateLeavePolicy");
const { deleteLeavePolicy } = require("../service/deleteLeavePolicy");
const { addLeavePolicy } = require("../service/addLeavePolicy");
const { checkRole } = require("../middlewares/checkRole");

// @route   POST /policyTypes
// @desc    Leave Policy and number
// @access  Private
router.post('/policy', [
    check("title", "title is required").not().isEmpty(),
    check("content", "content is required").not().isEmpty(),
], auth, checkRole(["admin"]), addLeavePolicy)

// @route   get /policy
// @desc    Get all
// @access  Public
router.get('/policy', auth, checkRole(["admin","manager","user"]), getLeavePolicies)

// @route   GET /policy
// @desc    Get leave by id
// @access  Private
router.get("/policy/:id", auth, checkRole(["admin","manager","user"]), getLeavePolicyById);

// @route   Update /policy
// @desc    Get user by id
// @access  Private
router.patch('/policy/:id', auth, checkRole(["admin"]), updateLeavePolicy)
// @route   Delete /policy
// @desc    Get user by id
// @access  Private
router.delete('/policy/:id', auth, checkRole(["admin"]), deleteLeavePolicy)


module.exports = router;
