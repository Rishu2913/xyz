const express = require("express");

const {
    createRoom,
    getRoom,
    joinRoom
} = require("../controllers/roomController");
const router = express.Router();

router.post("/", createRoom);
router.get("/:id", getRoom);
router.post("/:id/join", joinRoom);


module.exports = router;