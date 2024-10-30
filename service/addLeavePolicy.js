const LeavePolicy = require("../models/LeavePolicy");
const { validationResult } = require("express-validator");

const addLeavePolicy = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }
  const leave = req.body;
  try {
      let foundPolicy = await LeavePolicy.findOne({ title: leave.title });
      if (foundPolicy) {
          res.status(400).json({ errors: [{ msg: "This title already exist" }] });
      } else {
        const newLeavePolicy = new LeavePolicy(leave);
        await newLeavePolicy.save()
        res.status(201).json(newLeavePolicy);
      }
  } catch (error) {
      res.json({ message: error.message })
  }
}

module.exports = { addLeavePolicy };

