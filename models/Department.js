const mongoose = require("mongoose");
const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    shortName: {
        type: String,
        required: true,
    },
    shortName: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = department = mongoose.model("department", departmentSchema);