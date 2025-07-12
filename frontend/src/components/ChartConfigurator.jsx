// src/components/ChartConfigurator.jsx
import { useState, useRef } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  Cell, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import domtoimage from "dom-to-image-more";
import { saveAs } from "file-saver";
import Plot from "react-plotly.js";
import Plotly from "plotly.js-dist-min";

const COLORS = ["#845ef7", "#5c7cfa", "#7950f2", "#9775fa", "#7048e8"];

export default function ChartConfigurator({ data }) {
  /* ─────────────────────────── state ────────────────────────── */
  const headers      = Object.keys(data[0] || {});
  const numericCols  = headers.filter(h => typeof data[0][h] === "number");
  const [xKey, setXKey] = useState(headers[0]);
  const [yKey, setYKey] = useState(numericCols[0] || headers[0]);
  const [tab,  setTab]  = useState("Bar");

  /* ───────────────  ref for download target  ──────────────── */
  const chartRef = useRef(null);

  /* ──────────────────  Download handler  ──────────────────── */
  const downloadPNG = async () => {
    /* ——— Plotly 3‑D path ——— */
    if (tab === "3D Column" || tab === "3D Donut") {
      const plotNode = chartRef.current?.querySelector(".js-plotly-plot");
      if (!plotNode) return;
      Plotly.downloadImage(plotNode, {
        format: "png",
        filename: `${yKey}_by_${xKey}`,
        width: 900,
        height: 600,
      });
      return;
    }
    /* ——— Recharts SVG path ——— */
    const svgNode = chartRef.current?.querySelector("svg");
    if (!svgNode) return;
    const blob = await domtoimage.toBlob(svgNode, { bgcolor: "white" });
    saveAs(blob, `${yKey}_by_${xKey}.png`);
  };

  /* ──────────────────  Tab button helper  ─────────────────── */
  const tabBtn = (name) => (
    <button
      key={name}
      onClick={() => setTab(name)}
      className={`px-4 py-2 rounded-t-md text-sm font-medium
        ${tab===name
          ? "bg-violet-600 text-white"
          : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300"}`}
    >
      {name}
    </button>
  );

  /* ─────────────────────  2‑D charts  ─────────────────────── */
  const render2D = () => {
    if (tab==="Bar")
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
    if (tab==="Line")
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
    if (tab==="Pie" || tab==="Donut")
      return (
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              dataKey={yKey}
              nameKey={xKey}
              innerRadius={tab==="Donut" ? 60 : 0}
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

  /* ─────────────────────  3‑D charts  ─────────────────────── */
  const render3D = () => {
    if (tab==="3D Column")
      return (
        <Plot
          data={[{
            type: "bar",
            x: data.map(d => d[xKey]),
            y: data.map(d => d[yKey]),
            marker: { color: COLORS[0] },
          }]}
          layout={{
            height: 400,
            scene: { zaxis: { visible: false } },
            margin: { l: 20, r: 20, b: 20, t: 30 },
          }}
          style={{ width: "100%" }}
        />
      );
    if (tab==="3D Donut")
      return (
        <Plot
          data={[{
            type: "pie",
            labels: data.map(d => d[xKey]),
            values: data.map(d => d[yKey]),
            hole: 0.5,
          }]}
          layout={{ height: 400, margin: { t: 30, b: 20 } }}
          style={{ width: "100%" }}
        />
      );
  };

  /* ─────────────────────────── UI ─────────────────────────── */
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 space-y-6">
      <h3 className="text-xl font-bold">Chart Configuration</h3>

      {/* Axis selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">X‑Axis</label>
          <select
            value={xKey}
            onChange={e => setXKey(e.target.value)}
            className="w-full border px-3 py-2 rounded dark:bg-slate-700"
          >
            {headers.map(h => <option key={h}>{h}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Y‑Axis</label>
          <select
            value={yKey}
            onChange={e => setYKey(e.target.value)}
            className="w-full border px-3 py-2 rounded dark:bg-slate-700"
          >
            {numericCols.map(h => <option key={h}>{h}</option>)}
          </select>
        </div>
      </div>

      {/* Tabs + Download button */}
      <div className="flex flex-wrap gap-1 mt-6">
        {["Bar","Line","Pie","Donut","3D Column","3D Donut"].map(tabBtn)}
        <button
          onClick={downloadPNG}
          className="ml-auto px-3 py-1 bg-violet-600 text-white rounded text-sm"
        >
          ⬇ Download PNG
        </button>
      </div>

      {/* Chart output */}
      <div ref={chartRef} className="mt-6">
        {["Bar","Line","Pie","Donut"].includes(tab) ? render2D() : render3D()}
      </div>
    </div>
  );
}
