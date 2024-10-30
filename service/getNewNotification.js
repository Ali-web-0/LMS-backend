const User = require('../models/User.js');
const UserRequest = require('../models/UserRequest.js');

const getNewNotification = async (req, res) => {
  try {
    const user = await User.findOne({_id: req.user.id})
    if(user.role === 'manager'){
      let userReq = await UserRequest.find({ status: 'Pending', view: false, manager: req.user.id });
      res.json(userReq);  
    }else{
      let userReq = await UserRequest.find({ status: 'Pending', view: false });
      res.json(userReq);
    }
  } catch (error) {
    res.json({ message: error.message });
  }
}

module.exports = { getNewNotification };
