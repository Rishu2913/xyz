import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const API_URL = "http://localhost:5000";

function Auth() {
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        role: "student"
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const endpoint = isLogin
                ? "/api/auth/login"
                : "/api/auth/register";

            const body = isLogin
                ? {
                    email: form.email,
                    password: form.password
                }
                : {
                    username: form.username,
                    email: form.email,
                    password: form.password,
                    role: form.role
                };

            const response = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Something went wrong"
                );
            }

            // Save authentication information
            localStorage.setItem("token", data.data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(data.data.user)
            );

            setSuccess(
                isLogin
                    ? "Welcome back!"
                    : "Account created successfully!"
            );

            // Small delay so success message is visible
            setTimeout(() => {
                navigate("/");
            }, 700);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const switchMode = () => {
        setIsLogin(!isLogin);

        setForm({
            username: "",
            email: "",
            password: "",
            role: "student"
        });

        setError("");
        setSuccess("");
    };

    return (
        <div className="auth-page">

            {/* Pixel background decorations */}
            <div className="pixel-star star-1">✦</div>
            <div className="pixel-star star-2">✦</div>
            <div className="pixel-star star-3">✦</div>

            <div className="auth-container">

                {/* LEFT SIDE */}
                <div className="auth-visual">

                    <div className="pixel-sun">
                        ☀
                    </div>

                    <div className="campus-building">
                        <div className="building-roof"></div>

                        <div className="building-body">

                            <div className="building-window">
                                ▦
                            </div>

                            <div className="building-sign">
                                CAMPUS
                            </div>

                            <div className="building-door">
                                <div className="door-knob"></div>
                            </div>

                        </div>
                    </div>

                    <div className="grass">

                        <span>🌱</span>
                        <span>🌿</span>
                        <span>🌱</span>
                        <span>🌿</span>
                        <span>🌱</span>

                    </div>

                    <div className="visual-text">
                        <h2>VIRTUAL CAMPUS</h2>

                        <p>
                            Learn. Compete. Connect.
                        </p>
                    </div>

                </div>


                {/* RIGHT SIDE */}
                <div className="auth-card">

                    <div className="auth-header">

                        <div className="pixel-logo">
                            VX
                        </div>

                        <div>
                            <h1>
                                {isLogin
                                    ? "WELCOME BACK!"
                                    : "JOIN CAMPUS"}
                            </h1>

                            <p>
                                {isLogin
                                    ? "Enter the campus again."
                                    : "Create your student account."}
                            </p>
                        </div>

                    </div>


                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        {!isLogin && (
                            <div className="field">

                                <label>
                                    USERNAME
                                </label>

                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Enter username"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                />

                            </div>
                        )}


                        <div className="field">

                            <label>
                                EMAIL
                            </label>

                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="field">

                            <label>
                                PASSWORD
                            </label>

                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {!isLogin && (
                            <div className="field">

                                <label>
                                    CHOOSE ROLE
                                </label>

                                <div className="role-selector">

                                    <button
                                        type="button"
                                        className={
                                            form.role === "student"
                                                ? "role active"
                                                : "role"
                                        }
                                        onClick={() =>
                                            setForm({
                                                ...form,
                                                role: "student"
                                            })
                                        }
                                    >
                                        <span>🎒</span>
                                        STUDENT
                                    </button>

                                    <button
                                        type="button"
                                        className={
                                            form.role === "teacher"
                                                ? "role active"
                                                : "role"
                                        }
                                        onClick={() =>
                                            setForm({
                                                ...form,
                                                role: "teacher"
                                            })
                                        }
                                    >
                                        <span>📚</span>
                                        TEACHER
                                    </button>

                                </div>

                            </div>
                        )}


                        {error && (
                            <div className="message error">
                                ⚠ {error}
                            </div>
                        )}

                        {success && (
                            <div className="message success">
                                ★ {success}
                            </div>
                        )}


                        <button
                            className="submit-btn"
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "LOADING..."
                                : isLogin
                                    ? "ENTER CAMPUS →"
                                    : "CREATE ACCOUNT →"}
                        </button>

                    </form>


                    <div className="switch-auth">

                        <span>
                            {isLogin
                                ? "NEW TO CAMPUS?"
                                : "ALREADY A MEMBER?"}
                        </span>

                        <button
                            type="button"
                            onClick={switchMode}
                        >
                            {isLogin
                                ? "CREATE ACCOUNT"
                                : "LOGIN"}
                        </button>

                    </div>

                </div>

            </div>

            <div className="auth-footer">
                VIRTUAL CAMPUS • EST. 2026
            </div>

        </div>
    );
}

export default Auth;