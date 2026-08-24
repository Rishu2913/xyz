// controllers/problemController.js

const Problem = require("../models/Problem");

const getProblem = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found"
            });
        }

        // Don't send hidden test cases to frontend
        const safeProblem = {
            _id: problem._id,
            title: problem.title,
            description: problem.description,
            difficulty: problem.difficulty,
            inputFormat: problem.inputFormat,
            outputFormat: problem.outputFormat,
            constraints: problem.constraints,
            sampleInput: problem.sampleInput,
            sampleOutput: problem.sampleOutput,
            tags: problem.tags,
            points: problem.points,
            timeLimit: problem.timeLimit,
            memoryLimit: problem.memoryLimit
        };

        res.status(200).json({
            success: true,
            problem: safeProblem
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getProblem
};