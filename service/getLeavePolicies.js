const LeavePolicy = require("../models/LeavePolicy");

const getLeavePolicies = async (req, res) => {
  const {keyword, page = 0, size = 20 } = req.query;
  const pageNumber = Number(page) + 1;
  let query = {};
  if (keyword && keyword.trim() !== '') {
    const regex = new RegExp(keyword, 'i');
    query = { 
      $or: [
        { title: { $regex: regex } },
      ]
    };
  }
  try {
    const userReq = await LeavePolicy.find(query)
    .limit(size * 1)
    .skip((pageNumber - 1) * size)
    .exec();
    const count = await LeavePolicy.find(query).count();
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

module.exports = { getLeavePolicies };

