// src/pages/CommunityNotices.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function CommunityNotices() {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notices`);
      setNotices(res.data.filter((n) => n.type === "notice"));
    } catch (err) {
      alert("Failed to load notices.");
    }
  };

  const handlePost = async () => {
    if (!title || !content) return alert("All fields required");

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/notices`, {
        title,
        content,
        type: "notice",
        userId: user._id,
      });
      setTitle("");
      setContent("");
      fetchNotices();
    } catch (err) {
      alert(err.response?.data?.error || "Error posting");
    }
  };

  const startEdit = (n) => {
    setEditingId(n._id);
    setEditTitle(n.title);
    setEditContent(n.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/notices/${id}`, {
        title: editTitle,
        content: editContent,
        type: "notice",
        userId: user._id,
      });
      cancelEdit();
      fetchNotices();
    } catch (err) {
      alert(err.response?.data?.error || "Error updating");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this notice?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/notices/${id}`, {
        data: { userId: user._id },
      });
      fetchNotices();
    } catch (err) {
      alert(err.response?.data?.error || "Error deleting");
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 text-blue-400">Community Notices</h2>

      {user.role === "admin" && (
        <div className="bg-[#1f2a48] p-4 rounded-xl shadow mb-6">
          <h3 className="text-xl font-semibold mb-2">Post a Notice</h3>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-2 p-2 bg-gray-800 rounded"
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full mb-2 p-2 bg-gray-800 rounded"
            rows={4}
          />
          <button
            onClick={handlePost}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Post
          </button>
        </div>
      )}

      {notices.map((n) => (
        <div
          key={n._id}
          className="bg-[#1a2238] p-4 rounded-xl shadow border border-blue-400/20 mb-4"
        >
          {editingId === n._id ? (
            <>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full mb-2 p-2 bg-gray-800 rounded"
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full mb-2 p-2 bg-gray-800 rounded"
                rows={3}
              />
              <div className="flex gap-2 mt-2">
                <button onClick={() => saveEdit(n._id)} className="bg-green-600 px-3 py-1 rounded">Save</button>
                <button onClick={cancelEdit} className="bg-gray-600 px-3 py-1 rounded">Cancel</button>
              </div>
            </>
          ) : (
            <>
              <h4 className="text-xl font-semibold text-blue-300">{n.title}</h4>
              <p className="text-gray-300 mt-1">{n.content}</p>
              <p className="text-sm text-gray-500 mt-2">Posted by {n.postedBy?.name}</p>

              {user.role === "admin" && (
                <div className="mt-2 flex gap-2">
                  <button onClick={() => startEdit(n)} className="bg-yellow-500 px-3 py-1 rounded">Edit</button>
                  <button onClick={() => handleDelete(n._id)} className="bg-red-600 px-3 py-1 rounded">Delete</button>
                </div>
              )}
            </>
          )}
        </div>
      ))}

      {notices.length === 0 && <p className="text-gray-400">No notices available.</p>}
    </div>
  );
}
