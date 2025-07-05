import { useEffect, useState } from "react";
import axios from "axios";
import ThemeToggle from "../components/ThemeToggle";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [uploads, setUploads] = useState([]);
  const navigate = useNavigate();

  const fetchUploads = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/api/upload/history", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Only update if it's actually an array
      if (Array.isArray(res.data)) {
        setUploads(res.data);
      } else {
        console.warn("Unexpected response", res.data);
        setUploads([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      if (err.response?.status === 404 || err.response?.status === 204) {
        setUploads([]); // no uploads yet, do not show alert
      } else {
        alert("Failed to load uploads.");
      }
    }
  };

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) setUserName(name);
    fetchUploads();
  }, []);

  return (
    <div className="relative min-h-screen text-gray-900 dark:text-white bg-gradient-to-br from-slate-100 to-blue-200 dark:from-[#0f172a] dark:to-[#1e293b]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-2 backdrop-blur-md bg-white/30 dark:bg-white/5 border-b border-white/20 sticky top-0 z-10 shadow-md">
        {/* Logo + Title */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/assets/excel_analytics_logo.png"
            alt="Excel Analytics Logo"
            className="w-14 h-14 sm:w-16 sm:h-16 "
          />
          <h1 className="text-2xl font-semibold">Excel Analytics</h1>
        </div>

        {/* Theme toggle + Logout */}
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

      <main className="p-6 space-y-10">
        {/* Welcome */}
        <div>
          <h2 className="text-3xl font-bold mb-2">Welcome back, {userName}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Here's an overview of your Excel analytics
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div
            onClick={() => navigate("/upload")}
            className="cursor-pointer bg-white dark:bg-slate-800 p-6 rounded-2xl shadow text-center border-l-4 border-blue-500 hover:shadow-xl transition"
          >
            <p className="text-xl font-semibold">📤 Upload Excel File</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Import new data for analysis
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow text-center border-l-4 border-green-500">
            <p className="text-4xl font-bold">{uploads.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Charts Created
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow text-center border-l-4 border-purple-500">
            <p className="text-4xl font-bold">{uploads.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Files Uploaded
            </p>
          </div>
        </div>

        {/* Upload History */}
        <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl shadow">
          <h3 className="text-xl font-bold p-4 border-b border-gray-200 dark:border-slate-700">
            📁 Recent Files
          </h3>
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-200">
              <tr>
                <th className="py-3 px-6">File Name</th>
                <th className="py-3 px-6">Date Uploaded</th>
                <th className="py-3 px-6">Size</th>
                <th className="py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {uploads.length > 0 ? (
                uploads.map((upload) => (
                  <tr
                    key={upload._id}
                    className="border-b dark:border-slate-700"
                  >
                    <td className="py-3 px-6">{upload.fileName}</td>
                    <td className="py-3 px-6">
                      {new Date(upload.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6">{upload.size || "—"}</td>
                    <td className="py-3 px-6 space-x-3">
                      <button className="text-blue-600 hover:underline">
                        Analyze
                      </button>
                      <button className="text-red-600 hover:underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="py-4 px-6 text-center text-gray-500"
                  >
                    No uploads yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Optional Recent Charts Section */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
          <h3 className="text-xl font-bold mb-4">📊 Recent Charts</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No charts rendered yet.
          </p>
          {/* You can replace this with actual chart components */}
        </div>
      </main>

      <footer className="text-center text-xs text-gray-500 py-4 mt-10">
        © 2025 Excel Analytics. All rights reserved.
      </footer>
    </div>
  );
};

export default Dashboard;
