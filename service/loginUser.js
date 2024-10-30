const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const jwtSecret = require('../config/keys').jwtSecret;

const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        // See if user exists
        let user = await User.findOne({ username });
        if (!user) {
            return res
                .status(400)
                .json({ errors: [{ msg: "Invalid Credentials" }] });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res
                .status(400)
                .json({ errors: [{ msg: "Invalid Credentials" }] });
        }

        //Return jsonwebtoken
        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(payload, jwtSecret, { expiresIn: "5 days" }, (err, token) => {
            if (err) throw err;
            res.json({ token, role: user.role, verified: user.verified });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};


module.exports = { loginUser };
