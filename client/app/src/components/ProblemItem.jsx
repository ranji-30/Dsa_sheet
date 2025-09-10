import { useState, useEffect } from "react";
import API from "../api/axios";

export default function ProblemItem({ problem, onProgressUpdate }) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/users/me/progress", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const isDone = res.data.completedProblems.some(
          (p) => String(p.problemId) === String(problem._id)
        );
        setCompleted(isDone);
      } catch (err) {
        console.error("Error loading progress", err);
      }
    };

    fetchProgress();
  }, [problem._id]);

  const handleToggle = async () => {
    const newCompleted = !completed;
    setCompleted(newCompleted);

    try {
      const token = localStorage.getItem("token");
      await API.post(
        "/users/me/progress",
        { problemId: problem._id, completed: newCompleted },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (onProgressUpdate) onProgressUpdate();
    } catch (err) {
      console.error("Progress update failed", err);
    }
  };

  return (
    <tr>
      <td>
        <input
          type="checkbox"
          checked={completed}
          onChange={handleToggle}
          className="form-check-input"
        />
      </td>
      <td className={completed ? "text-decoration-line-through text-muted" : ""}>
        {problem.title}
      </td>
      <td>
        <span
          className={`badge ${
            problem.level === "Easy"
              ? "bg-success"
              : problem.level === "Medium"
              ? "bg-warning text-dark"
              : "bg-danger"
          }`}
        >
          {problem.level}
        </span>
      </td>
      <td>
        <a
          href={problem.leetcodeLink}
          target="_blank"
          rel="noreferrer"
          className="btn btn-sm btn-outline-primary"
        >
          Practise
        </a>
      </td>
      <td>
        <a
          href={problem.youtubeLink}
          target="_blank"
          rel="noreferrer"
          className="btn btn-sm btn-outline-danger"
        >
          Watch
        </a>
      </td>
      <td>
        <a
          href={problem.articleLink}
          target="_blank"
          rel="noreferrer"
          className="btn btn-sm btn-outline-success"
        >
          Read
        </a>
      </td>
    </tr>
  );
}
