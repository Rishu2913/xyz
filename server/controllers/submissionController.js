const mongoose = require("mongoose");

const Submission = require("../models/Submission");
const Problem = require("../models/Problem");

const { judgeSubmission } = require("../services/judgeService");

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

        // Check that the problem exists
        const problem = await Problem.findById(problemId);

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found"
            });
        }

        // Create submission as pending first
        const submission = await Submission.create({
            userId,
            problemId,
            competitionId: competitionId || null,
            code,
            language,
            status: "pending"
        });

        // Run the submitted code against hidden test cases
        const result = await judgeSubmission(submission, problem);

        // Update submission with judge result
        submission.status = result.status;
        submission.score = result.score;
        submission.executionTime = result.executionTime;
        submission.memoryUsed = result.memoryUsed;

        await submission.save();

        return res.status(201).json({
            success: true,
            message: "Code judged successfully",
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