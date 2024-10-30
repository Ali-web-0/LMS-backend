const leavetype = require("../models/LeaveTypes");

const getLeaveTypeById = async (req, res) => {
    try {
        const leave = await leavetype.findById({ _id: req.params.id });
        res.json(leave);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

module.exports = { getLeaveTypeById };

