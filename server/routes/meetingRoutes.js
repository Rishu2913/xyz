const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const teacherMiddleware = require("../middleware/teacherMiddleware");

const {
    createMeeting,
    getLatestMeeting
} = require("../controllers/meetingController");

const router = express.Router();

// Teacher creates meeting
router.post(
    "/",
    authMiddleware,
    teacherMiddleware,
    createMeeting
);

// Students/teachers get latest upcoming meeting
router.get(
    "/latest",
    authMiddleware,
    getLatestMeeting
);

module.exports = router;