require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const problemRoutes = require("./routes/problemRoutes");
const roomRoutes = require("./routes/roomRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");

const app = express();

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

// ================================
// SERVER
// ================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});