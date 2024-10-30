const express = require("express");
const router = express.Router();
const department = require("../models/Department");
const { check, validationResult } = require("express-validator");
const auth = require("../middlewares/auth");
const { checkRole } = require("../middlewares/checkRole");


// @route   POST /department
// @desc    department
// @access  Private
router.post('/department', auth, checkRole(["admin"]), [
    check("name", "Name is required").not().isEmpty(),
    check("shortName", "shortName is required").not().isEmpty(),
    check("code", "Code is required").not().isEmpty(),

], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, shortName, code } = req.body;
    const newDepartment = new department({ name, shortName, code });
    try {
        let departmentCheck = await department.findOne({ name });
        if (departmentCheck) {
            res.status(400).json({ errors: [{ msg: "Department name is already exist in the system" }] });
        } else {
            await newDepartment.save()
            res.status(201).json(newDepartment);
        }

    } catch (error) {
        res.json({ message: error.message })
    }
})
// @route   get /department
// @desc    Get all
// @access  Public
router.get('/department', auth, checkRole(["admin","manager","user"]), async (req, res) => {

    try {
        let departmentAll = await department.find()
        res.json(departmentAll);
    } catch (error) {
        res.json({ message: error.message })
    }
})
// @route   GET /department
// @desc    Get department by id
// @access  Private
router.get("/department/:id", auth, checkRole(["admin","manager","user"]), async (req, res) => {
    try {
        const newDepartment = await department.findById({ _id: req.params.id });
        res.json(newDepartment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


// @route   Update /department
// @desc    Get department by id
// @access  Private
router.patch('/department/:id', auth, checkRole(["admin"]), async (req, res) => {

    const departmentData = req.body;
    const editdepartment = new department(departmentData);
    const id = req.params.id;
    try {
        await department.updateOne({ _id: id }, editdepartment)
        res.json(editdepartment)

    } catch (error) {
        res.json({ message: error.message })
    }
})
// @route   Delete /department
// @desc    Get user by id
// @access  Private
router.delete('/department/:id', auth, checkRole(["admin"]), async (req, res) => {

    try {
        await department.deleteOne({ _id: req.params.id })
        res.json("User Deleted Successfully")

    } catch (error) {
        res.json({ message: error.message })
    }
})


module.exports = router;
