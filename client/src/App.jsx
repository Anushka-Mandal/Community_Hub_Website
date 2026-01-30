import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen";
import Auth from "./pages/Auth";
import Home from "./pages/home";
import Layout from "./pages/Layout";
import CommunityNotices from "./pages/Community";
import Notice_Events from "./pages/Event.jsx";
import Maintenance from "./pages/Maintenance.jsx";
import Visitor from "./pages/Visitor.jsx";
import Resident from "./pages/Resident.jsx";

export default function App() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDone(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!done) return <SplashScreen onDone={() => setDone(true)} />;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Auth />} />
      <Route path="/home" element={<Home />} />

      <Route path="/notices" element={<Layout><CommunityNotices /></Layout>} />
      <Route path="/events" element={<Layout><Notice_Events /></Layout>} />
      <Route path="/maintenance" element={<Layout><Maintenance /></Layout>} />
      <Route path="/visitors" element={<Layout><Visitor /></Layout>} />
      <Route path="/visitor" element={<Layout><Visitor /></Layout>} />
      <Route path="/resident" element={<Layout><Resident /></Layout>} />


      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
