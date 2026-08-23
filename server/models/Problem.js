const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        difficulty: {
            type: String,
            required: true,
            enum: ["Easy", "Medium", "Hard"]
        },

        inputFormat: {
            type: String,
            default: ""
        },

        outputFormat: {
            type: String,
            default: ""
        },

        constraints: {
            type: String,
            default: ""
        },

        sampleInput: {
            type: String,
            default: ""
        },

        sampleOutput: {
            type: String,
            default: ""
        },

        tags: {
            type: [String],
            default: []
        },

        points: {
            type: Number,
            default: 100
        },

        // Maximum allowed execution time in milliseconds
        timeLimit: {
            type: Number,
            default: 2000
        },

        // Maximum allowed memory in MB
        memoryLimit: {
            type: Number,
            default: 256
        },

        // Hidden test cases used by the judge
        testCases: [
            {
                input: {
                    type: String,
                    required: true
                },

                expectedOutput: {
                    type: String,
                    required: true
                },

                points: {
                    type: Number,
                    default: 0
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Problem", problemSchema);