import { useState, useEffect } from "react";
import axios from "axios";

export default function Maintenance() {
  const [requests, setRequests] = useState([]);
  const [issue, setIssue] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/maintenance`);
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching maintenance requests:", err);
    }
  };

  const handleSubmit = async () => {
    if (!issue) return alert("Issue description required.");
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/maintenance`, {
        issue,
        userId: user._id,
      });
      setIssue("");
      fetchRequests();
    } catch (err) {
      alert("Failed to submit request.");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-8 text-white bg-[#0D1525] min-h-screen">
      <h2 className="text-3xl font-bold mb-4 text-blue-400">Maintenance Requests</h2>

      {/* Submission Section */}
      <div className="mb-6 bg-[#1f2a48] p-4 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-2">Submit an Issue</h3>
        <textarea
          placeholder="Describe the issue..."
          className="w-full p-2 mb-2 bg-gray-800 rounded"
          rows={4}
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>

      {/* List of Requests */}
      <div className="space-y-4">
        {requests.map((req) => (
          <div key={req._id} className="bg-[#1a2238] p-4 rounded-xl border border-blue-400/20">
            <p className="text-gray-300">{req.issue}</p>
            <div className="text-sm text-gray-500 mt-2">
              Posted by {req.user?.name} | Status: <span className="text-yellow-400">{req.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
