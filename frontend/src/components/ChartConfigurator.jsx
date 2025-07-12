// src/components/ChartConfigurator.jsx (Three.js version)
import { useState, useRef } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  Cell, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import domtoimage from "dom-to-image-more";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { toast } from "react-hot-toast";

// Three‑js imports
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const COLORS = ["#845ef7", "#5c7cfa", "#7950f2", "#9775fa", "#7048e8"];

/* ──────────────────────────────────────────────────────────────── */
/*  3‑D chart helpers                                              */
/* ──────────────────────────────────────────────────────────────── */
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

/* ──────────────────────────────────────────────────────────────── */
/*  Main configurator component                                    */
/* ──────────────────────────────────────────────────────────────── */
export default function ChartConfigurator({ data }) {
  const headers = Object.keys(data[0] || {});
  const numericCols = headers.filter((h) => typeof data[0][h] === "number");

  const [xKey, setXKey] = useState(headers[0]);
  const [yKey, setYKey] = useState(numericCols[0] || headers[0]);
  const [tab, setTab] = useState("Bar");

  const svgWrapRef = useRef(null); // Recharts wrapper ref
  const threeWrapRef = useRef(null); // Three.js canvas wrapper

  /* ───────────────  Download handler  ─────────────── */
  const downloadPNG = async () => {
    try {
      /* 3‑D (Three.js) path */
      if (tab.startsWith("3D")) {
        const canvas = threeWrapRef.current?.querySelector("canvas");
        if (!canvas) throw new Error("canvas missing");
        canvas.toBlob((blob) => {
          if (blob) saveAs(blob, `${yKey}_by_${xKey}.png`);
        });
        toast.success("Chart saved!");
        return;
      }

      /* 2‑D SVG path */
      const svg = svgWrapRef.current?.querySelector("svg");
      if (!svg) throw new Error("SVG missing");
      const blob = await domtoimage.toBlob(svg, { bgcolor: "#ffffff" });
      saveAs(blob, `${yKey}_by_${xKey}.png`);
      toast.success("Chart saved!");
    } catch (err) {
      /* fallback */
      try {
        const target = tab.startsWith("3D") ? threeWrapRef.current : svgWrapRef.current;
        const canvas = await html2canvas(target);
        canvas.toBlob((blob) => blob && saveAs(blob, `${yKey}_by_${xKey}.png`));
        toast.success("Chart saved!");
      } catch (e) {
        console.error(e);
        toast.error("Download failed ❌");
      }
    }
  };

  /* ───────────────  Tab button  ─────────────── */
  const tabBtn = (name) => (
    <button
      key={name}
      onClick={() => setTab(name)}
      className={`px-4 py-2 rounded-t-md text-sm font-medium ${tab === name ? "bg-violet-600 text-white" : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300"}`}
    >
      {name}
    </button>
  );

  /* ───────────────  Recharts (2‑D)  ─────────────── */
  const render2D = () => {
    if (tab === "Bar")
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
    if (tab === "Line")
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
    if (tab === "Pie" || tab === "Donut")
      return (
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              dataKey={yKey}
              nameKey={xKey}
              innerRadius={tab === "Donut" ? 60 : 0}
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
  };

  /* ───────────────  Three.js (true 3‑D)  ─────────────── */
  const render3D = () => {
    if (tab === "3D Column")
      return <ThreeBarChart data={data} xKey={xKey} yKey={yKey} />;
    if (tab === "3D Donut")
      return <ThreeDonutChart data={data} xKey={xKey} yKey={yKey} />;
  };

  /* ─────────────────────  UI  ───────────────────── */
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 space-y-6">
      <h3 className="text-xl font-bold">Chart Configuration</h3>

      {/* Axis selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">X‑Axis</label>
          <select value={xKey} onChange={(e) => setXKey(e.target.value)} className="w-full border px-3 py-2 rounded dark:bg-slate-700">
            {headers.map((h) => (
              <option key={h}>{h}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Y‑Axis</label>
          <select value={yKey} onChange={(e) => setYKey(e.target.value)} className="w-full border px-3 py-2 rounded dark:bg-slate-700">
            {numericCols.map((h) => (
              <option key={h}>{h}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs + download */}
      <div className="flex flex-wrap gap-1 mt-6">
        {["Bar", "Line", "Pie", "Donut", "3D Column", "3D Donut"].map(tabBtn)}
        <button onClick={downloadPNG} className="ml-auto px-3 py-1 bg-violet-600 text-white rounded text-sm">
          ⬇ Download PNG
        </button>
      </div>

      {/* Chart output */}
      {tab.startsWith("3D") ? (
        <div ref={threeWrapRef} className="h-[400px] mt-6">{render3D()}</div>
      ) : (
        <div ref={svgWrapRef} className="mt-6">{render2D()}</div>
      )}
    </div>
  );
}
