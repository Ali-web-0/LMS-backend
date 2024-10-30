const User = require("../models/User");

const getUsers = async (req, res) => {
    const {manager, keyword, role, page = 0, size = 10 } = req.query;
    let query = {};
    const pageNumber = Number(page) + 1;
    if (keyword && keyword.trim() !== '') {
      const regex = new RegExp(keyword, 'i');
      query = {
        $or: [
          { firstname: { $regex: regex } },
          { lastname: { $regex: regex } },
          { role: { $regex: regex } },
          // { email: { $regex: regex } },
          { username: { $regex: regex } },
          { position: { $regex: regex } },
          { address: { $regex: regex } },
        ]
      };
    }
    if (manager && manager.trim() !== '') {
      query.manager = manager;
    }
    if (role && role.trim() !== '') {
      query.role = role;
    }
    try {
      const userReq = await User.find(query)
      .limit(size * 1)
      .skip((pageNumber - 1) * size)
      .sort({ employee: 1 }).select("-password");
      const count = await User.find(query).count();
      res.json({
        totalElements: count,
        totalPages: Math.ceil(count / size),
        content: userReq,
      });
    } catch (error) {
      console.log(error.message);
      res.json({ message: error.message });
    }
}

module.exports = { getUsers };
