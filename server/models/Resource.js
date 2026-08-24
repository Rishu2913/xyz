const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
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

        category: {
            type: String,
            required: true,
            enum: [
                "DSA",
                "Web Development",
                "AI/ML",
                "DBMS",
                "Computer Networks",
                "Other"
            ]
        },

        resourceType: {
            type: String,
            required: true,
            enum: ["pdf", "video", "website", "article"]
        },

        url: {
            type: String,
            required: true
        },

        thumbnail: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Resource", resourceSchema);