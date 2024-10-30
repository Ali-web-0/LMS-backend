const leavetype = require("../models/LeaveTypes");
const User = require("../models/User");
const UserLeaveBalance = require("../models/UserLeaveBalance");

const updateLeaveType = async (req, res) => {
    const leaveData = req.body;
    const editLeave = new leavetype(leaveData);
    const id = req.params.id;
    try {
        await leavetype.updateOne({ _id: id }, editLeave);
        const currentYear = new Date().getFullYear();
        if (leaveData?.numberLeave) {
            const users = await User.find({ role: { $in: ['user', 'manager'] } });
            await users.map(async (user) => {
                const year = new Date(user.joinDate).getFullYear();
                let totalLeave = leaveData?.numberLeave;
                if (year === currentYear) {
                    const month = new Date(user.joinDate).getMonth();
                    const noOfLeave = ((leaveData?.numberLeave / 12) * (12 - month)).toFixed(1);
                    totalLeave = Math.round(noOfLeave * 2) / 2;
                }
                await UserLeaveBalance.updateOne(
                    { leaveTypeId: id, userId: user.id, year: currentYear },
                    {
                        $set: {
                            totalLeave: totalLeave,
                            modifiedAt: Date.now(),
                            leaveCategory: leaveData.leaveType
                        }
                    }
                );
                
            });
        }
        res.json(editLeave);
    } catch (error) {
        res.json({ message: error.message })
    }
}

module.exports = { updateLeaveType };

