const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const roomRoutes = require("./routes/roomRoutes");
const submissionRoutes = require("./routes/submissionRoutes");

app.use("/api/rooms", roomRoutes);
app.use("/api/submissions", submissionRoutes);

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