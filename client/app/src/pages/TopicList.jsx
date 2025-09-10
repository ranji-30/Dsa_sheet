import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import ProblemTable from "./ProblemTable"; // ✅ reuse your existing table

export default function TopicList() {
  const [topics, setTopics] = useState([]);
  const [openTopic, setOpenTopic] = useState(null);
  const [problemsByTopic, setProblemsByTopic] = useState({}); // store problems by topicId
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    API.get("/topics").then((res) => setTopics(res.data));
  }, []);

  const handleAddTopic = async () => {
    const name = prompt("Enter topic name");
    const description = prompt("Enter topic description");

    try {
      await API.post(
        "/topics",
        { name, description },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const res = await API.get("/topics");
      setTopics(res.data);
    } catch (err) {
      alert("Only admins can add topics!", err);
    }
  };

  const toggleTopic = async (id) => {
    if (openTopic === id) {
      setOpenTopic(null);
      return;
    }

    setOpenTopic(id);

    // only fetch problems if not already loaded
    if (!problemsByTopic[id]) {
      try {
        const res = await API.get(`/topics/${id}/problems`);
        setProblemsByTopic((prev) => ({
          ...prev,
          [id]: res.data,
        }));
      } catch (err) {
        console.error("Failed to load problems", err);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container my-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fw-bold">📚 Topics</h2>
          {user?.role === "admin" && (
            <button className="btn btn-primary" onClick={handleAddTopic}>
              ➕ Add Topic
            </button>
          )}
        </div>

        {topics.length === 0 ? (
          <p className="text-muted">No topics available yet.</p>
        ) : (
          <div className="accordion" id="topicAccordion">
            {topics.map((t) => (
              <div className="accordion-item" key={t._id}>
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${
                      openTopic === t._id ? "" : "collapsed"
                    }`}
                    type="button"
                    onClick={() => toggleTopic(t._id)}
                  >
                    {t.name}
                  </button>
                </h2>
                <div
                  className={`accordion-collapse collapse ${
                    openTopic === t._id ? "show" : ""
                  }`}
                >
                  <div className="accordion-body">
                    {problemsByTopic[t._id] ? (
                      problemsByTopic[t._id].length > 0 ? (
                        <ProblemTable problems={problemsByTopic[t._id]} />
                      ) : (
                        <p className="text-muted">No problems for this topic yet.</p>
                      )
                    ) : (
                      <p className="text-muted">Loading problems...</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
