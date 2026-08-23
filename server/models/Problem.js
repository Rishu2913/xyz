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
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Problem", problemSchema);