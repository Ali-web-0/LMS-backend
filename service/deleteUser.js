const User = require("../models/User");

const deleteUser = async (req, res) => {
    try {
        await User.deleteOne({ _id: req.params.id })
        res.json("User Deleted Successfully")
    } catch (error) {
        res.json({ message: error.message })
    }
}


module.exports = { deleteUser };
