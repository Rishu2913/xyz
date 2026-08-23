const mongoose = require("mongoose");
const Submission = require("../models/Submission");

const createSubmission = async (req, res) => {
    try {
        const {
            userId,
            problemId,
            competitionId,
            code,
            language
        } = req.body;

        // Validate required fields
        if (!userId || !problemId || !code || !language) {
            return res.status(400).json({
                success: false,
                message: "userId, problemId, code and language are required"
            });
        }

        // Validate MongoDB ObjectIds
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid userId"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(problemId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid problemId"
            });
        }

        // Validate competitionId if provided
        if (
            competitionId &&
            !mongoose.Types.ObjectId.isValid(competitionId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid competitionId"
            });
        }

        // Validate language
        if (!["cpp", "python", "java"].includes(language)) {
            return res.status(400).json({
                success: false,
                message: "Language must be cpp, python or java"
            });
        }

        const submission = await Submission.create({
            userId,
            problemId,
            competitionId: competitionId || null,
            code,
            language,
            status: "pending"
        });

        return res.status(201).json({
            success: true,
            message: "Code submitted successfully",
            submission
        });

    } catch (error) {
        console.error("Submission error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createSubmission
};