const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const problemRoutes = require("./routes/problemRoutes");

dotenv.config();

const connectDB = require("./config/db");
connectDB();

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());
app.use("/api/problems", problemRoutes);

const roomRoutes = require("./routes/roomRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");


app.use("/api/rooms", roomRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Coding Space & Leaderboard Backend is running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});