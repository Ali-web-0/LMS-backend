const UserLeaveBalance = require('../models/UserLeaveBalance.js');
const UserRequest = require('../models/UserRequest.js');
// const sendEmail = require("../service/email.js");

const updateRequest = async (req, res) => {
  const request = req.body;
  const id = req.params.id;
  const userRequest = await UserRequest.findById({ _id: id})
  if(request.status === 'Granted'){
    const foundBalance = await UserLeaveBalance.findOne({userId: userRequest.userid, leaveCategory: userRequest.leaveCategory, year: new Date().getFullYear() });
    if(foundBalance){
        foundBalance.usedLeave = foundBalance.usedLeave + userRequest.noOfDays;
        const res = await UserLeaveBalance.updateOne({ _id: foundBalance._id }, foundBalance);
        console.log(res)
    }
  }
  const editUser = new UserRequest(request);
  try {
    await UserRequest.updateOne({ _id: id }, editUser);
    // const userReq = await UserRequest.findOne({ _id: id });
    // const html = ` <h3>Hello, Your leave request is ${userReq.status}.</h3>
    //           <ul>
    //             <li>Leave Type: ${userReq.leaveCategory}</li>
    //             <li>Leave Date: ${userReq.startDate}</li>
    //             <li>No of Days: ${userReq.noOfDays}</li>
    //             <li>Admin Remark: ${userReq.adminRemark}</li>
    //           </ul>
    //           <br><br>
    //           <p>If you did not initiate this operation, you can ignore this email.
    //           <br><br> HR Eximia <br> Automated message. Please do not reply.</p>`;
    // sendEmail(userReq.email, `[EXIMIA] Leave Request ${userReq.status}`, html)
    res.json(editUser);
  } catch (error) {
    res.json({ message: error.message });
  }
}


module.exports = { updateRequest };

