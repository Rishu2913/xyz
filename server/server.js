require("dotenv").config();

const express = require("express");
const cors = require("cors");

const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const problemRoutes = require("./routes/problemRoutes");
const roomRoutes = require("./routes/roomRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");

const googleAuthRoutes = require("./routes/googleAuthRoutes");
const meetingRoutes = require("./routes/meetingRoutes");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

connectDB();

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

// ================================
// AUTH / USER
// ================================

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// ================================
// GOOGLE AUTH / MEETINGS
// ================================

app.use("/api/auth/google", googleAuthRoutes);
app.use("/api/meetings", meetingRoutes);

// ================================
// CODING SPACE
// ================================

app.use("/api/problems", problemRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// ================================
// ROOT
// ================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Coding Space & Leaderboard Backend is running"
    });
});

const players = new Map();

io.on("connection", (socket) => {
    console.log("Player connected:", socket.id);

    socket.on("player:join", (playerData) => {
        players.set(socket.id, {
            id: socket.id,
            username: playerData.username || "Player",
            x: playerData.x || 0,
            y: playerData.y || 0,
            direction: playerData.direction || "down"
        });

        // Send everyone currently online to the new player
        socket.emit(
            "players:current",
            Array.from(players.values())
        );

        // Tell everyone else about the new player
        socket.broadcast.emit(
            "player:joined",
            players.get(socket.id)
        );
    });

    socket.on("player:move", (data) => {
        const player = players.get(socket.id);

        if (!player) {
            return;
        }

        player.x = data.x;
        player.y = data.y;
        player.direction = data.direction;

        socket.broadcast.emit("player:moved", {
            id: socket.id,
            x: player.x,
            y: player.y,
            direction: player.direction
        });
    });

    socket.on("disconnect", () => {
        console.log("Player disconnected:", socket.id);

        players.delete(socket.id);

        socket.broadcast.emit(
            "player:left",
            socket.id
        );
    });
});
// ================================
// SERVER
// ================================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});