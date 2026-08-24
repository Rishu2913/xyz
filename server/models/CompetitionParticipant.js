const mongoose = require("mongoose");

const competitionParticipantSchema = new mongoose.Schema(
    {
        competitionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Competition",
            required: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        score: {
            type: Number,
            default: 0
        },

        problemsSolved: {
            type: Number,
            default: 0
        },

        rank: {
            type: Number,
            default: 0
        },

        joinedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

competitionParticipantSchema.index(
    { competitionId: 1, userId: 1 },
    { unique: true }
);

module.exports = mongoose.model(
    "CompetitionParticipant",
    competitionParticipantSchema
);