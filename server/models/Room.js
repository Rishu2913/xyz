const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            required: true,
            enum: ["lobby", "meeting", "library", "coding"]
        },

        description: {
            type: String,
            default: ""
        },

        capacity: {
            type: Number,
            default: 50
        },

        isActive: {
            type: Boolean,
            default: true
        },

        participants: [
            {
                type: String
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Room", roomSchema);