import { BrowserRouter, Routes, Route } from "react-router-dom";
import Campus from "./pages/Campus";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/campus" element={<Campus />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;