const { empCodeSequence } = require("../config/keys");

const getNewEmpCode = async (req, res) => {
    try {
        const sequenceDoc = await Sequence.findOne(
            { _id: empCodeSequence }
        );
        const sequence_value = sequenceDoc.sequence_value + 1;
        res.json({id: sequence_value });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

module.exports = { getNewEmpCode };