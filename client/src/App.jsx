import { BrowserRouter, Routes, Route } from "react-router-dom";
import Campus from "./pages/Campus";

function Placeholder({ name }) {
    return (
        <div
            style={{
                padding: "40px",
                fontFamily: "Arial",
            }}
        >
            <h1>{name}</h1>
            <p>You entered the {name}.</p>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/campus" element={<Campus />} />

                <Route
                    path="/lobby"
                    element={<Placeholder name="Common Lobby" />}
                />

                <Route
                    path="/meeting"
                    element={<Placeholder name="Meeting Room" />}
                />

                <Route
                    path="/library"
                    element={<Placeholder name="Library" />}
                />

                <Route
                    path="/coding-space"
                    element={<Placeholder name="Coding Space" />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;