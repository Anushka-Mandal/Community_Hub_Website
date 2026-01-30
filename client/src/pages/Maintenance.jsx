import { useState, useEffect } from "react";
import axios from "axios";

export default function Maintenance() {
  const [requests, setRequests] = useState([]);
  const [issue, setIssue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editIssue, setEditIssue] = useState("");
  const [editStatus, setEditStatus] = useState("");
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

  const startEdit = (r) => {
    setEditingId(r._id);
    setEditIssue(r.issue);
    setEditStatus(r.status);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditIssue("");
    setEditStatus("");
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/maintenance/${id}`, {
        issue: editIssue,
        status: editStatus,
        userId: user._id,
      });
      cancelEdit();
      fetchRequests();
    } catch (err) {
      alert("Failed to update request.");
    }
  };

  const handleDelete = async (id) => {
  console.log("🗑 Attempt delete:", id);
  console.log("👤 Logged-in user:", user);

  const reqToDelete = requests.find(r => r._id === id);
  console.log("🛠 Request owner:", reqToDelete?.user);

  if (!confirm("Delete this request?")) return;

  try {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/maintenance/${id}`,
      {
        headers: {
          "x-user-id": user._id, // 🔥 MORE RELIABLE THAN BODY
        },
      }
    );
    fetchRequests();
  } catch (err) {
    console.error("❌ Delete error:", err.response?.data || err);
    alert(err.response?.data?.error || "Failed to delete request.");
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
            {editingId === req._id ? (
              <>
                <textarea
                  value={editIssue}
                  onChange={(e) => setEditIssue(e.target.value)}
                  className="w-full p-2 mb-2 bg-gray-800 rounded"
                  rows={3}
                />
                <input
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full p-2 mb-2 bg-gray-800 rounded"
                  placeholder="status"
                />
                <div className="flex gap-2">
                  <button onClick={() => saveEdit(req._id)} className="bg-green-600 px-3 py-1 rounded">Save</button>
                  <button onClick={cancelEdit} className="bg-gray-600 px-3 py-1 rounded">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-300">{req.issue}</p>
                <div className="text-sm text-gray-500 mt-2">
                  Posted by {req.user?.name} | Status: <span className="text-yellow-400">{req.status}</span>
                </div>

                {(user.role === "admin" || req.user?._id === user._id) && (
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => startEdit(req)} className="bg-yellow-500 px-3 py-1 rounded">Edit</button>
                    <button onClick={() => handleDelete(req._id)} className="bg-red-600 px-3 py-1 rounded">Delete</button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
