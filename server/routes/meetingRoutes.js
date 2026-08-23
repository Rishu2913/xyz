const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const teacherMiddleware = require("../middleware/teacherMiddleware");

const {
    createMeeting
} = require("../controllers/meetingController");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    teacherMiddleware,
    createMeeting
);

module.exports = router;