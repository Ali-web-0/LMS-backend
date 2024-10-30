const leavetype = require("../models/LeaveTypes");
const UserLeaveBalance = require("../models/UserLeaveBalance");

const deleteLeaveType = async (req, res) => {
    try {
        const leaveTypeObj = await leavetype.findByIdAndDelete(req.params.id);

        if (!leaveTypeObj) {
            return res.status(404).json({ message: 'Leave type not found' });
        }

        const result = await UserLeaveBalance.deleteMany({ leaveCategory: leaveTypeObj.leaveType });
        console.log('Deleted records:', result.deletedCount);
        res.json("User Deleted Successfully");
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = { deleteLeaveType };

