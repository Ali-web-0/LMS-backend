const User = require("../models/User");
const { validationResult } = require("express-validator");
const UserLeaveBalance = require("../models/UserLeaveBalance.js");
const LeaveTypes = require("../models/LeaveTypes.js");

const addLeaveBalance = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const leaves = req.body;
    try {
      leaves.map( async(leave) => {
        const leaveType = await LeaveTypes.findOne({ leaveType: leave.leaveType });
        if(leaveType){
          await createUserLeaveBalance(leave, leaveType);
        }
    });
      res.status(201).json("successfully add data");
    } catch (error) {
      res.json({ message: error.message });
    }
}


module.exports = { addLeaveBalance };

async function createUserLeaveBalance(leave, leaveType) {
  const foundLeaveBalance = await UserLeaveBalance.findOne({userId: leave.userId, leaveCategory: leave.leaveType, year: leave.year });
  if (foundLeaveBalance) {
    let remainingLeave = 0;
    const previousLeaveBalance = await UserLeaveBalance.findOne({ userId: leave.userId, leaveCategory: leave.leaveType, year: leave.year - 1 });
    if (previousLeaveBalance) {
      remainingLeave = (leaveType.carryOverPercentage / 100) * (previousLeaveBalance.totalLeave - previousLeaveBalance.usedLeave);
      if (remainingLeave > leaveType.carryOverMaxDays) {
        remainingLeave = leaveType.carryOverMaxDays;
      }
      remainingLeave = Math.round(remainingLeave * 2) / 2;
    }
    const balance = {
      totalLeave: leave.totalLeave,
      usedLeave: leave.usedLeave,
      carryOverLeave: remainingLeave,
    };
    console.log(foundLeaveBalance._id)
    const updateRes = await UserLeaveBalance.updateOne({ _id: foundLeaveBalance._id }, balance);
    console.log(updateRes);
    await updateNextYearLeave(leave, balance, leaveType);
  } 
  else {
      let remainingLeave = 0;
      const previousLeaveBalance = await UserLeaveBalance.findOne({ userId: leave.userId, leaveCategory: leave.leaveType, year: leave.year - 1 });
      if (previousLeaveBalance) {
        remainingLeave = (leaveType.carryOverPercentage / 100) * (previousLeaveBalance.totalLeave - previousLeaveBalance.usedLeave);
        remainingLeave = Math.round(remainingLeave * 2) / 2;
      }
      const totalLeave1 = leave.totalLeave + remainingLeave;
      if (totalLeave1 > leaveType.carryOverMaxDays) {
        const minus = totalLeave1 - leaveType.carryOverMaxDays;
        remainingLeave = remainingLeave - minus;
      }
      const balance = new UserLeaveBalance({
        totalLeave: leave.totalLeave,
        usedLeave: leave.usedLeave,
        carryOverLeave: remainingLeave,
        leaveCategory: leave.leaveType,
        userId: leave.userId,
        year: leave.year,
        leaveTypeId: leaveType._id,
        createdAt: Date.now(),
        modifiedAt: Date.now()
      });
      await balance.save();
      await updateNextYearLeave(leave, balance, leaveType);
  }
}
const createYearList = (startYear, endYear) => {
  const yearList = [];
  for (let year = startYear; year <= endYear; year++) {
    yearList.push(year);
  }
  return yearList;
};

async function updateNextYearLeave(leave, balance, leaveType) {
  const startYear = leave.year + 1;
  const currentYear = new Date().getFullYear();
  let lastLeaveBalance = balance;
  for (let year = startYear; year <= currentYear; year++) {
    const nextLeaveBalance = await UserLeaveBalance.findOne({ userId: leave.userId, leaveCategory: leave.leaveType, year: year });
    if (nextLeaveBalance) {
      let carryOverLeave = (leaveType.carryOverPercentage / 100) * (lastLeaveBalance.totalLeave - lastLeaveBalance.usedLeave);
      const totalLeave2 = nextLeaveBalance.totalLeave + carryOverLeave;
      if (totalLeave2 > leaveType.carryOverMaxDays) {
        const minus = totalLeave2 - leaveType.carryOverMaxDays;
        carryOverLeave = carryOverLeave - minus;
        console.log("carryOverLeave: "+ carryOverLeave)
      }
      nextLeaveBalance.carryOverLeave = Math.round(carryOverLeave * 2) / 2;
      console.log(nextLeaveBalance.carryOverLeave);
      lastLeaveBalance = await UserLeaveBalance.updateOne({ _id: nextLeaveBalance._id }, nextLeaveBalance);
      console.log(lastLeaveBalance);
    }
  }
}

