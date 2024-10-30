const LeavePolicy = require("../models/LeavePolicy");

const deleteLeavePolicy = async (req, res) => {
    try {
        await LeavePolicy.deleteOne({ _id: req.params.id })
        res.json("Policy Deleted Successfully")
    } catch (error) {
        res.json({ message: error.message })
    }
}

module.exports = { deleteLeavePolicy };

