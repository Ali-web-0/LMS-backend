const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const getNextSequenceId = require("./getNextSequenceId");
const { empCodeSequence } = require("../config/keys");
// const sendEmail = require("../service/email");
const jwtSecret = require('../config/keys').jwtSecret;
const LeaveTypes = require("../models/LeaveTypes");
const UserLeaveBalance = require("../models/UserLeaveBalance");

const registerUser = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }

    const userData = req.body;

    try {
        // See if user exists
        // const existingUser = await User.findOne({ email: userData.email });

        // if (existingUser) {
        //     return res.status(400).json({ errors: [{ msg: "Email already exists" }] });
        // }
        const foundUsername = await User.findOne({ username: userData.username });

        if (foundUsername) {
            return res.status(400).json({ errors: [{ msg: "username already exists" }] });
        }
        
        const code = await getNextSequenceId(empCodeSequence);
        userData.employee = code;
        
        const user = await createUser(userData);

        // sendRegistrationEmail(user.email, userData.password);

        // Return jsonwebtoken
        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(payload, jwtSecret, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};


const createUser = async (userData) => {
    const user = new User(userData);
    // Encrypt Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    
    const newUser = await user.save();
    createBalance(newUser);
    return newUser;
};

// const sendRegistrationEmail = (email, password) => {
//     const html = `<h3>Welcome to Eximia LMS Portal</h3>
//     <p>Your account is created on <a href="http://3.95.218.249/">Eximia Employee Management System</a>
//     <br><br>Your login password is ${password} 
//     <br><br>If you did not initiate this operation, you can ignore this email.<br><br>HR Eximia<br> Automated message. Please do not reply.</p>`;
//     sendEmail(email, '[EXIMIA] Employee Account Created', html)
// };

const createBalance = async (user) => {
    const adminleave = await LeaveTypes.find();
    const year = new Date().getFullYear();
    adminleave.map( async(leaveType) => {
        const joinedYear = new Date(user.joinDate).getFullYear();
        let totalLeave = leaveType?.numberLeave
        if(year === joinedYear){
            const month = new Date(user.joinDate).getMonth();
            const noOfLeave = ((leaveType?.numberLeave / 12) * (12 - month)).toFixed(1);
            totalLeave = Math.round(noOfLeave * 2) / 2;
        }
        const balance = new UserLeaveBalance({
            totalLeave: totalLeave,
            usedLeave: 0,
            carryOverLeave: 0,
            leaveCategory: leaveType.leaveType,
            userId: user._id,
            year: year,
            leaveTypeId: leaveType._id,
            createdAt: Date.now(),
            modifiedAt: Date.now()
        });
        await balance.save();
    });
}

module.exports = { registerUser };
