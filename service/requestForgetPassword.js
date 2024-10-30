// const { validationResult } = require("express-validator");
// const User = require("../models/User");
// const randomCode = require("./randomCode");
// const ConfirmationCode = require("../models/ConfirmationCode");
// const sendEmail = require("../service/email");

// const requestForgetPassword = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
//     const { email } = req.body;
//     try {
//         // See if user exists
//         let user = await User.findOne({ email });
//         if (user) {    
//             const confirmationCode = await createConfirmationCode(user);
//             sendRegistrationEmail(email, confirmationCode.code)
              
//             //Return true
//             res.status(200).json(true);
//         } else {
//             res.status(400).json({ errors: [{ msg: "User not exist with this email" }] });
//             res.end()
//         }
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send("Server error");
//     }
// };


// const createConfirmationCode = async (user) => {
//     let confirmationCode = await ConfirmationCode.findOne({ userid: user._id });
//     const code = randomCode;
//     if(confirmationCode){
//         confirmationCode.code = code;
//         confirmationCode.date = Date.now();
//     }
//     else{
//         confirmationCode = new ConfirmationCode({
//             userid: user._id,
//             code: code,
//             date: Date.now()
//         });
//     }
//     return await confirmationCode.save();
// };

// const sendRegistrationEmail = (email, code) => {
//     const html = ` <h3>Hello, Your confirmation code is ${code}</h3>
//                 <p>The confirmation code will be valid for 60 minutes. If you did not initiate this operation, you can ignore this email.
//                 <br><br> HR Eximia <br> Automated message. Please do not reply.</p>`;
//     sendEmail(email, '[EXIMIA] Account Verification', html)
// };

// module.exports = { requestForgetPassword };
