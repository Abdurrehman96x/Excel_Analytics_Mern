import { useEffect, useState } from "react";
import axios from "axios";
import ThemeToggle from "../components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Github, Linkedin, Instagram } from "lucide-react";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [uploads, setUploads] = useState([]);
  const [charts, setCharts] = useState([]);
  const [chartTypes, setChartTypes] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchUploads = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/upload/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUploads(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Upload fetch error:", err);
      setUploads([]);
    }
  };

  const fetchCharts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/charts/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const chartData = Array.isArray(res.data) ? res.data : [];
      setCharts(chartData);

      // Safely extract types only if chart.type exists
      const uniqueTypes = [
        ...new Set(
          chartData.map((c) => c.type?.toLowerCase()).filter((type) => type) // Remove undefined/null
        ),
      ];
      setChartTypes(uniqueTypes);
    } catch (err) {
      console.error("Chart fetch error:", err);
      setCharts([]);
      setChartTypes([]);
    }
  };

  const handleDeleteUpload = async (uploadId) => {
    try {
      await axios.delete(`http://localhost:5000/api/upload/${uploadId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Upload deleted successfully");
      fetchUploads();
    } catch (err) {
      console.error("Delete upload error:", err.response?.data || err.message);
      toast.error("Failed to delete upload.");
    }
  };

  const handleDeleteChart = async (chartId) => {
    try {
      await axios.delete(`http://localhost:5000/api/charts/${chartId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Chart deleted successfully");
      fetchCharts();
    } catch (err) {
      console.error("Delete chart error:", err.response?.data || err.message);
      toast.error("Failed to delete chart.");
    }
  };

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) setUserName(name);

    fetchUploads();
    fetchCharts();
  }, []);

  const getChartBadgeColor = (type) => {
    const safeType = type?.toLowerCase(); // Null-safe
    switch (safeType) {
      case "bar":
        return "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      case "line":
        return "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "donut":
      case "doughnut":
        return "bg-pink-200 text-pink-800 dark:bg-pink-800 dark:text-pink-100";
      case "pie":
        return "bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "area":
        return "bg-purple-200 text-purple-800 dark:bg-purple-800 dark:text-purple-100";
      case "3d column":
        return "bg-indigo-200 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100";
      case "3d donut":
        return "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-100";
      default:
        return "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  return (
    <div className="relative min-h-screen text-gray-900 dark:text-white bg-gradient-to-br from-slate-100 to-blue-200 dark:from-[#0f172a] dark:to-[#1e293b]">
      <ToastContainer />
      <header className="flex items-center justify-between px-6 py-2 backdrop-blur-md bg-white/30 dark:bg-white/5 border-b border-white/20 sticky top-0 z-10 shadow-md">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/assets/excel_analytics_logo.png"
            alt="Excel Analytics Logo"
            className="w-14 h-14 sm:w-16 sm:h-16"
          />
          <h1 className="text-2xl font-semibold">Excel Analytics</h1>
        </div>
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
        <div>
          <h2 className="text-3xl font-bold mb-2">Welcome back, {userName}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Here's an overview of your Excel analytics
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 h-42">
          <div
            onClick={() => navigate("/upload")}
            className="cursor-pointer bg-gradient-to-r from-blue-200 to-blue-400 dark:from-blue-800 dark:to-blue-600 p-6 rounded-2xl shadow text-center border-l-4 border-blue-500 hover:shadow-xl transition h-full"
          >
            <p className="text-xl font-semibold">📤 Upload Excel File</p>
            <p className="text-sm text-gray-700 dark:text-gray-200">
              Import new data for analysis
            </p>
          </div>
          <div className="bg-gradient-to-r from-green-200 to-green-400 dark:from-green-800 dark:to-green-600 p-6 rounded-2xl shadow text-center border-l-4 border-green-500 h-full">
            <p className="text-4xl font-bold">{chartTypes.length}</p>
            <p className="text-sm text-gray-700 dark:text-gray-200">
              Different Chart Types
            </p>
          </div>
          <div className="bg-gradient-to-r from-purple-200 to-purple-400 dark:from-purple-800 dark:to-purple-600 p-6 rounded-2xl shadow text-center border-l-4 border-purple-500 h-full">
            <p className="text-4xl font-bold">{uploads.length}</p>
            <p className="text-sm text-gray-700 dark:text-gray-200">
              Files Uploaded
            </p>
          </div>
        </div>

        {/* Recent Files Table */}
        <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl shadow">
          <h3 className="text-xl font-bold p-4 border-b border-gray-200 dark:border-slate-700">
            📁 Recent Files
          </h3>
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-200">
              <tr>
                <th className="py-3 px-6">File Name</th>
                <th className="py-3 px-6">Created At</th>
                <th className="py-3 px-6">Size</th>
                <th className="py-3 px-6">Action</th>
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
                    <td className="py-3 px-6">
                      <button
                        onClick={() => handleDeleteUpload(upload._id)}
                        className="px-4 py-1 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                      >
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

        {/* Recent Charts Table */}
        <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl shadow mt-10">
          <h3 className="text-xl font-bold p-4 border-b border-gray-200 dark:border-slate-700">
            📊 Recent Charts
          </h3>
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-200">
              <tr>
                <th className="py-3 px-6">Title (File Name)</th>
                <th className="py-3 px-6">Chart Type</th>
                <th className="py-3 px-6">Created At</th>
                <th className="py-3 px-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {charts.length > 0 ? (
                charts.map((chart) => (
                  <tr
                    key={chart._id}
                    className="border-b dark:border-slate-700"
                  >
                    <td className="py-3 px-6">{chart.title || "Untitled"}</td>
                    <td className="py-3 px-6">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getChartBadgeColor(
                          chart.type
                        )}`}
                      >
                        {chart.type}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      {new Date(chart.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6">
                      <button
                        onClick={() => handleDeleteChart(chart._id)}
                        className="px-4 py-1 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                      >
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
                    No charts yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      <footer className="text-center text-m text-gray-500 py-6 mt-10 bg-white/30 dark:bg-white/5 border-t border-white/20">
        <p>
          © 2025 Excel Analytics by{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            Abdur Rehman Malik
          </span>
        </p>
        <div className="flex justify-center gap-4 mt-2">
          <a
            href="https://github.com/Abdurrehman96x"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black dark:hover:text-white transition"
          >
            <Github size={25} />
          </a>
          <a
            href="https://www.linkedin.com/in/abdur-rehman-malik-2a2b62239/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-700 dark:hover:text-blue-400 transition"
          >
            <Linkedin size={25} />
          </a>
          <a
            href="https://www.instagram.com/abdur.rehman96x_/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-600 dark:hover:text-pink-400 transition"
          >
            <Instagram size={25} />
          </a>
        </div>
      </footer>
      
    </div>
  );
};

export default Dashboard;
