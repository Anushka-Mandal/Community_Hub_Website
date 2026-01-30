import { useEffect, useState } from "react";
import axios from "axios";

export default function Resident() {
  const [user, setUser] = useState({ name: "", block: "", flat: "", role: "" });
  const [requests, setRequests] = useState([]);
  const [issue, setIssue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editIssue, setEditIssue] = useState("");

  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/maintenance`, { params: { userId: user._id } });
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchVisitors = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/visitors`, { params: { userId: user._id } });
      setVisitors(res.data.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user._id) {
      fetchRequests();
      fetchVisitors();
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!issue) return alert("Issue required");
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/maintenance`, { issue, userId: user._id });
      setIssue("");
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to submit");
    }
  };

  const startEdit = (r) => {
    setEditingId(r._id);
    setEditIssue(r.issue);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditIssue("");
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/maintenance/${id}`, { issue: editIssue, userId: user._id });
      cancelEdit();
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this request?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/maintenance/${id}`, { data: { userId: user._id } });
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete");
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 text-blue-400">Resident Profile</h2>

      <div className="bg-[#1f2a48] p-4 rounded-xl shadow mb-6">
        <h3 className="text-xl font-semibold mb-2">Profile</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="text-gray-400 text-sm">Name</label>
            <div className="p-2 bg-gray-900 rounded">{user.name}</div>
          </div>
          <div>
            <label className="text-gray-400 text-sm">Block</label>
            <div className="p-2 bg-gray-900 rounded">{user.block}</div>
          </div>
          <div>
            <label className="text-gray-400 text-sm">Flat</label>
            <div className="p-2 bg-gray-900 rounded">{user.flat}</div>
          </div>
          <div>
            <label className="text-gray-400 text-sm">Role</label>
            <div className="p-2 bg-gray-900 rounded">{user.role}</div>
          </div>
        </div>
      </div>

      <div className="bg-[#1f2a48] p-4 rounded-xl shadow mb-6">
        <h3 className="text-xl font-semibold mb-2">My Maintenance Requests</h3>
        <div className="mb-2">
          <textarea value={issue} onChange={(e) => setIssue(e.target.value)} className="w-full p-2 bg-gray-800 rounded" rows={3} placeholder="Describe the issue..." />
          <div className="mt-2">
            <button onClick={handleSubmit} className="bg-blue-600 px-4 py-2 rounded">Submit</button>
          </div>
        </div>

        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req._id} className="bg-[#1a2238] p-4 rounded-xl border border-blue-400/20">
              {editingId === req._id ? (
                <>
                  <textarea value={editIssue} onChange={(e) => setEditIssue(e.target.value)} className="w-full p-2 bg-gray-800 rounded" rows={3} />
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => saveEdit(req._id)} className="bg-green-600 px-3 py-1 rounded">Save</button>
                    <button onClick={cancelEdit} className="bg-gray-600 px-3 py-1 rounded">Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-300">{req.issue}</p>
                  <div className="text-sm text-gray-500 mt-2">Status: <span className="text-yellow-400">{req.status}</span></div>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => startEdit(req)} className="bg-yellow-500 px-3 py-1 rounded">Edit</button>
                    <button onClick={() => handleDelete(req._id)} className="bg-red-600 px-3 py-1 rounded">Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}

          {requests.length === 0 && <p className="text-gray-400">No maintenance requests yet.</p>}
        </div>
      </div>

      <div className="bg-[#1f2a48] p-4 rounded-xl shadow mb-6">
        <h3 className="text-xl font-semibold mb-2">Recent Visitors</h3>
        <div className="space-y-2">
          {visitors.map((v) => (
            <div key={v._id} className="bg-[#1a2238] p-3 rounded flex justify-between">
              <div>
                <div className="font-semibold">{v.name}</div>
                <div className="text-sm text-gray-400">{v.purpose} • {new Date(v.datetime).toLocaleString()}</div>
              </div>
            </div>
          ))}

          {visitors.length === 0 && <p className="text-gray-400">No recent visitors.</p>}
        </div>
      </div>
    </div>
  );
}
