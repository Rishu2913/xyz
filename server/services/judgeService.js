const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const { spawn, execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);

const normalizeOutput = (output) => {
    return output
        .trim()
        .split(/\s+/)
        .join(" ");
};

const runProgram = (command, args, input, timeout) => {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args);

        let stdout = "";
        let stderr = "";
        let timedOut = false;

        const timer = setTimeout(() => {
            timedOut = true;
            child.kill();
        }, timeout);

        child.stdout.on("data", (data) => {
            stdout += data.toString();
        });

        child.stderr.on("data", (data) => {
            stderr += data.toString();
        });

        child.on("error", (error) => {
            clearTimeout(timer);
            reject(error);
        });

        child.on("close", (code) => {
            clearTimeout(timer);

            if (timedOut) {
                const error = new Error("Time limit exceeded");
                error.code = "ETIMEDOUT";
                reject(error);
                return;
            }

            resolve({
                code,
                stdout,
                stderr
            });
        });

        // Send hidden test input to the program
        child.stdin.write(input);
        child.stdin.end();
    });
};

const judgeSubmission = async (submission, problem) => {
    const tempDir = fs.mkdtempSync(
        path.join(os.tmpdir(), `coding-${crypto.randomUUID()}-`)
    );

    try {
        let runCommandName;
        let runArgs;

        // =========================
        // C++
        // =========================
        if (submission.language === "cpp") {
            const sourceFile = path.join(tempDir, "main.cpp");

            fs.writeFileSync(sourceFile, submission.code);

            const executable = path.join(
                tempDir,
                process.platform === "win32"
                    ? "main.exe"
                    : "main"
            );

            try {
                await execFileAsync("g++", [
                    sourceFile,
                    "-O2",
                    "-std=c++17",
                    "-o",
                    executable
                ]);
            } catch (error) {
                return {
                    status: "compilation_error",
                    score: 0,
                    executionTime: 0,
                    memoryUsed: 0
                };
            }

            runCommandName = executable;
            runArgs = [];
        }

        // =========================
        // Python
        // =========================
        else if (submission.language === "python") {
            const sourceFile = path.join(tempDir, "main.py");

            fs.writeFileSync(sourceFile, submission.code);

            runCommandName = "python";
            runArgs = [sourceFile];
        }

        // =========================
        // Java
        // =========================
        else if (submission.language === "java") {
            const sourceFile = path.join(tempDir, "Main.java");

            fs.writeFileSync(sourceFile, submission.code);

            try {
                await execFileAsync("javac", [sourceFile]);
            } catch (error) {
                return {
                    status: "compilation_error",
                    score: 0,
                    executionTime: 0,
                    memoryUsed: 0
                };
            }

            runCommandName = "java";
            runArgs = [
                "-cp",
                tempDir,
                "Main"
            ];
        }

        let totalScore = 0;
        let totalExecutionTime = 0;

        // =========================
        // Run hidden test cases
        // =========================
        for (const testCase of problem.testCases) {
            const startTime = process.hrtime.bigint();

            try {
                const result = await runProgram(
                    runCommandName,
                    runArgs,
                    testCase.input,
                    problem.timeLimit
                );

                const endTime = process.hrtime.bigint();

                const executionTime =
                    Number(endTime - startTime) / 1_000_000;

                totalExecutionTime += executionTime;

                // Runtime error
                if (result.code !== 0) {
                    return {
                        status: "runtime_error",
                        score: totalScore,
                        executionTime: Math.round(
                            totalExecutionTime
                        ),
                        memoryUsed: 0
                    };
                }

                const actualOutput =
                    normalizeOutput(result.stdout);

                const expectedOutput =
                    normalizeOutput(
                        testCase.expectedOutput
                    );

                // Wrong answer
                if (actualOutput !== expectedOutput) {
                return {
                    status: "wrong_answer",
                    score: totalScore,
                    executionTime: Math.round(totalExecutionTime),
                    memoryUsed: 0
                };
            }

                // Test passed
                totalScore += testCase.points;

            } catch (error) {

                // Time limit
                if (error.code === "ETIMEDOUT") {
                    return {
                        status: "time_limit",
                        score: totalScore,
                        executionTime: problem.timeLimit,
                        memoryUsed: 0
                    };
                }

                // Other runtime error
                return {
                    status: "runtime_error",
                    score: totalScore,
                    executionTime: Math.round(
                        totalExecutionTime
                    ),
                    memoryUsed: 0
                };
            }
        }

        // All tests passed
        return {
            status: "accepted",
            score: totalScore,
            executionTime: Math.round(
                totalExecutionTime
            ),
            memoryUsed: 0
        };

    } finally {

        // Remove temporary files
        try {
            fs.rmSync(tempDir, {
                recursive: true,
                force: true
            });
        } catch (error) {
            console.error(
                "Temporary cleanup error:",
                error.message
            );
        }
    }
};

module.exports = {
    judgeSubmission
};