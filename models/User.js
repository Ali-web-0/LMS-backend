const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        default: 'user'
    },
    password: {
        type: String,
        required: true,
    },
    manager: {
        type: String,
    },
    employee: {
        type: Number,
    },
    gender: {
        type: String,
    },
    phoneNo: {
        type: String,
    },
    emergencyContact: {
        type: String,
    },
    department: {
        type: String,
    },
    joinDate: {
        type: Date,
        required: true
    },
    datepicker: {
        type: Date,
        required: true
    },
    position: {
        type: String,
    },
    address: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    verified: {
        type: Boolean,
        default: false,
    },
});

module.exports = User = mongoose.model("user", UserSchema);