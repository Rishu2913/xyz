const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        problemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Problem",
            required: true
        },

        competitionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Competition",
            default: null
        },

        code: {
            type: String,
            required: true
        },

        language: {
            type: String,
            required: true,
            enum: ["cpp", "python", "java"]
        },

        status: {
            type: String,
            enum: [
                "pending",
                "accepted",
                "wrong_answer",
                "runtime_error",
                "compilation_error",
                "time_limit"
            ],
            default: "pending"
        },

        score: {
            type: Number,
            default: 0
        },

        executionTime: {
            type: Number,
            default: 0
        },

        memoryUsed: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Submission", submissionSchema);