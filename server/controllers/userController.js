const User = require("../models/User");

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                totalPoints: user.totalPoints,
                problemsSolved: user.problemsSolved,
                competitionsJoined: user.competitionsJoined
            }
        });

    } catch (error) {
        console.error("Get current user error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            data: null
        });
    }
};

module.exports = {
    getCurrentUser
};