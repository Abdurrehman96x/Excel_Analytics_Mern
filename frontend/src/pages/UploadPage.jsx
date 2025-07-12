// src/pages/UploadPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import ThemeToggle from "../components/ThemeToggle";
import ChartConfigurator from "../components/ChartConfigurator";   // ← rename if needed

const UploadPage = () => {
  /* ─────────────────────────  state  ───────────────────────── */
  const [userName,   setUserName]   = useState("");
  const [excelData,  setExcelData]  = useState([]);
  const [showCharts, setShowCharts] = useState(false);

  const navigate = useNavigate();

  /* ───────────────────  grab user name once  ───────────────── */
  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) setUserName(name);
  }, []);

  /* ────────────────────  parse excel upload  ───────────────── */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data      = new Uint8Array(evt.target.result);
      const workbook  = XLSX.read(data, { type: "array" });
      const sheet     = workbook.Sheets[workbook.SheetNames[0]];
      const json      = XLSX.utils.sheet_to_json(sheet);
      setExcelData(json);
      setShowCharts(false);      // hide old charts until user clicks again
    };
    reader.readAsArrayBuffer(file);
  };

  /* ────────────────  numeric columns helper  ───────────────── */
  const numericCols = excelData.length
    ? Object.keys(excelData[0]).filter(k => typeof excelData[0][k] === "number")
    : [];

  /* ********************************************************************* */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-200 dark:from-[#0f172a] dark:to-[#1e293b] text-gray-900 dark:text-white">

      {/* ===============  Header  =============== */}
      <header className="flex items-center justify-between px-6 py-2 backdrop-blur-md bg-white/30 dark:bg-white/5 border-b border-white/20 sticky top-0 z-10 shadow-md">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <img src="/assets/excel_analytics_logo.png" alt="Logo" className="w-14 h-14 sm:w-16 sm:h-16 dark:invert" />
          <h1 className="text-2xl font-semibold">Excel Analytics</h1>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* ===============  Main  =============== */}
      <main className="p-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">📤 Upload Excel File</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Welcome, <span className="font-semibold">{userName}</span>. Upload a .xls or .xlsx file and dive into instant visual insights.
        </p>

        {/* Upload Drop‑zone / Click‑zone */}
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
            <p className="text-xs text-gray-500">Supported formats: .xls, .xlsx</p>
          </label>
        </div>

        {/* ===============  Preview  =============== */}
        {excelData.length > 0 && (
          <>
            <div className="text-green-600 font-medium mb-3">✅ File parsed successfully</div>

            <div className="overflow-x-auto mb-6 border rounded-lg bg-white dark:bg-slate-800">
              <table className="table-auto w-full text-sm">
                <thead className="bg-gray-100 dark:bg-slate-700">
                  <tr>
                    {Object.keys(excelData[0]).map(k => (
                      <th key={k} className="px-4 py-2 border">{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {excelData.map((row,i)=>(
                    <tr key={i}>
                      {Object.values(row).map((val,j)=>(
                        <td key={j} className="px-4 py-2 border">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ===============  Analyze button  =============== */}
            {numericCols.length > 0 ? (
              <button
                onClick={() => setShowCharts(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition mb-8"
              >
                📊 Analyze Data
              </button>
            ) : (
              <p className="text-sm text-red-500 mb-8">
                No numeric columns found – charts can’t be generated.
              </p>
            )}
          </>
        )}

        {/* ===============  Chart Configurator  =============== */}
        {showCharts && <ChartConfigurator data={excelData} />}
      </main>
    </div>
  );
};

export default UploadPage;
