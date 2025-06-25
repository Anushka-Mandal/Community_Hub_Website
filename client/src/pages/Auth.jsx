import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Auth() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [selectedBlock, setSelectedBlock] = useState("A");
  const [flat, setFlat] = useState("A1");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("resident");

  const navigate = useNavigate();

  const generateFlats = (block) => {
    return Array.from({ length: 20 }, (_, i) => `${block}${i + 1}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isSignIn
      ? "http://localhost:3001/signin"
      : "http://localhost:3001/users";

    const payload = {
      block: selectedBlock,
      flat,
      password,
      ...(!isSignIn ? { name, role } : {}),
    };

    try {
      const response = await axios.post(endpoint, payload);
      const user = response.data.user || response.data;

      localStorage.setItem("user", JSON.stringify(user));

      alert(isSignIn ? "Signed in successfully!" : "Signed up successfully!");
      navigate("/home");
    } catch (error) {
      const backendMessage = error.response?.data?.error;

      if (backendMessage) {
        alert(backendMessage); // shows "Invalid credentials" or signup error
      } else {
        alert("Something went wrong. Please try again.");
      }

      console.error("Auth error:", backendMessage || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1525] text-white flex flex-col items-center justify-center px-4">
      {/* Toggle Buttons */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setIsSignIn(true)}
          className={`px-4 py-2 rounded ${isSignIn ? "bg-blue-600" : "bg-gray-700"}`}
        >
          Sign In
        </button>
        <button
          onClick={() => setIsSignIn(false)}
          className={`px-4 py-2 rounded ${!isSignIn ? "bg-blue-600" : "bg-gray-700"}`}
        >
          Sign Up
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        {!isSignIn && (
          <>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-gray-800 rounded"
              required
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 bg-gray-800 rounded"
              required
            >
              <option value="resident">Resident</option>
              <option value="security">Security</option>
              <option value="admin">Admin</option>
            </select>
          </>
        )}

        <select
          value={selectedBlock}
          onChange={(e) => {
            const newBlock = e.target.value;
            setSelectedBlock(newBlock);
            setFlat(`${newBlock}1`);
          }}
          className="w-full p-2 bg-gray-800 rounded"
        >
          {["A", "B", "C"].map((block) => (
            <option key={block} value={block}>
              Block {block}
            </option>
          ))}
        </select>

        <select
          value={flat}
          onChange={(e) => setFlat(e.target.value)}
          className="w-full p-2 bg-gray-800 rounded"
        >
          {generateFlats(selectedBlock).map((flat) => (
            <option key={flat} value={flat}>
              {flat}
            </option>
          ))}
        </select>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 bg-gray-800 rounded"
          required
        />

        <button
          type="submit"
          className={`w-full py-2 rounded ${
            isSignIn ? "bg-blue-600" : "bg-green-600"
          }`}
        >
          {isSignIn ? "Sign In" : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
