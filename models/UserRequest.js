const { body } = require('express-validator');
const mongoose = require('mongoose');

const UserRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  employee: {
    type: String,
  },
  gender: {
    type: String,
  },
  phoneNo: {
    type: String,
  },
  username: {
    type: String,
  },
  adminRemark: {
    type: String,
    default: 'Pending',
  },
  adminActionDate: {
    type: String,
    default: '',
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  noOfDays: {
    type: Number,
    required: true,
  },
  halfDay: {
    type: Boolean,
    default: false,
    required: true,
  },
  leaveCategory: {
    type: String,
    required: true,
  },
  leaveDescription: {
    type: String,
    required: true,
  },
  view: {
    type: Boolean,
    default: false,
    required: true,
  },
  status: {
    type: String,
    default: 'Pending',
  },
  userid: {
    type: String,
    required: true,
  },
  manager: {
    type: String,
  },
  joinDate: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: Date.now,
  },
});

module.exports = UserRequest = mongoose.model('userrequest', UserRequestSchema);
