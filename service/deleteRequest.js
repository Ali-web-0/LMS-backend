const UserRequest = require('../models/UserRequest.js');

const deleteRequest = async (req, res) => {
  try {
    await UserRequest.deleteOne({ _id: req.params.id });
    res.json('User Deleted Successfully');
  } catch (error) {
    res.json({ message: error.message });
  }
}

module.exports = { deleteRequest };

