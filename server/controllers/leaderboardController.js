const mongoose = require("mongoose");
const Submission = require("../models/Submission");

const getLeaderboard = async (req, res) => {
    try {
        const { competitionId } = req.query;

        const matchStage = {};

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
            {
                $group: {
                    _id: "$userId",
                    totalScore: {
                        $sum: "$score"
                    },
                    submissions: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    totalScore: -1
                }
            },
            {
                $setWindowFields: {
                    sortBy: {
                        totalScore: -1
                    },
                    output: {
                        rank: {
                            $rank: {}
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    userId: "$_id",
                    rank: 1,
                    totalScore: 1,
                    submissions: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            leaderboard
        });

    } catch (error) {
        console.error("Leaderboard error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getLeaderboard
};