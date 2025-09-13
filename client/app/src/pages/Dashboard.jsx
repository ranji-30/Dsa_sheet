import Navbar from "../components/Navbar";



export default function Dashboard() {
const storedUser = localStorage.getItem("user");

let user = null;
try {
  if (storedUser && storedUser !== "undefined") {
    user = JSON.parse(storedUser);
  }
} catch (err) {
  console.error("Failed to parse user from localStorage", err);
}


  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <div className="card shadow p-4">
           <h2 className="text-center mb-3">Hello "{user ? user.name : "guest"}"</h2>
          <h2 className="text-center mb-3">Welcome to Your DSA Dashboard 🎯</h2>
          <p className="text-center text-muted">
            Track your progress, solve problems, and become a DSA master!
          </p>

          <hr />

          {/* <div className="mt-4">
            <h4 className="mb-3">📌 Quick Links</h4>
            <ul className="list-group">
              <li className="list-group-item">
                <a href="/topics" className="text-decoration-none">📚 Browse Topics</a>
              </li>
              <li className="list-group-item">
                <a href="/dashboard" className="text-decoration-none">📊 Check Progress</a>
              </li>
            </ul>
          </div> */}
        </div>
      </div>
    </div>
  );
}
