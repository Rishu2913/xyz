const Meeting = require("../models/Meeting");
const { createGoogleMeet } = require("../services/googleMeetService");

const createMeeting = async (req, res) => {
    try {
        const {
            title,
            description,
            startTime,
            endTime
        } = req.body;

        // Validate required fields
        if (!title || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: "Title, startTime and endTime are required",
                data: null
            });
        }

        // Validate dates
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime())
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid startTime or endTime",
                data: null
            });
        }

        if (end <= start) {
            return res.status(400).json({
                success: false,
                message: "endTime must be after startTime",
                data: null
            });
        }

        // Create Google Meet
        const googleMeeting = await createGoogleMeet({
            title,
            description,
            startTime: start,
            endTime: end
        });

        // Save meeting in MongoDB
        const meeting = await Meeting.create({
            title,
            description: description || "",
            meetingUrl: googleMeeting.meetingUrl,
            startTime: start,
            endTime: end,
            createdBy: req.user.id
        });

        return res.status(201).json({
            success: true,
            message: "Meeting created successfully",
            data: {
                id: meeting._id,
                title: meeting.title,
                description: meeting.description,
                meetingUrl: meeting.meetingUrl,
                startTime: meeting.startTime,
                endTime: meeting.endTime,
                createdBy: meeting.createdBy
            }
        });

    } catch (error) {
        console.error("Create meeting error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create meeting",
            data: null
        });
    }
};

module.exports = {
    createMeeting
};