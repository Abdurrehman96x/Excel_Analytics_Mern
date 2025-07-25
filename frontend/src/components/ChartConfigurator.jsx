import { useState, useRef } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  Cell, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import domtoimage from "dom-to-image-more";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import axios from "axios";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const COLORS = ["#845ef7", "#5c7cfa", "#7950f2", "#9775fa", "#7048e8"];

// --- 3D Bar Chart ---
const ThreeBarChart = ({ data, xKey, yKey }) => {
  const gap = 1.2;
  const barW = 0.8;
  return (
    <Canvas orthographic camera={{ zoom: 60, position: [0, 10, 20] }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 5]} intensity={0.6} />
      <OrbitControls makeDefault />
      {data.map((d, i) => (
        <mesh key={i} position={[i * gap, d[yKey] / 2, 0]} scale={[barW, d[yKey], barW]}>
          <boxGeometry />
          <meshStandardMaterial color={COLORS[i % COLORS.length]} />
        </mesh>
      ))}
    </Canvas>
  );
};

// --- 3D Donut Chart ---
const ThreeDonutChart = ({ data, xKey, yKey }) => {
  const total = data.reduce((s, d) => s + d[yKey], 0);
  let start = 0;
  return (
    <Canvas orthographic camera={{ zoom: 80, position: [0, 0, 10] }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <OrbitControls makeDefault />
      {data.map((d, i) => {
        const ratio = d[yKey] / total;
        const angle = ratio * Math.PI * 2;
        const mid = start + angle / 2;
        const color = `hsl(${(i * 60) % 360},70%,60%)`;
        const element = (
          <mesh key={i} rotation={[Math.PI / 2, 0, mid]}>
            <torusGeometry args={[4, 1, 16, 50, angle]} />
            <meshStandardMaterial color={color} />
          </mesh>
        );
        start += angle;
        return element;
      })}
    </Canvas>
  );
};

export default function ChartConfigurator({ data }) {
  const headers = data.length ? Object.keys(data[0]) : [];
  const numericCols = headers.filter((h) => typeof data[0]?.[h] === "number");

  const [xKey, setXKey] = useState("");
  const [yKey, setYKey] = useState("");
  const [chartType, setChartType] = useState("Bar");
  const [showChart, setShowChart] = useState(false);

  const svgWrapRef = useRef(null);
  const threeWrapRef = useRef(null);

  const handleGenerateChart = () => {
    if (!xKey || !yKey) {
      toast.error("Please select both X and Y axes!");
      return;
    }
    setShowChart(true);
  };

  const downloadPNG = async () => {
    try {
      const targetRef = chartType.startsWith("3D") ? threeWrapRef : svgWrapRef;
      const canvas = targetRef.current?.querySelector("canvas");
      const svg = targetRef.current?.querySelector("svg");

      if (canvas) {
        canvas.toBlob((blob) => blob && saveAs(blob, `${yKey}_by_${xKey}.png`));
        toast.success("Chart saved!");
      } else if (svg) {
        const blob = await domtoimage.toBlob(svg, { bgcolor: "#ffffff" });
        saveAs(blob, `${yKey}_by_${xKey}.png`);
        toast.success("Chart saved!");
      } else {
        throw new Error("Chart element missing.");
      }
    } catch (err) {
      try {
        const fallback = chartType.startsWith("3D") ? threeWrapRef.current : svgWrapRef.current;
        const canvas = await html2canvas(fallback);
        canvas.toBlob((blob) => blob && saveAs(blob, `${yKey}_by_${xKey}.png`));
        toast.success("Chart saved!");
      } catch (e) {
        console.error(e);
        toast.error("Download failed ❌");
      }
    }
  };

  const saveChartToDB = async () => {
    try {
      const token = localStorage.getItem("token");
      const fileName = localStorage.getItem("uploadedFileName") || "Untitled";

      // ✅ Only sending title, type, and data — required by backend
      await axios.post(
        "http://localhost:5000/api/charts/create",
        {
          title: fileName,
          type: chartType,
          data,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Chart saved to history!");
      localStorage.removeItem("uploadedFileName"); // optional cleanup
    } catch (error) {
      console.error(error);
      toast.error("Error saving chart to DB");
    }
  };

  const renderChart = () => {
    if (!showChart) return null;

    if (chartType === "Bar")
      return (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Bar dataKey={yKey} fill="#845ef7" />
          </BarChart>
        </ResponsiveContainer>
      );

    if (chartType === "Line")
      return (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Line dataKey={yKey} stroke="#5c7cfa" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      );

    if (chartType === "Pie" || chartType === "Donut")
      return (
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              dataKey={yKey}
              nameKey={xKey}
              innerRadius={chartType === "Donut" ? 60 : 0}
              outerRadius={110}
              label
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );

    if (chartType === "3D Column")
      return <ThreeBarChart data={data} xKey={xKey} yKey={yKey} />;

    if (chartType === "3D Donut")
      return <ThreeDonutChart data={data} xKey={xKey} yKey={yKey} />;
  };

  if (!headers.length) {
    return <div className="text-red-600">No data available to generate chart.</div>;
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 space-y-6">
      <h3 className="text-xl font-bold mb-4">📊 Generate Chart</h3>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1">X Axis</label>
          <select
            value={xKey}
            onChange={(e) => setXKey(e.target.value)}
            className="w-full border px-3 py-2 rounded dark:bg-slate-700"
          >
            <option value="">Select X</option>
            {headers.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Y Axis</label>
          <select
            value={yKey}
            onChange={(e) => setYKey(e.target.value)}
            className="w-full border px-3 py-2 rounded dark:bg-slate-700"
          >
            <option value="">Select Y</option>
            {numericCols.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Chart Type</label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="w-full border px-3 py-2 rounded dark:bg-slate-700"
          >
            {["Bar", "Line", "Pie", "Donut", "3D Column", "3D Donut"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Generate Button */}
      <div className="mt-4">
        <button
          onClick={handleGenerateChart}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded shadow"
        >
          Generate Chart
        </button>
      </div>

      {/* Chart Display and Actions */}
      {showChart && (
        <>
          <div className="flex gap-4 mt-4">
            <button onClick={downloadPNG} className="px-4 py-2 bg-green-600 text-white rounded">
              ⬇ Download PNG
            </button>
            <button onClick={saveChartToDB} className="px-4 py-2 bg-violet-600 text-white rounded">
              📊 Save Chart History
            </button>
          </div>

          <div className="mt-6 h-[400px]" ref={chartType.startsWith("3D") ? threeWrapRef : svgWrapRef}>
            {renderChart()}
          </div>
        </>
      )}
    </div>
  );
}
