// src/components/Layout.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", block: "", flat: "", role: "" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-[#0D1525] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#14203d] p-6 fixed h-full flex flex-col">
        <h1 className="text-2xl font-bold text-blue-400 mb-10">Community Hub</h1>
        <nav className="space-y-4 flex-1">
          <Link to="/home" className="block hover:text-blue-400">Dashboard</Link>
          <Link to="/notices" className="block hover:text-blue-400">Community Notices</Link>
          <Link to="/events" className="block hover:text-blue-400">Events</Link>
          <Link to="/maintenance" className="block hover:text-blue-400">Maintenance</Link>
          <Link to="/parking" className="block hover:text-blue-400">Parking</Link>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-600 hover:bg-red-700 rounded-md py-2 font-semibold transition"
        >
          Logout
        </button>
      </aside>

      {/* Main Page Content */}
      <main className="ml-64 p-8 w-full">{children}</main>
    </div>
  );
}
