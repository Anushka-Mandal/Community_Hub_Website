// src/pages/CommunityNotices.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function CommunityNotices() {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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
          <h4 className="text-xl font-semibold text-blue-300">{n.title}</h4>
          <p className="text-gray-300 mt-1">{n.content}</p>
          <p className="text-sm text-gray-500 mt-2">Posted by {n.postedBy?.name}</p>
        </div>
      ))}

      {notices.length === 0 && <p className="text-gray-400">No notices available.</p>}
    </div>
  );
}
