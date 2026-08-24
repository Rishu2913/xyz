const express = require("express");

const {
    googleAuth,
    googleCallback
} = require("../controllers/googleAuthController");

// const { createGoogleMeet } = require("../services/googleMeetService");

const router = express.Router();

router.get("/", googleAuth);
router.get("/callback", googleCallback);

// router.get("/test-meet", async (req, res) => {
//     try {
//         const meeting = await createGoogleMeet({
//             title: "Virtual Campus Test Meeting",
//             description: "Test meeting created by Virtual Campus backend",
//             startTime: new Date(Date.now() + 10 * 60 * 1000),
//             endTime: new Date(Date.now() + 70 * 60 * 1000)
//         });

//         return res.status(201).json({
//             success: true,
//             message: "Google Meet created successfully",
//             data: meeting
//         });

//     } catch (error) {
//         console.error("Google Meet creation error:", error);

//         return res.status(500).json({
//             success: false,
//             message: "Failed to create Google Meet",
//             data: null
//         });
//     }
// });

module.exports = router;

