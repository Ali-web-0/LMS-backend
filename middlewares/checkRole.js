const jwt = require("jsonwebtoken");
const User = require("../models/User");
const jwtSecret = require('../config/keys').jwtSecret;

/**
 * @DESC Check Role Middleware
**/
const checkRole = (roles) => async (req, res, next) => {
    //Verify token
    try {
        const user = await User.findOne({ '_id': req.user.id });
        !roles.includes(user.role)        
            ? res.status(401).json("Sorry you do not have access to this api")
            : next();
    } catch (err) {
        res.status(401).json({ msg: "User not found" });
    }    
  };

  module.exports = { checkRole };
