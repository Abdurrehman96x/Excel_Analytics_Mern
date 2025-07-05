import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import ThemeToggle from "../components/ThemeToggle";
import ChartSection from "../components/ChartSection"; // Create this separately

const UploadPage = () => {
  const [userName, setUserName] = useState("");
  const [excelData, setExcelData] = useState([]);
  const [showCharts, setShowCharts] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) setUserName(name);
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      setExcelData(json);
      setShowCharts(false);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-200 dark:from-[#0f172a] dark:to-[#1e293b] text-gray-900 dark:text-white transition">
      {/* Header */}
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

      {/* Content */}
      <main className="p-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">📤 Upload Excel File</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Welcome, <span className="font-semibold">{userName}</span>. Upload your Excel file (.xls, .xlsx) and get smart data analysis.
        </p>

        {/* Upload Box */}
        <div className="border-2 border-dashed border-blue-400 p-6 rounded-lg text-center bg-white dark:bg-slate-800 shadow mb-6">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="text-blue-600 text-2xl">⬆</div>
            <p className="text-sm font-medium mt-2">Upload Excel File</p>
            <p className="text-xs text-gray-500">Click to browse (.xls/.xlsx)</p>
          </label>
        </div>

        {/* Preview Table */}
        {excelData.length > 0 && (
          <>
            <div className="text-green-600 font-medium mb-2">✅ File uploaded successfully</div>
            <h3 className="text-lg font-semibold mb-2">📄 File Preview</h3>
            <div className="overflow-x-auto mb-4 border rounded-lg bg-white dark:bg-slate-800">
              <table className="table-auto w-full text-sm">
                <thead className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-200">
                  <tr>
                    {Object.keys(excelData[0]).map((key) => (
                      <th key={key} className="px-4 py-2 border">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {excelData.map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="px-4 py-2 border">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setShowCharts(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition mb-6"
            >
              📊 Analyze Data
            </button>
          </>
        )}

        {/* Chart Section */}
        {showCharts && <ChartSection data={excelData} />}
      </main>
    </div>
  );
};

export default UploadPage;
