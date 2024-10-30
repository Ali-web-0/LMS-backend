const LeavePolicy = require("../models/LeavePolicy");

const setLeavePolicy = async (req, res) => {
    const leaveData = req.body;
    try {
        const oldleavePolicy = await LeavePolicy.findOne();
        if (oldleavePolicy) {
            await LeavePolicy.updateOne({ _id: oldleavePolicy.id }, leaveData);
            const updatedLeavePolicy = await LeavePolicy.findById(oldleavePolicy.id);
            res.json(updatedLeavePolicy);
        } else {
            const leavePolicy = new LeavePolicy(leaveData);
            await leavePolicy.save();
            res.json(leavePolicy);
        }
    } catch (error) {
        res.json({ message: error.message })
    }
}

module.exports = { setLeavePolicy };

