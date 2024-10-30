const LeavePolicy = require("../models/LeavePolicy");

const getLeavePolicyById = async (req, res) => {
    try {
        const leave = await LeavePolicy.findById({ _id: req.params.id });
        res.json(leave);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

module.exports = { getLeavePolicyById };

