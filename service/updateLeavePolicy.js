const LeavePolicy = require("../models/LeavePolicy");

const updateLeavePolicy = async (req, res) => {
    const leaveData = req.body;
    const editLeave = new LeavePolicy(leaveData);
    const id = req.params.id;
    try {
        await LeavePolicy.updateOne({ _id: id }, editLeave)
        res.json(editLeave)
    } catch (error) {
        res.json({ message: error.message })
    }
}

module.exports = { updateLeavePolicy };

