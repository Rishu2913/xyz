const Room = require("../models/Room");

const createRoom = async (req, res) => {
    try {
        const { name, description, capacity } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Room name is required"
            });
        }

        const room = await Room.create({
            name,
            type: "coding",
            description: description || "",
            capacity: capacity || 50,
            isActive: true
        });

        res.status(201).json({
            success: true,
            message: "Coding room created successfully",
            room
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        res.status(200).json({
            success: true,
            room
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const joinRoom = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required"
            });
        }

        const room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        if (!room.isActive) {
            return res.status(400).json({
                success: false,
                message: "Room is not active"
            });
        }

        if (room.participants.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: "User already joined the room"
            });
        }

        if (room.participants.length >= room.capacity) {
            return res.status(400).json({
                success: false,
                message: "Room is full"
            });
        }

        room.participants.push(userId);
        await room.save();

        res.status(200).json({
            success: true,
            message: "Joined room successfully",
            room
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createRoom,
    getRoom,
    joinRoom
};