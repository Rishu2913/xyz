const Resource = require("../models/Resource");

// GET /api/resources
const getResources = async (req, res) => {
    try {
        const { category } = req.query;

        const filter = {};

        if (category) {
            filter.category = category;
        }

        const resources = await Resource.find(filter).sort({
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            message: "Resources fetched successfully",
            data: resources
        });

    } catch (error) {
        console.error("Get resources error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch resources",
            data: null
        });
    }
};

module.exports = {
    getResources
};