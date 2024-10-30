const User = require("../models/User");
const UserRequest = require('../models/UserRequest.js');
// const sendEmail = require("../service/email.js");
const { validationResult } = require("express-validator");
const UserLeaveBalance = require("../models/UserLeaveBalance.js");

const addRequest = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userinput = req.body;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const userid = req.body.userid;
    const leaveCategory = req.body.leaveCategory;
    const halfDay = req.body.halfDay;
    try {
      let noOfDays = 0;
      if(halfDay){
        noOfDays = 0.5
      }else{
        noOfDays = getNoOfDays(startDate, endDate);
      }
      let userRequest = await UserRequest.findOne({ startDate, endDate, userid });
      if (userRequest) {
        return res.status(409).json({ errors: [{ msg: 'You have already requested a leave on this date. Please wait for applied leave approval or contact HR for further assistance.' }] });
      }
      const leaveBalance = await UserLeaveBalance.findOne({userId: userid, leaveCategory: leaveCategory, year: new Date().getFullYear() });
      const pendingLeave = await getPendingLeave(userid, leaveCategory);
      const remainingLeave = (leaveBalance.totalLeave + leaveBalance.carryOverLeave) - leaveBalance.usedLeave - pendingLeave;
      if(remainingLeave === 0){
        return res.status(409).json({ errors: [{ msg: 'You have already used all your allocated leave days of this year. Please check your leave balance or contact HR for further assistance.' }] });
      }
      if(remainingLeave < noOfDays){
        return res.status(409).json({ errors: [{ msg: 'You can only request '+ remainingLeave + ' leaves as you have used your allocated leave days of this year. Please check your leave balance or contact HR for further assistance.' }] });
      }
      const newUser = new UserRequest({...userinput, noOfDays: noOfDays});
      await newUser.save();
      // const manager = await User.findOne({_id: newUser.manager})
      // const html = ` <h3>Hello, Your employee ${newUser.name} is requested for leave.</h3>
      //             <ul>
      //               <li>Leave Type: ${newUser.leaveCategory}</li>
      //               <li>Leave Date: ${newUser.startDate}</li>
      //               <li>No of Days: ${newUser.noOfDays}</li>    
      //               <li>Leave Description: ${newUser.leaveDescription}</li>
      //             </ul>
      //             <br><br>
      //             <p>If you did not initiate this operation, you can ignore this email.
      //             <br><br> HR Eximia <br> Automated message. Please do not reply.</p>`;
      // sendEmail(manager.email,'[EXIMIA] New Leave Request',html);
      res.status(201).json(newUser);
    } catch (error) {
      res.json({ message: error.message });
    }
}

async function getPendingLeave(userid, leaveCategory) {
  const currentYear = new Date().getFullYear();
  const pipeline = [
    {
      $match: {
        userid: userid,
        leaveCategory: leaveCategory,
        status: { $in: ["Pending"] },
        date: {
          $regex: `.*${currentYear}.*`,
        },
      },
    },
    {
      $group: {
        _id: {
          leaveCategory: leaveCategory,
        },
        pendingLeave: {
          $sum: '$noOfDays',
        },
      },
    },
  ];
  const countleave = UserRequest.aggregate(pipeline);
  const arr = await countleave;
  if(arr.length > 0){
    return arr[0].pendingLeave;
  }
  return 0;
}
function getNoOfDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const noOfDays = ((end - start) / (1000 * 60 * 60 * 24)) + 1;
  return noOfDays;
}

module.exports = { addRequest };

