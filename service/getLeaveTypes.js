const leavetype = require("../models/LeaveTypes");

const getLeaveTypes = async (req, res) => {
  const {keyword, page = 0, size = 10 } = req.query;
  const pageNumber = Number(page) + 1;
  let query = {};
  if (keyword && keyword.trim() !== '') {
    const regex = new RegExp(keyword, 'i');
    query = { 
      $or: [
        { leaveType: { $regex: regex } },
      ]
    };
  }
  try {
    const userReq = await leavetype.find(query)
    .limit(size * 1)
    .skip((pageNumber - 1) * size)
    .exec();
    const count = await leavetype.find(query).count();
    res.json({
      totalElements: count,
      totalPages: Math.ceil(count / size),
      content: userReq,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ message: error.message });
  }
}

module.exports = { getLeaveTypes };

