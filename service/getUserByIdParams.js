const User = require("../models/User");
const mongoose = require('mongoose');

const getUserByIdParams = async (req, res) => {
    try {
        const user = await User.findOne({ '_id': mongoose.Types.ObjectId(req.params.id) });
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

module.exports = { getUserByIdParams };
