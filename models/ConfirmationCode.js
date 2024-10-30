const mongoose = require("mongoose");
const confirmationCodeSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true,
    },
    code: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = confirmationCode = mongoose.model("confirmationCode", confirmationCodeSchema);