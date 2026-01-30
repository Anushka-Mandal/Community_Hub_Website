// src/pages/Events.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function Notice_Events() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notices`);
      setEvents(res.data.filter((n) => n.type === "event"));
    } catch (err) {
      alert("Failed to load events.");
    }
  };

  const handlePost = async () => {
    if (!title || !content) return alert("All fields required");

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/notices`, {
        title,
        content,
        type: "event",
        userId: user._id,
      });
      setTitle("");
      setContent("");
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.error || "Error posting");
    }
  };

  const startEdit = (e) => {
    setEditingId(e._id);
    setEditTitle(e.title);
    setEditContent(e.content);
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
        type: "event",
        userId: user._id,
      });
      cancelEdit();
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.error || "Error updating");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/notices/${id}`, {
        data: { userId: user._id },
      });
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.error || "Error deleting");
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 text-blue-400">Community Events</h2>

      {user.role === "admin" && (
        <div className="bg-[#1f2a48] p-4 rounded-xl shadow mb-6">
          <h3 className="text-xl font-semibold mb-2">Post an Event</h3>
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

      {events.map((e) => (
        <div
          key={e._id}
          className="bg-[#1a2238] p-4 rounded-xl shadow border border-blue-400/20 mb-4"
        >
          {editingId === e._id ? (
            <>
              <input
                value={editTitle}
                onChange={(ev) => setEditTitle(ev.target.value)}
                className="w-full mb-2 p-2 bg-gray-800 rounded"
              />
              <textarea
                value={editContent}
                onChange={(ev) => setEditContent(ev.target.value)}
                className="w-full mb-2 p-2 bg-gray-800 rounded"
                rows={3}
              />
              <div className="flex gap-2 mt-2">
                <button onClick={() => saveEdit(e._id)} className="bg-green-600 px-3 py-1 rounded">Save</button>
                <button onClick={cancelEdit} className="bg-gray-600 px-3 py-1 rounded">Cancel</button>
              </div>
            </>
          ) : (
            <>
              <h4 className="text-xl font-semibold text-blue-300">{e.title}</h4>
              <p className="text-gray-300 mt-1">{e.content}</p>
              <p className="text-sm text-gray-500 mt-2">Posted by {e.postedBy?.name}</p>

              {user.role === "admin" && (
                <div className="mt-2 flex gap-2">
                  <button onClick={() => startEdit(e)} className="bg-yellow-500 px-3 py-1 rounded">Edit</button>
                  <button onClick={() => handleDelete(e._id)} className="bg-red-600 px-3 py-1 rounded">Delete</button>
                </div>
              )}
            </>
          )}
        </div>
      ))}

      {events.length === 0 && <p className="text-gray-400">No events available.</p>}
    </div>
  );
}
