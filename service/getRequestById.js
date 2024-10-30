const UserRequest = require('../models/UserRequest.js');

const getRequestById = async (req, res) => {
  // const id = req.params.id;
  try {
    const userReq = await UserRequest.findById({ _id: req.params.id });
    res.json(userReq);
  } catch (error) {
    res.json({ message: error.message });
  }
}

module.exports = { getRequestById };
