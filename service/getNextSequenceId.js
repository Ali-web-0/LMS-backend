const Sequence = require("../models/Sequence");

module.exports = async function getValueForNextSequence(sequenceId){
    try {
        const sequenceDoc = await Sequence.findOneAndUpdate(
            { _id: sequenceId },
            { $inc: { sequence_value: 1 } },
            { new: true, upsert: true }
        );
        return sequenceDoc.sequence_value;
    } catch (err) {
        console.error(err);
        throw err; // You can handle the error as needed
    }
}
