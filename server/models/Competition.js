const mongoose = require("mongoose");

const competitionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        startTime: {
            type: Date,
            required: true
        },

        endTime: {
            type: Date,
            required: true
        },

        duration: {
            type: Number,
            required: true
        },

        problemIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Problem"
            }
        ],

        status: {
            type: String,
            enum: ["upcoming", "active", "completed"],
            default: "upcoming"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Competition", competitionSchema);