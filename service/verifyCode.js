// const jwt = require("jsonwebtoken");
// const jwtSecret = require('../config/keys').jwtSecret;
// const { validationResult } = require("express-validator");
// const User = require("../models/User");
// const ConfirmationCode = require("../models/ConfirmationCode");
// const bcrypt = require("bcryptjs");

// const verifyCode = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
//     const { email, code, password } = req.body;
//     try {
//         // See if user exists
//         let user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400)
//             .json({ errors: [{ msg: "User not exist with this email" }] });
//         }
//         const invalidCode = await isInvalidCode(user, code);
//         if(invalidCode){
//             return res
//                 .status(400)
//                 .json({ errors: [{ msg: "Invalid Verification Code" }] });
//         }
//         //Encrypt Password
//         await updateUserPassword(user, password);
//         //Return jsonwebtoken
//         const payload = {
//             user: {
//                 id: user.id,
//             },
//         };

//         jwt.sign(payload, jwtSecret, { expiresIn: "5 days" }, (err, token) => {
//             if (err) throw err;
//             res.json({ token, role: user.role });
//         });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send("Server error");
//     }
// };


// const updateUserPassword = async (user, password) => {
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);
//     user.verified = true;
//     await User.updateOne({ _id: user._id }, user);
// };

// const isInvalidCode = async (user, code) => {
//     let confirmationCode = await ConfirmationCode.findOne({ userid: user._id });
//     if(!confirmationCode || confirmationCode.code != code){
//         return true
//     }
// };


// module.exports = { verifyCode };
