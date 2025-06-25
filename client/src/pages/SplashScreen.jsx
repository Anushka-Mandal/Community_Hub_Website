import { useEffect, useState } from "react";
import logo from "@/assets/logo.png"; 


export default function SplashScreen({ onDone }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onDone, 300); // slight delay for smoother transition
          return 100;
        }
        return prev + 1;
      });
    }, 30); // ~3 seconds total

    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0D1525] text-white px-6 transition-opacity duration-700">
      <img src={logo} alt="App Logo" className="w-32 mb-8" />
      <div className="w-full max-w-md h-3 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-sm text-gray-400">{progress}%</p>
    </div>
  );
}
