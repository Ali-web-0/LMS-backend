const UserRequest = require('../models/UserRequest.js');

const viewNotificationRequestById = async (req, res) => {
  const id = req.params.id;
  try {
    await UserRequest.updateMany({ _id: id }, { $set: { view: true } });
    res.json('success');
  } catch (error) {
    res.json({ message: error.message });
  }
}


module.exports = { viewNotificationRequestById };

