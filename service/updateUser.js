const LeaveTypes = require("../models/LeaveTypes");
const User = require("../models/User");
const UserLeaveBalance = require("../models/UserLeaveBalance");

const updateUser = async (req, res) => {
    const employeeData = req.body;
    const editemployee = new User(employeeData);
    const id = req.params.id;
    try {
        if(editemployee.joinDate){
            const user = await User.findOne({ _id: id })
            if(user.joinDate != editemployee.joinDate){
                await updateBalance(editemployee, id);
            }
        }
        await User.updateOne({ _id: id }, editemployee)
        res.json(editemployee)

    } catch (error) {
        res.json({ message: error.message })
    }
}
const updateBalance = async (user, id) => {
    const adminleave = await LeaveTypes.find();
    const joinedYear = new Date(user.joinDate).getFullYear();
    adminleave.map( async(leaveType) => {
        const foundBalance = await UserLeaveBalance.findOne({userId: id, leaveTypeId: leaveType._id, year: joinedYear });
        if(foundBalance){
            let totalLeave = leaveType?.numberLeave
            const month = new Date(user.joinDate).getMonth();
            const noOfLeave = ((leaveType?.numberLeave / 12) * (12 - month)).toFixed(1);
            totalLeave = Math.round(noOfLeave * 2) / 2;
            foundBalance.totalLeave = totalLeave;
            const res = await UserLeaveBalance.updateOne({ _id: foundBalance._id }, foundBalance);
        }
    });
}
module.exports = { updateUser };
