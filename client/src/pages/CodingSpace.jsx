import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CodingSpace.css";

const API_URL = "http://localhost:5000";

const PROBLEM_ID = "507f191e810c19729de860ea";

const STARTER_CODE = {
    cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your solution here

    return 0;
}`,

    python: `def solve():
    # Write your solution here
    pass


if __name__ == "__main__":
    solve()`,

    java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Write your solution here
    }
}`,
};

function CodingSpace() {
    const navigate = useNavigate();

    const [language, setLanguage] = useState("cpp");

    const [problem, setProblem] = useState(null);

    const [loadingProblem, setLoadingProblem] = useState(true);

    const [problemError, setProblemError] = useState("");

    const [code, setCode] = useState(STARTER_CODE.cpp);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [result, setResult] = useState(null);


    // ==========================================
    // FETCH PROBLEM
    // ==========================================

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                setLoadingProblem(true);
                setProblemError("");

                const response = await fetch(
                    `${API_URL}/api/problems/${PROBLEM_ID}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to load problem"
                    );
                }

                setProblem(data.problem);

            } catch (error) {
                console.error("Problem fetch error:", error);

                setProblemError(
                    error.message || "Failed to load problem"
                );
            } finally {
                setLoadingProblem(false);
            }
        };

        fetchProblem();
    }, []);


    // ==========================================
    // LANGUAGE CHANGE
    // ==========================================

    const handleLanguageChange = (event) => {
        const newLanguage = event.target.value;

        setLanguage(newLanguage);

        setCode(STARTER_CODE[newLanguage]);

        setResult(null);
    };


    // ==========================================
    // SUBMIT CODE
    // ==========================================

    const handleSubmit = async () => {

        const storedUser = JSON.parse(
            localStorage.getItem("user") || "{}"
        );
        
        const userId = storedUser._id || storedUser.id;

        if (!userId) {
            setResult({
                status: "error",
                message: "You must be logged in to submit code."
            });

            return;
        }

        if (!problem) {
            return;
        }

        setIsSubmitting(true);
        setResult(null);

        try {

            const response = await fetch(
                `${API_URL}/api/submissions`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        userId,
                        problemId: PROBLEM_ID,
                        code,
                        language
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Submission failed"
                );
            }

            setResult(data.submission);

        } catch (error) {

            console.error(
                "Submission error:",
                error
            );

            setResult({
                status: "error",
                message:
                    error.message ||
                    "Something went wrong"
            });

        } finally {

            setIsSubmitting(false);

        }
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loadingProblem) {
        return (
            <div className="coding-page">
                <div
                    style={{
                        margin: "auto",
                        fontFamily: "monospace",
                        fontSize: "18px"
                    }}
                >
                    LOADING PROBLEM...
                </div>
            </div>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (problemError) {
        return (
            <div className="coding-page">
                <div
                    style={{
                        margin: "auto",
                        textAlign: "center",
                        fontFamily: "monospace"
                    }}
                >
                    <h2>FAILED TO LOAD PROBLEM</h2>

                    <p>{problemError}</p>

                    <button
                        className="back-btn"
                        onClick={() => navigate("/campus")}
                    >
                        ← Campus
                    </button>
                </div>
            </div>
        );
    }


    // ==========================================
    // PAGE
    // ==========================================

    return (
        <div className="coding-page">

            {/* ================= HEADER ================= */}

            <header className="coding-header">

                <button
                    className="back-btn"
                    onClick={() => navigate("/campus")}
                >
                    ← Campus
                </button>

                <div className="coding-title">

                    <span className="pixel-logo">
                        EDUNA
                    </span>

                    <span className="arena-title">
                        CODING ARENA
                    </span>

                </div>

                <select
                    className="language-select"
                    value={language}
                    onChange={handleLanguageChange}
                >
                    <option value="cpp">
                        C++
                    </option>

                    <option value="python">
                        Python
                    </option>

                    <option value="java">
                        Java
                    </option>
                </select>

            </header>


            {/* ================= MAIN ================= */}

            <main className="coding-main">

                {/* ================= PROBLEM ================= */}

                <section className="problem-panel">

                    <div className="problem-heading">

                        <div>

                            <h1>
                                {problem.title}
                            </h1>

                            <span
                                className={`difficulty ${problem.difficulty.toLowerCase()}`}
                            >
                                {problem.difficulty}
                            </span>

                        </div>

                    </div>


                    {/* Description */}

                    <div className="problem-section">

                        <h2>
                            DESCRIPTION
                        </h2>

                        <p>
                            {problem.description}
                        </p>

                    </div>


                    {/* Input */}

                    <div className="problem-section">

                        <h2>
                            INPUT
                        </h2>

                        <p>
                            {problem.inputFormat}
                        </p>

                    </div>


                    {/* Output */}

                    <div className="problem-section">

                        <h2>
                            OUTPUT
                        </h2>

                        <p>
                            {problem.outputFormat}
                        </p>

                    </div>


                    {/* Constraints */}

                    <div className="problem-section">

                        <h2>
                            CONSTRAINTS
                        </h2>

                        <code className="constraint-code">
                            {problem.constraints}
                        </code>

                    </div>


                    {/* Example */}

                    <div className="problem-section">

                        <h2>
                            EXAMPLE
                        </h2>

                        <div className="example-grid">

                            <div>

                                <span>
                                    INPUT
                                </span>

                                <pre>
                                    {problem.sampleInput}
                                </pre>

                            </div>

                            <div>

                                <span>
                                    OUTPUT
                                </span>

                                <pre>
                                    {problem.sampleOutput}
                                </pre>

                            </div>

                        </div>

                    </div>

                </section>


                {/* ================= EDITOR ================= */}

                <section className="editor-panel">

                    <div className="editor-header">

                        <span>
                            {language === "cpp"
                                ? "solution.cpp"
                                : language === "python"
                                    ? "solution.py"
                                    : "Main.java"}
                        </span>

                        <span className="editor-status">
                            {language.toUpperCase()}
                        </span>

                    </div>


                    <textarea
                        className="code-editor"
                        value={code}
                        onChange={(event) =>
                            setCode(event.target.value)
                        }
                        spellCheck="false"
                    />


                    {/* Editor footer */}

                    <div className="editor-footer">

                        <span className="editor-info">
                            Write your solution
                        </span>

                        <button
                            className="submit-btn"
                            onClick={handleSubmit}
                            disabled={
                                isSubmitting ||
                                !code.trim()
                            }
                        >
                            {isSubmitting
                                ? "JUDGING..."
                                : "SUBMIT →"}
                        </button>

                    </div>

                </section>

            </main>


            {/* ================= RESULT ================= */}

            {result && (

                <div className="result-panel">

                    {result.status === "error" ? (

                        <div className="result-status">
                            ✕ {result.message}
                        </div>

                    ) : (

                        <>

                            <div
                                className={
                                    result.status ===
                                    "accepted"
                                        ? "result-status accepted"
                                        : "result-status"
                                }
                            >
                                {result.status ===
                                "accepted"
                                    ? "✓ ACCEPTED"
                                    : result.status ===
                                      "wrong_answer"
                                        ? "✕ WRONG ANSWER"
                                        : result.status ===
                                          "compilation_error"
                                            ? "✕ COMPILATION ERROR"
                                            : result.status ===
                                              "runtime_error"
                                                ? "✕ RUNTIME ERROR"
                                                : result.status ===
                                                  "time_limit"
                                                    ? "✕ TIME LIMIT"
                                                    : result.status.toUpperCase()}
                            </div>

                            <div className="result-stat">

                                <span>
                                    SCORE
                                </span>

                                <strong>
                                    {result.score}
                                </strong>

                            </div>

                            <div className="result-stat">

                                <span>
                                    TIME
                                </span>

                                <strong>
                                    {result.executionTime} ms
                                </strong>

                            </div>

                        </>

                    )}

                </div>

            )}

        </div>
    );
}

export default CodingSpace;