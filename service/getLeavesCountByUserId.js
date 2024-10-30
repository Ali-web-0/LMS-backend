const UserRequest = require('../models/UserRequest.js');
const UserLeaveBalance = require('../models/UserLeaveBalance.js');
const LeaveTypes = require('../models/LeaveTypes.js');

const getLeavesCountByUserId = async (req, res) => {
  const userid = req.params.id;
  const year = req.query.year;
  try {
    const newArr = await getLeavesCount(userid, year);
    res.status(200).json(newArr);
  } catch (error) {
    res.json({ message: error.message });
  }
}

async function getLeavesCount(userid, year = new Date().getFullYear()) {
  const userLeaveBalances = await UserLeaveBalance.find({userId: userid, year: year });
  const leaveTypes = await LeaveTypes.find();
  const newArr = await Promise.all(leaveTypes.map( async(adminLeave) => {
    let userLeaveBalance = userLeaveBalances.find((entry) => adminLeave?.leaveType == entry?.leaveCategory);
    if (!userLeaveBalance){
      let currentYear = new Date().getFullYear();
      if(year == currentYear) {
        userLeaveBalance = await addNewYearBalance(adminLeave, userid, year);
      }else{
        return null;
      }
    }
    const pendingLeaves = await getPendingLeaves(userid, year);
    const requestEntry = pendingLeaves.find((entry) => adminLeave?.leaveType == entry?._id?.leaveCategory);
    if (requestEntry) {
      return {
        leaveType: adminLeave?.leaveType,
        numberLeave: userLeaveBalance?.totalLeave + userLeaveBalance?.carryOverLeave,
        usedLeave: userLeaveBalance?.usedLeave,
        appliedLeave: requestEntry.appliedLeave,
        availableLeave: Math.round(((userLeaveBalance?.totalLeave + userLeaveBalance?.carryOverLeave) - userLeaveBalance?.usedLeave - requestEntry.appliedLeave) * 2) / 2,
        previousLeave: userLeaveBalance?.carryOverLeave,
      };
    }
    return {
      leaveType: adminLeave?.leaveType,
      numberLeave: userLeaveBalance?.totalLeave + userLeaveBalance?.carryOverLeave,
      usedLeave: userLeaveBalance?.usedLeave,
      appliedLeave: 0,
      availableLeave: Math.round(((userLeaveBalance?.totalLeave + userLeaveBalance?.carryOverLeave) - userLeaveBalance?.usedLeave ) * 2) / 2,
      previousLeave: userLeaveBalance?.carryOverLeave,
    };
  }));
  return newArr.filter(item => item !== null);
}
async function addNewYearBalance(adminLeave, userid, year) {
  let totalLeave = adminLeave?.numberLeave;
  let remainingLeave = 0;
  const previousTotalLeave = await UserLeaveBalance.findOne({ userId: userid, year: year - 1 });
  if (previousTotalLeave) {
    let previousRemainingLeave = previousTotalLeave.totalLeave;
    const pendingLeaves = await getPendingLeaves(userid, year - 1);
    const oldRequestEntry = pendingLeaves.find((entry) => adminLeave?.leaveType == entry?._id?.leaveCategory);
    if (oldRequestEntry) {
      previousRemainingLeave = previousTotalLeave.totalLeave - previousTotalLeave.usedLeave - oldRequestEntry.appliedLeave;
    }else{
      previousRemainingLeave = previousTotalLeave.totalLeave - previousTotalLeave.usedLeave;
    }
    remainingLeave = (adminLeave.carryOverPercentage / 100) * previousRemainingLeave;
    remainingLeave = Math.round(remainingLeave * 2) / 2;
    totalLeave = Math.round(totalLeave * 2) / 2;
    const maximumTotal = totalLeave + remainingLeave;
    if (maximumTotal > adminLeave.carryOverMaxDays) {
      const minus = maximumTotal - adminLeave.carryOverMaxDays;
      remainingLeave = remainingLeave - minus;
    }
  }
  let userLeaveBalance = new UserLeaveBalance({
    totalLeave: totalLeave,
    usedLeave: 0,
    carryOverLeave: remainingLeave,
    leaveCategory: adminLeave.leaveType,
    userId: userid,
    year: year,
    leaveTypeId: adminLeave._id,
    createdAt: Date.now(),
    modifiedAt: Date.now()
  });
  await userLeaveBalance.save();
  return userLeaveBalance;
}

async function getPendingLeaves(userid, currentYear) {
  const pipeline = [
    {
      $match: {
        userid: userid,
        date: {
          $regex: `.*${currentYear}.*`,
        },
      },
    },
    {
      $group: {
        _id: {
          leaveCategory: '$leaveCategory',
        },
        appliedLeave: {
          $sum: {
            $cond: { if: { $eq: ['$status', 'Pending'] }, then: { $sum: '$noOfDays' }, else: 0 }
          },
        }
      },
    },
    {
      $project: {
        _id: 1,
        appliedLeave: 1,
      },
    },
  ];
  const userRequest = await UserRequest.aggregate(pipeline);
  return userRequest;
}

module.exports = { getLeavesCountByUserId };

