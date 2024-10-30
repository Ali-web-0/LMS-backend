const mongoose = require('mongoose');

const UserLeaveBalanceSchema = new mongoose.Schema({
  totalLeave: {
    type: Number,
    required: true,
  },
  usedLeave: {
    type: Number,
    required: true,
  },
  carryOverLeave: {
    type: Number,
    required: true,
  },
  leaveCategory: {
    type: String,
    required: true,
  },
  leaveTypeId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  modifiedAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = UserLeaveBalance = mongoose.model('userLeaveBalance', UserLeaveBalanceSchema);