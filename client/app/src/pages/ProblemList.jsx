import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import ProblemItem from "../components/ProblemItem";
import Navbar from "../components/Navbar";
import Progress from "./Progress";
import ProblemTable from "./ProblemTable";

export default function ProblemList() {
  const { topicId } = useParams();
  const [problems, setProblems] = useState([]);
 const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    API.get(`/topics/${topicId}/problems`).then((res) => setProblems(res.data));
  }, [topicId]);

  const handleProgressUpdate = () => {
    setRefresh(!refresh); // trigger Progress refresh
  };
  return (
    <div>
      <Navbar/>
      <div style={{ padding: "2rem" }}>
       <h2>Problems</h2>     
       <ProblemTable problems={problems} onProgressUpdate={handleProgressUpdate} />
      </div>
    </div>
  );
}
