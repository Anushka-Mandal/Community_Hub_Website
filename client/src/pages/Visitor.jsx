import { useEffect, useState } from "react";
import axios from "axios";

export default function Visitor() {
  const [visitors, setVisitors] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("Guest");
  const [datetime, setDatetime] = useState("");
  const [idProofType, setIdProofType] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editPurpose, setEditPurpose] = useState("");
  const [editDatetime, setEditDatetime] = useState("");
  const [editIdProof, setEditIdProof] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchVisitors = async () => {
    try {
      const params = user.role === "admin" ? {} : { userId: user._id };
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/visitors`, { params });
      setVisitors(res.data);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to load visitors");
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleAdd = async () => {
    if (!name || !phone || !datetime) return alert("Please fill required fields");
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/visitors`, {
        name,
        phone,
        purpose,
        datetime,
        flat: user.flat,
        block: user.block,
        idProofType,
        userId: user._id,
      });
      setName("");
      setPhone("");
      setPurpose("Guest");
      setDatetime("");
      setIdProofType("");
      fetchVisitors();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add visitor");
    }
  };

  const startEdit = (v) => {
    setEditingId(v._id);
    setEditName(v.name);
    setEditPhone(v.phone);
    setEditPurpose(v.purpose);
    setEditDatetime(new Date(v.datetime).toISOString().slice(0, 16)); // for datetime-local
    setEditIdProof(v.idProofType || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditPhone("");
    setEditPurpose("");
    setEditDatetime("");
    setEditIdProof("");
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/visitors/${id}`, {
        name: editName,
        phone: editPhone,
        purpose: editPurpose,
        datetime: editDatetime,
        idProofType: editIdProof,
        userId: user._id,
      });
      cancelEdit();
      fetchVisitors();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update visitor");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this visitor entry?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/visitors/${id}`, { data: { userId: user._id } });
      fetchVisitors();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete visitor");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/visitors/${id}/status`, { status, userId: user._id });
      fetchVisitors();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update status");
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 text-blue-400">Visitor Log</h2>

      {/* Add form */}
      <div className="bg-[#1f2a48] p-4 rounded-xl shadow mb-6">
        <h3 className="text-xl font-semibold mb-2">Add Visitor</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input className="p-2 bg-gray-800 rounded" placeholder="Visitor name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="p-2 bg-gray-800 rounded" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <select className="p-2 bg-gray-800 rounded" value={purpose} onChange={(e) => setPurpose(e.target.value)}>
            <option>Guest</option>
            <option>Delivery</option>
            <option>Maintenance</option>
            <option>Cab</option>
            <option>Other</option>
          </select>
          <input type="datetime-local" className="p-2 bg-gray-800 rounded" value={datetime} onChange={(e) => setDatetime(e.target.value)} />
          <input className="p-2 bg-gray-800 rounded" placeholder="ID proof (optional)" value={idProofType} onChange={(e) => setIdProofType(e.target.value)} />
          <div className="flex items-center gap-2">
            <input disabled className="p-2 bg-gray-900 rounded" value={`${user.block} ${user.flat}`} />
            <button onClick={handleAdd} className="bg-blue-600 px-4 py-2 rounded">Add Visitor</button>
          </div>
        </div>
      </div>

      {/* Visitor table */}
      <div className="bg-[#1a2238] p-4 rounded-xl shadow">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="text-sm text-gray-400">
              <th className="p-2">Name</th>
              <th className="p-2">Purpose</th>
              <th className="p-2">Date & Time</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((v) => (
              <tr key={v._id} className="border-t border-blue-400/10">
                <td className="p-2">
                  {editingId === v._id ? (
                    <input value={editName} onChange={(e) => setEditName(e.target.value)} className="p-1 bg-gray-800 rounded w-full" />
                  ) : (
                    v.name
                  )}
                </td>
                <td className="p-2">
                  {editingId === v._id ? (
                    <select value={editPurpose} onChange={(e) => setEditPurpose(e.target.value)} className="p-1 bg-gray-800 rounded">
                      <option>Guest</option>
                      <option>Delivery</option>
                      <option>Maintenance</option>
                      <option>Cab</option>
                      <option>Other</option>
                    </select>
                  ) : (
                    v.purpose
                  )}
                </td>
                <td className="p-2">
                  {editingId === v._id ? (
                    <input type="datetime-local" value={editDatetime} onChange={(e) => setEditDatetime(e.target.value)} className="p-1 bg-gray-800 rounded" />
                  ) : (
                    new Date(v.datetime).toLocaleString()
                  )}
                </td>
                <td className="p-2">
                  {editingId === v._id ? (
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(v._id)} className="bg-green-600 px-2 py-1 rounded">Save</button>
                      <button onClick={cancelEdit} className="bg-gray-600 px-2 py-1 rounded">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      {(user.role === "admin" || v.createdBy?._id === user._id) && (
                        <>
                          <button onClick={() => startEdit(v)} className="bg-yellow-500 px-2 py-1 rounded">Edit</button>
                          <button onClick={() => handleDelete(v._id)} className="bg-red-600 px-2 py-1 rounded">Delete</button>
                        </>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {visitors.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-gray-400">No visitor records.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
