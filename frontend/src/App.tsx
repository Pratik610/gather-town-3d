import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginScreen from "./screens/LoginScreen";
import DashboardScreen from "./screens/DashboardScreen";
import PlaygroundScreen from "./screens/PlaygroundScreen";
import "./index.css";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" Component={LoginScreen} />
        <Route path="/" Component={DashboardScreen} index />
        <Route path="/playground/:id" Component={PlaygroundScreen} index />

      </Routes>
    </Router>
  );
}

export default App;
