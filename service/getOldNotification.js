const User = require('../models/User.js');
const UserRequest = require('../models/UserRequest.js');

const getOldNotification = async (req, res) => {
  try {
    const user = await User.findOne({_id: req.user.id})
    if(user.role === 'manager'){
      let userReq = await UserRequest.find({ status: 'Pending', view: true, manager: req.user.id });
      res.json(userReq);
    } else if(user.role === 'admin'){
      let userReq = await UserRequest.find({ status: 'Pending', view: true });
      res.json(userReq);
    }
  } catch (error) {
    res.json({ message: error.message });
  }
}

module.exports = { getOldNotification };
