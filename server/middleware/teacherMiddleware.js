const User = require("../models/User");

const teacherMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null
            });
        }

        if (user.role !== "teacher") {
            return res.status(403).json({
                success: false,
                message: "Teacher access required",
                data: null
            });
        }

        req.user.role = user.role;

        next();

    } catch (error) {
        console.error("Teacher middleware error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            data: null
        });
    }
};

module.exports = teacherMiddleware;