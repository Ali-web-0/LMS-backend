const UserRequest = require('../models/UserRequest.js');

const getRequestByManagerId = async (req, res) => {
  const manager = req.params.id
  if(!manager){
    return res.status(400).json({ errors: [{ msg: "manager id must not be null" }] });
  }
  const {status, keyword, page = 0, size = 10 } = req.query;
  const pageNumber = Number(page) + 1;
  let query = {};
  if (keyword && keyword.trim() !== '') {
    const regex = new RegExp(keyword, 'i');
    query = { 
      $or: [
        { name: { $regex: regex } },
        // { email: { $regex: regex } },
        { username: { $regex: regex } },
        { leaveCategory: { $regex: regex } },
        { status: { $regex: regex } },
      ]
    };
  }
  if (status && status.trim() !== '') {
    query.status = status;
  }
  query.manager = manager;
  try {
    const userReq = await UserRequest.find(query)
    .limit(size * 1)
    .skip((pageNumber - 1) * size)
    .sort({ date: -1 });
    const count = await UserRequest.find(query).count();
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

module.exports = { getRequestByManagerId };
