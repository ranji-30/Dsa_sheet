import ProblemItem from "../components/ProblemItem";

export default function ProblemTable({ problems, onProgressUpdate }) {
  return (
    <div className="container mt-4">
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th scope="col">Completed</th>
              <th scope="col">Problem Name</th>
              <th scope="col">Level</th>
              <th scope="col">LeetCode Link</th>
              <th scope="col">YouTube Link</th>
              <th scope="col">Article Link</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <ProblemItem
                key={problem._id}
                problem={problem}
                onProgressUpdate={onProgressUpdate}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
