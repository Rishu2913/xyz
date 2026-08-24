require("dotenv").config();

const mongoose = require("mongoose");

const userId = new mongoose.Types.ObjectId("507f1f77bcf86cd799439011");
const problemId = new mongoose.Types.ObjectId("507f191e810c19729de860ea");

async function seedTestData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const db = mongoose.connection.db;

        const users = db.collection("users");
        const problems = db.collection("problems");

        await users.updateOne(
            { _id: userId },
            {
                $set: {
                    name: "Test User",
                    email: "test@example.com"
                }
            },
            { upsert: true }
        );

        await problems.updateOne(
            { _id: problemId },
            {
                $set: {
                    title: "Two Sum",
                    description:
                        "Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target.",
                    difficulty: "Easy",
                    inputFormat: "nums array and target integer",
                    outputFormat:
                        "Two indices whose values add up to target",
                    constraints: "2 <= nums.length <= 10^4",
                    sampleInput:
                        "nums = [2,7,11,15], target = 9",
                    sampleOutput: "[0,1]"
                }
            },
            { upsert: true }
        );

        console.log("Test user:", userId.toString());
        console.log("Test problem:", problemId.toString());
        console.log("Test data created successfully.");

    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

seedTestData();
