import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      padding: "1rem", 
      background: "midnightblue", 
      color: "white" 
    }}>
      <h2>DSA Sheet</h2>
      <div>
        <Link to="/dashboard" style={{ color: "white", marginRight: "1rem" }}>Profile</Link>
       
        <Link to="/topics" style={{ color: "white", marginRight: "1rem" }}>Topics</Link>
         <Link to="/progress" style={{ color: "white", marginRight: "1rem" }}>Progress</Link>
        <button onClick={handleLogout} style={{ background: "red",  borderRadius: "10px",color: "white", border: "none", padding: "0.5rem 0.7rem", cursor: "pointer" }}>
          Logout
        </button>
      </div>
    </nav>
  );
}
