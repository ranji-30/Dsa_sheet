import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import TopicList from "./pages/TopicList";
import ProblemList from "./pages/ProblemList";
import Progress from "./pages/Progress";
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/"  element={<Login />} />
         <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} /> 

        {/* Protected area (after login) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/progress" element={<Progress />} />   
        <Route path="/topics" element={<TopicList />} />
        <Route path="/topics/:topicId/problems" element={<ProblemList />} />
      </Routes>
    </Router>
  );
}

export default App;
