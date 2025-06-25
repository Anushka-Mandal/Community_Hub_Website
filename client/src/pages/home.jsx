import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [user, setUser] = useState({ name: "", flat: "", block: "", role: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/");
    }
  }, []);

  const features = [
    {
      title: "Maintenance Requests",
      icon: "🛠️",
      description: "Report and track your maintenance issues easily.",
      route: "/maintenance",
    },
    {
      title: "Community Notices",
      icon: "📢",
      description: "Stay updated with the latest announcements.",
      route: "/notices", // ✅ Updated
    },
    {
      title: "Events",
      icon: "🎉",
      description: "Join upcoming community gatherings and activities.",
      route: "/events", // ✅ Updated
    },
   {
    title: "Visitor",
    icon: "🧑‍💼",
    description: "Manage guest entries and visitor access.",
    route: "/visitor",
  },
  {
    title: "Resident",
    icon: "🏠",
    description: "Access resident services and personal dashboard.",
    route: "/resident",
  },

  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-[#0D1525] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#14203d] flex flex-col p-6 fixed h-full">
        <div className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-[#1c2541] to-[#3a506b] shadow-lg border border-blue-400/20">
          <h1 className="text-3xl font-bold text-blue-400 mb-6 tracking-wide">Community Hub</h1>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-white">{user.name}</p>
            <p className="text-md text-blue-200 mt-4">
              <span className="inline-block px-2 py-1 bg-blue-600 text-blue-300 font-medium capitalize">
                {user.role}
              </span>
            </p>
            <div className="mt-4 text-gray-300 space-y-1">
              <p><span className="font-semibold text-white">Block:</span> {user.block}</p>
              <p><span className="font-semibold text-white">Flat:</span> {user.flat}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-600 hover:bg-red-700 rounded-md py-2 font-semibold transition"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <h2 className="text-3xl font-bold mb-8 text-blue-400">Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(({ title, icon, description, route }) => (
            <div
              key={title}
              onClick={() => navigate(route)}
              className="bg-[#1A2238] rounded-xl p-6 shadow-md hover:shadow-blue-500/30 hover:scale-105 hover:border hover:border-blue-400 transition-all duration-300 cursor-pointer flex flex-col items-center text-center group"
            >
              <div className="text-6xl mb-5 group-hover:animate-bounce">{icon}</div>
              <h3 className="text-2xl font-semibold mb-3 text-blue-300 group-hover:text-blue-400 transition">
                {title}
              </h3>
              <p className="text-gray-300 group-hover:text-white transition-opacity duration-300 opacity-90 group-hover:opacity-100">
                {description}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
