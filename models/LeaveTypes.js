const mongoose = require("mongoose");
const LeaveTypeSchema = new mongoose.Schema({
    leaveType: {
        type: String,
        required: true,
    },
    numberLeave: {
        type: Number,
        required: true,
    },
    carryOverPercentage: {
        type: Number,
        required: true,
    },
    carryOverMaxDays: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
});

module.exports = leavetype = mongoose.model("leavetype", LeaveTypeSchema);