const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const jwtSecret = require('../config/keys').jwtSecret;

const updatePassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { password, currentPassword, username } = req.body;
    let user = await User.findOne({ username });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        return res
            .status(401)
            .json({ errors: [{ msg: "Invalid Credentials" }] });
    } else {
        try {
            // See if user exists
            const newuser = await updateUser(user._id, password, user.role);
            //Return jsonwebtoken
            const payload = {
                user: {
                    id: newuser._id,
                },
            };

            jwt.sign(payload, jwtSecret, { expiresIn: "5 days" }, (err, token) => {
                if (err) throw err;
                res.json({ token, role: newuser.role, verified: newuser.verified });
            });

        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
};


const updateUser = async (_id, password, role) => {
    const newuser = new User({
        _id,
        password,
        role,
        verified: true
    });

    //Encrypt Password
    const salt = await bcrypt.genSalt(10);

    newuser.password = await bcrypt.hash(password, salt);
    await User.updateOne({ _id: _id }, newuser)
    
    return newuser;
};


module.exports = { updatePassword };
