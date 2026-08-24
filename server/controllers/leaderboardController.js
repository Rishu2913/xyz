const mongoose = require("mongoose");
const Submission = require("../models/Submission");
const User = require("../models/User");

const getLeaderboard = async (req, res) => {
    try {
        const { competitionId } = req.query;

        const matchStage = {
            status: "accepted"
        };

        // Filter by competition if provided
        if (competitionId) {
            if (!mongoose.Types.ObjectId.isValid(competitionId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid competitionId"
                });
            }

            matchStage.competitionId =
                new mongoose.Types.ObjectId(competitionId);
        }

        const leaderboard = await Submission.aggregate([
            {
                $match: matchStage
            },

            // Best accepted submission for each user + problem
            {
                $sort: {
                    userId: 1,
                    problemId: 1,
                    score: -1,
                    executionTime: 1,
                    createdAt: 1
                }
            },

            {
                $group: {
                    _id: {
                        userId: "$userId",
                        problemId: "$problemId"
                    },
                    score: {
                        $first: "$score"
                    },
                    executionTime: {
                        $first: "$executionTime"
                    },
                    submittedAt: {
                        $first: "$createdAt"
                    }
                }
            },

            // Calculate total score and execution time for each user
            {
                $group: {
                    _id: "$_id.userId",
                    totalScore: {
                        $sum: "$score"
                    },
                    totalExecutionTime: {
                        $sum: "$executionTime"
                    },
                    problemsSolved: {
                        $sum: 1
                    },
                    lastSubmissionAt: {
                        $max: "$submittedAt"
                    }
                }
            },

            // Higher score first.
            // If score is equal, lower execution time first.
            // If both are equal, earlier submission first.
            {
                $sort: {
                    totalScore: -1,
                    totalExecutionTime: 1,
                    lastSubmissionAt: 1
                }
            }
        ]);

        // Add rank manually because MongoDB $rank
        // cannot use multiple sort fields.
        let currentRank = 0;

        leaderboard.forEach((student, index) => {
            currentRank = index + 1;
            student.rank = currentRank;
        });

        const userIds = leaderboard.map(
            student => student._id
        );

        const users = await User.find({
            _id: { $in: userIds }
        }).select("_id username name");

        const userMap = new Map(
            users.map(user => [
                user._id.toString(),
                user.username
            ])
        );

        leaderboard.forEach(student => {
            student.username =
                userMap.get(student._id.toString()) || "Unknown";
        });

        return res.status(200).json({
            success: true,
            leaderboard
        });

    } catch (error) {
        console.error("Leaderboard error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getLeaderboard
};