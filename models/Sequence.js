const mongoose = require("mongoose");
const SequenceSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    sequence_value: {
        type: Number,
        required: true,
    }
});

module.exports = Sequence = mongoose.model("sequence", SequenceSchema);