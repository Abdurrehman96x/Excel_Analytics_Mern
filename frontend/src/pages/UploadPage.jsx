import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import axios from "axios";
import toast from "react-hot-toast";

import ThemeToggle from "../components/ThemeToggle";
import ChartConfigurator from "../components/ChartConfigurator";

const UploadPage = () => {
  const [userName, setUserName] = useState("");
  const [excelData, setExcelData] = useState([]);
  const [showCharts, setShowCharts] = useState(false);
  const [fileName, setFileName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) setUserName(name);
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    localStorage.setItem("uploadedFileName", file.name); 
    setShowCharts(false); // Hide charts on new upload
    setExcelData([]);     // Clear previous data
  };

  const handleAnalyzeAndUpload = async () => {
    const fileInput = document.getElementById("file-upload");
    const file = fileInput.files[0];
    const token = localStorage.getItem("token");

    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/upload/json`,
          {
            fileName: file.name,
            size: (file.size / 1024).toFixed(2) + " KB",
            rawData: jsonData,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Upload saved and analyzed!");
        setExcelData(jsonData);
        setShowCharts(true);
      } catch (err) {
        console.error("Upload failed:", err);
        toast.error("Failed to analyze and upload.");
        setShowCharts(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-200 dark:from-[#0f172a] dark:to-[#1e293b] text-gray-900 dark:text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-2 backdrop-blur-md bg-white/30 dark:bg-white/5 border-b border-white/20 sticky top-0 z-10 shadow-md">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/assets/excel_analytics_logo.png"
            alt="Logo"
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

      {/* Main Content */}
      <main className="p-6 max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 px-4 py-2 bg-red-600 hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600 text-white dark:text-white rounded transition"
        >
          ← Back to Dashboard
        </button>

        <h2 className="text-3xl font-bold mb-6">📤 Upload Excel File</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Welcome, <span className="font-semibold">{userName}</span>. Upload a{" "}
          .xls or .xlsx file and dive into instant visual insights.
        </p>

        {/* Upload Dropzone */}
        <div className="border-2 border-dashed border-blue-400 p-6 rounded-lg text-center bg-white dark:bg-slate-800 shadow mb-6">
          <input
            id="file-upload"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label htmlFor="file-upload" className="cursor-pointer select-none">
            <div className="text-blue-600 text-3xl">⬆</div>
            <p className="mt-2 font-medium">Click or drag to upload</p>
            <p className="text-xs text-gray-500">
              Supported formats: .xls, .xlsx
            </p>
          </label>
        </div>

        {/* Analyze Button */}
        {fileName && (
          <div className="mb-6">
            <p className="text-green-600 font-medium mb-2">
              ✅ File ready to analyze: {fileName}
            </p>
            <button
              onClick={handleAnalyzeAndUpload}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
            >
              📊 Analyze Data
            </button>
          </div>
        )}

        {/* Table Preview */}
        {excelData.length > 0 && (
          <div className="overflow-x-auto mb-8 border rounded-lg bg-white dark:bg-slate-800">
            <table className="table-auto w-full text-sm">
              <thead className="bg-gray-100 dark:bg-slate-700">
                <tr>
                  {Object.keys(excelData[0]).map((k) => (
                    <th key={k} className="px-4 py-2 border">
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelData.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="px-4 py-2 border">
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Chart Configurator */}
        {showCharts && excelData.length > 0 && (
          <ChartConfigurator data={excelData} />
        )}
      </main>
    </div>
  );
};

export default UploadPage;
