require("dotenv").config();

const mongoose = require("mongoose");
const Problem = require("./models/Problem");

const problemId = new mongoose.Types.ObjectId("507f191e810c19729de860ea");

const problem = {
    _id: problemId,

    title: "Two Sum",

    description:
        "Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target.",

    difficulty: "Easy",

    inputFormat:
        "The first line contains the array of integers. The second line contains the target integer.",

    outputFormat:
        "Return the indices of the two numbers whose values add up to the target.",

    constraints:
        "2 <= nums.length <= 10000",

    sampleInput:
        "nums = [2,7,11,15], target = 9",

    sampleOutput:
        "[0,1]",

    tags: ["array", "hash-map"],

    points: 100,

    timeLimit: 2000,

    memoryLimit: 256,

    testCases: [
        {
            input: "2 7 11 15\n9",
            expectedOutput: "0 1",
            points: 20
        },
        {
            input: "3 2 4\n6",
            expectedOutput: "1 2",
            points: 20
        },
        {
            input: "3 3\n6",
            expectedOutput: "0 1",
            points: 20
        },
        {
            input: "1 5 8 12\n13",
            expectedOutput: "1 2",
            points: 20
        },
        {
             input: "10 20 35 40\n55",
                expectedOutput: "1 2",
                points: 20
        }
    ]
};

async function seedProblem() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await Problem.findByIdAndUpdate(
            problemId,
            problem,
            {
                upsert: true,
                new: true
            }
        );

        const savedProblem = await Problem.findById(problemId);

        // console.log(
        //     "TEST CASES IN DATABASE:",
        //     savedProblem.testCases
        // );

        console.log("Test problem created successfully.");
        console.log("Problem ID:", problemId.toString());

        await mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
}

seedProblem();