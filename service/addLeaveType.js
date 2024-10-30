const leavetype = require("../models/LeaveTypes");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const UserLeaveBalance = require("../models/UserLeaveBalance");

const addLeaveType = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }
  const leave = req.body;
  const lType = req.body.leaveType;
  const newLeaveType = new leavetype(leave);
  try {
      let userLeave = await leavetype.findOne({ leaveType: lType });
      if (userLeave) {
          res.status(400).json({ errors: [{ msg: "This type already declared" }] });
      } else {
          const savedLeaveType = await newLeaveType.save()                    
          const currentYear = new Date().getFullYear();
          User.find({role: { $in: ['user', 'manager'] } }, (err, results) => {
            if (err) {
              console.error('Error:', err);
            } else {
              results.map(async(user) => {
                const year = new Date(user.joinDate).getFullYear();
                let totalLeave = newLeaveType?.numberLeave
                if(year === currentYear){
                    const month = new Date(user.joinDate).getMonth();
                    const noOfLeave = ((newLeaveType?.numberLeave / 12) * (12 - month)).toFixed(1);
                    totalLeave = Math.round(noOfLeave * 2) / 2;
                }
                const balance = new UserLeaveBalance({
                    totalLeave: totalLeave,
                    usedLeave: 0,
                    carryOverLeave: 0,
                    leaveCategory: lType,
                    leaveTypeId: savedLeaveType._id,
                    userId: user._id,
                    year: currentYear,
                    createdAt: Date.now(),
                    modifiedAt: Date.now()
                });
                await balance.save();
            });
            }
          });
          res.status(201).json(newLeaveType);
      }
  } catch (error) {
      res.json({ message: error.message })
  }
}

module.exports = { addLeaveType };

