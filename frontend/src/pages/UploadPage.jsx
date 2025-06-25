// src/pages/UploadPage.jsx
import UploadForm from "../components/UploadForm";
import ThemeToggle from "../components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const UploadPage = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) setUserName(name);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-200 dark:from-[#0f172a] dark:to-[#1e293b] text-gray-900 dark:text-white transition">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 sticky top-0 z-10 backdrop-blur-md bg-white/30 dark:bg-white/5 border-b border-white/20 shadow-md">
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          📊 Excel Analytics
        </h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="p-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">📤 Upload Excel File</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Welcome, <span className="font-semibold">{userName}</span>. Upload your Excel file (.xls, .xlsx) and get smart data analysis.
        </p>
        <UploadForm onUpload={() => navigate("/dashboard")} />
      </main>
    </div>
  );
};

export default UploadPage;
