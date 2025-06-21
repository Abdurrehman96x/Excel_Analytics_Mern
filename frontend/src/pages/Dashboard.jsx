import { useEffect, useState } from "react";
import ThemeToggle from "../components/ThemeToggle";

const Dashboard = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) setUserName(name);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden text-gray-900 dark:text-white transition-colors duration-300">
      
      {/* 🌌 Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-100 to-blue-200 dark:from-[#0f172a] dark:to-[#1e293b]" />

      {/* 🔒 Header */}
      <header className="flex items-center justify-between px-6 py-4 backdrop-blur-md bg-white/30 dark:bg-white/5 border-b border-white/20 sticky top-0 z-10 shadow-md">
        <div>
          <h1 className="text-2xl font-semibold">📊 Dashboard</h1>
          {userName && (
            <p className="text-md text-gray-700 dark:text-gray-300">Welcome, <span className="font-semibold">{userName}</span> 👋</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("userName");
              window.location.href = "/login";
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* 📈 Cards */}
      <main className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white/40 dark:bg-white/10 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition"
          >
            <h2 className="text-xl font-semibold mb-2">Card {i + 1}</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Chart or stats info goes here.
            </p>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Dashboard;
