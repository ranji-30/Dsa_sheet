import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function Progress() {
  const [progress, setProgress] = useState({ easy: 0, medium: 0, hard: 0 });

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/progress/summary", {
  headers: { Authorization: `Bearer ${token}` },
});
setProgress(res.data);
    } catch (err) {
      console.error("Failed to fetch progress", err);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  return (
    <div><Navbar />
    <div style={{ margin: "2rem", padding: "1rem", border: "1px solid black" }}>
      <h2>Your Progress</h2>
      <p>Easy: {progress.easy}%</p>
      <p>Medium: {progress.medium}%</p>
      <p>Hard: {progress.hard}%</p>
    </div></div>
  );
}
