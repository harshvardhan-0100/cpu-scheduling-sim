/* eslint-disable no-loop-func */
import { useState, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from "recharts";
import "./App.css";

// ── Scheduling Algorithms ────────────────────────────────────────────────────

function fcfs(procs) {
  const processes = procs.map(p => ({ ...p, remaining: p.burst }));
  processes.sort((a, b) => a.arrival - b.arrival);
  const gantt = [];
  let t = 0;
  for (const p of processes) {
    if (t < p.arrival) t = p.arrival;
    gantt.push({ pid: p.pid, start: t, end: t + p.burst });
    p.completion = t + p.burst;
    t += p.burst;
  }
  return finalize(processes, gantt);
}

function sjf(procs) {
  const processes = procs.map(p => ({ ...p, remaining: p.burst, done: false }));
  const gantt = [];
  let t = 0, completed = 0;
  while (completed < processes.length) {
    const available = processes.filter(p => !p.done && p.arrival <= t);
    if (!available.length) { t++; continue; }
    available.sort((a, b) => a.burst - b.burst);
    const p = available[0];
    gantt.push({ pid: p.pid, start: t, end: t + p.burst });
    t += p.burst;
    p.completion = t;
    p.done = true;
    completed++;
  }
  return finalize(processes, gantt);
}

function srtf(procs) {
  const processes = procs.map(p => ({ ...p, remaining: p.burst, done: false, completion: 0 }));
  const gantt = [];
  let t = 0, completed = 0;
  while (completed < processes.length) {
    const available = processes.filter(p => !p.done && p.arrival <= t);
    if (!available.length) { t++; continue; }
    available.sort((a, b) => a.remaining - b.remaining);
    const p = available[0];
    const last = gantt[gantt.length - 1];
    if (last && last.pid === p.pid && last.end === t) {
      last.end++;
    } else {
      gantt.push({ pid: p.pid, start: t, end: t + 1 });
    }
    p.remaining--;
    t++;
    if (p.remaining === 0) { p.completion = t; p.done = true; completed++; }
  }
  return finalize(processes, gantt);
}

function roundRobin(procs, quantum = 2) {
  const processes = procs.map(p => ({ ...p, remaining: p.burst, done: false, completion: 0, inQueue: false }));
  processes.sort((a, b) => a.arrival - b.arrival);
  const gantt = [];
  const queue = [];
  let t = 0, completed = 0;
  processes.filter(p => p.arrival === 0).forEach(p => { queue.push(p); p.inQueue = true; });
  while (completed < processes.length) {
    if (!queue.length) { t++; processes.filter(p => !p.done && !p.inQueue && p.arrival <= t).forEach(p => { queue.push(p); p.inQueue = true; }); continue; }
    const p = queue.shift();
    const run = Math.min(quantum, p.remaining);
    const last = gantt[gantt.length - 1];
    if (last && last.pid === p.pid && last.end === t) last.end += run;
    else gantt.push({ pid: p.pid, start: t, end: t + run });
    t += run;
    p.remaining -= run;
    processes.filter(q => !q.done && !q.inQueue && q.arrival <= t && q !== p).forEach(q => { queue.push(q); q.inQueue = true; });
    if (p.remaining === 0) { p.completion = t; p.done = true; completed++; }
    else queue.push(p);
  }
  return finalize(processes, gantt);
}

function priority(procs) {
  const processes = procs.map(p => ({ ...p, remaining: p.burst, done: false }));
  const gantt = [];
  let t = 0, completed = 0;
  while (completed < processes.length) {
    const available = processes.filter(p => !p.done && p.arrival <= t);
    if (!available.length) { t++; continue; }
    available.sort((a, b) => a.priority - b.priority);
    const p = available[0];
    gantt.push({ pid: p.pid, start: t, end: t + p.burst });
    t += p.burst;
    p.completion = t;
    p.done = true;
    completed++;
  }
  return finalize(processes, gantt);
}

function finalize(processes, gantt) {
  const result = processes.map(p => ({
    pid: p.pid, arrival: p.arrival, burst: p.burst,
    priority: p.priority,
    completion: p.completion,
    turnaround: p.completion - p.arrival,
    waiting: p.completion - p.arrival - p.burst,
  }));
  const n = result.length;
  const avgWT  = result.reduce((s, p) => s + p.waiting, 0) / n;
  const avgTAT = result.reduce((s, p) => s + p.turnaround, 0) / n;
  return { processes: result, gantt, avgWT, avgTAT };
}

// ── Colour palette per PID (Muted academic colors) ─────────────────────────────
const PALETTE = [
  "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728",
  "#9467bd", "#8c564b", "#e377c2", "#7f7f7f",
];
const pidColor = pid => PALETTE[(pid - 1) % PALETTE.length];

// ── Components ────────────────────────────────────────────────────────────────

function GanttChart({ gantt }) {
  if (!gantt.length) return null;
  const total = gantt[gantt.length - 1].end;
  
  // Generate time markers (0, 1, 2, 3...)
  const timeMarkers = Array.from({ length: total + 1 }, (_, i) => i);
  
  return (
    <div className="gantt-wrapper">
      {/* Legend */}
      <div className="gantt-legend">
        <div className="legend-title">Process ID</div>
        <div className="legend-items">
          {[...new Set(gantt.map(g => g.pid))].map(pid => (
            <div key={pid} className="legend-item">
              <span className="legend-color" style={{ background: pidColor(pid) }}></span>
              <span>P{pid}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Gantt Timeline */}
      <div className="gantt-container">
        {/* Time axis labels */}
        <div className="gantt-axis">
          <div className="gantt-axis-label">Time</div>
          <div className="gantt-axis-markers">
            {timeMarkers.map(t => (
              <div key={t} className="gantt-marker">{t}</div>
            ))}
          </div>
        </div>

        {/* Gantt bars */}
        <div className="gantt-bars">
          {gantt.map((g, i) => {
            const w = ((g.end - g.start) / total) * 100;
            return (
              <div
                key={i}
                className="gantt-block"
                style={{
                  width: `${w}%`,
                  background: pidColor(g.pid),
                }}
                title={`P${g.pid}: ${g.start}→${g.end}`}
              >
                {w > 8 && <span className="gantt-label">P{g.pid}</span>}
              </div>
            );
          })}
        </div>

        {/* Time scale */}
        <div className="gantt-scale">
          {timeMarkers.map(t => (
            <div key={t} className="gantt-scale-mark"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricsTable({ processes }) {
  return (
    <div className="metrics-table-wrapper">
      <table className="metrics-table">
        <thead>
          <tr>
            {["PID","Arrival","Burst","Priority","Completion","Turnaround","Waiting"].map(h => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {processes.map((p, i) => (
            <tr key={p.pid} className={i % 2 === 0 ? "row-even" : "row-odd"}>
              <td className="pid-cell">
                <span className="pid-color" style={{ background: pidColor(p.pid) }}></span>
                <strong>P{p.pid}</strong>
              </td>
              {[p.arrival, p.burst, p.priority ?? "—", p.completion, p.turnaround, p.waiting].map((v, j) => (
                <td key={j}>{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const ALGOS = ["FCFS", "SJF", "SRTF", "Round Robin", "Priority"];

function runAlgo(name, processes, quantum) {
  try {
    switch (name) {
      case "FCFS":        return fcfs(processes);
      case "SJF":         return sjf(processes);
      case "SRTF":        return srtf(processes);
      case "Round Robin": return roundRobin(processes, quantum);
      case "Priority":    return priority(processes);
      default:            return null;
    }
  } catch { return null; }
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [processes, setProcesses] = useState([
    { pid: 1, arrival: 0, burst: 6, priority: 2 },
    { pid: 2, arrival: 1, burst: 4, priority: 1 },
    { pid: 3, arrival: 2, burst: 2, priority: 3 },
    { pid: 4, arrival: 3, burst: 5, priority: 2 },
    { pid: 5, arrival: 4, burst: 3, priority: 1 },
  ]);
  const [activeAlgo, setActiveAlgo] = useState("FCFS");
  const [quantum, setQuantum] = useState(2);
  const [tab, setTab] = useState("single"); // "single" | "compare"

  const result = runAlgo(activeAlgo, processes, quantum);
  const compareData = ALGOS.map(a => {
    const r = runAlgo(a, processes, quantum);
    return { name: a, "Avg Wait": r ? +r.avgWT.toFixed(2) : 0, "Avg TAT": r ? +r.avgTAT.toFixed(2) : 0 };
  });

  const updateProcess = useCallback((idx, field, value) => {
    setProcesses(prev => prev.map((p, i) =>
      i === idx ? { ...p, [field]: Number(value) } : p
    ));
  }, []);

  const addProcess = () => {
    const pid = processes.length + 1;
    setProcesses(prev => [...prev, { pid, arrival: 0, burst: 4, priority: 2 }]);
  };

  const removeProcess = (idx) => {
    setProcesses(prev => prev.filter((_, i) => i !== idx).map((p, i) => ({ ...p, pid: i + 1 })));
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-title">
          <h1>CPU Scheduling Simulator</h1>
          <p className="header-subtitle">Discrete-time OS simulation engine</p>
        </div>
        <div className="header-tabs">
          {["single", "compare"].map(t => (
            <button 
              key={t}
              onClick={() => setTab(t)}
              className={`tab-button ${tab === t ? "active" : ""}`}
            >
              {t === "single" ? "Single Run" : "Compare All"}
            </button>
          ))}
        </div>
      </header>

      <div className="app-layout">
        {/* Sidebar - Input Panel */}
        <aside className="sidebar">
          {/* Algorithm selector */}
          <section className="sidebar-section">
            <h3 className="section-label">Algorithm</h3>
            <div className="algorithm-buttons">
              {ALGOS.map(a => (
                <button
                  key={a}
                  onClick={() => setActiveAlgo(a)}
                  className={`algo-button ${activeAlgo === a ? "active" : ""}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </section>

          {/* Quantum (Round Robin only) */}
          {activeAlgo === "Round Robin" && (
            <section className="sidebar-section">
              <h3 className="section-label">Time Quantum</h3>
              <input
                type="number"
                min={1}
                max={10}
                value={quantum}
                onChange={e => setQuantum(Number(e.target.value))}
                className="numeric-input"
              />
            </section>
          )}

          {/* Processes */}
          <section className="sidebar-section sidebar-main">
            <div className="section-header">
              <h3 className="section-label">Processes</h3>
              <button onClick={addProcess} className="add-button">+ Add</button>
            </div>
            <div className="process-list">
              {processes.map((p, i) => (
                <div key={p.pid} className="process-card">
                  <div className="process-header">
                    <span className="process-pid">P{p.pid}</span>
                    <button
                      onClick={() => removeProcess(i)}
                      className="remove-button"
                    >
                      ×
                    </button>
                  </div>
                  <div className="process-inputs">
                    {[["arrival", "AT"], ["burst", "BT"], ["priority", "PR"]].map(([field, label]) => (
                      <div key={field} className="input-field">
                        <label>{label}</label>
                        <input
                          type="number"
                          min={0}
                          value={p[field]}
                          onChange={e => updateProcess(i, field, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>

        {/* Main Panel - Output */}
        <main className="main-panel">
          {tab === "single" && result && (
            <div className="single-run-view">
              {/* Metrics Cards */}
              <section className="metrics-cards">
                {[
                  { label: "Avg Waiting Time", value: result.avgWT.toFixed(2), unit: "units" },
                  { label: "Avg Turnaround", value: result.avgTAT.toFixed(2), unit: "units" },
                  { label: "Processes", value: processes.length, unit: "total" },
                ].map(s => (
                  <div key={s.label} className="metric-card">
                    <div className="metric-label">{s.label}</div>
                    <div className="metric-value">{s.value}</div>
                    <div className="metric-unit">{s.unit}</div>
                  </div>
                ))}
              </section>

              {/* Gantt Chart */}
              <section className="content-section">
                <h2 className="section-title">Execution Timeline — {activeAlgo}</h2>
                <GanttChart gantt={result.gantt} />
              </section>

              {/* Process Metrics Table */}
              <section className="content-section">
                <h2 className="section-title">Process Metrics</h2>
                <MetricsTable processes={result.processes} />
              </section>
            </div>
          )}

          {tab === "compare" && (
            <div className="comparison-view">
              {/* Comparison Chart */}
              <section className="content-section">
                <h2 className="section-title">Algorithm Comparison</h2>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={compareData} margin={{ top: 16, right: 16, left: 0, bottom: 16 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#d0d0d0" />
                      <XAxis dataKey="name" tick={{ fill: "#555", fontSize: 11 }} axisLine={{ stroke: "#999" }} />
                      <YAxis tick={{ fill: "#555", fontSize: 11 }} axisLine={{ stroke: "#999" }} />
                      <Tooltip contentStyle={{ background: "#f9f9f9", border: "1px solid #ccc", borderRadius: 4, fontSize: 12 }} />
                      <Legend />
                      <Bar dataKey="Avg Wait" fill="#1f77b4" />
                      <Bar dataKey="Avg TAT" fill="#ff7f0e" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Comparison Summary Table */}
              <section className="content-section">
                <h2 className="section-title">Summary</h2>
                <div className="metrics-table-wrapper">
                  <table className="metrics-table">
                    <thead>
                      <tr>
                        {["Algorithm", "Avg Waiting Time", "Avg Turnaround"].map(h => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {ALGOS.map((a, i) => {
                        const r = runAlgo(a, processes, quantum);
                        const best = Math.min(...ALGOS.map(x => runAlgo(x, processes, quantum)?.avgWT ?? Infinity));
                        const isBest = r && Math.abs(r.avgWT - best) < 0.01;
                        return (
                          <tr key={a} className={i % 2 === 0 ? "row-even" : "row-odd"}>
                            <td className={isBest ? "best-algo" : ""}>
                              {a} {isBest && <span className="best-badge">● BEST</span>}
                            </td>
                            <td>{r ? r.avgWT.toFixed(2) : "—"}</td>
                            <td>{r ? r.avgTAT.toFixed(2) : "—"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* All Gantt Charts */}
              <section className="content-section">
                <h2 className="section-title">All Execution Timelines</h2>
                <div className="gantt-grid">
                  {ALGOS.map(a => {
                    const r = runAlgo(a, processes, quantum);
                    return (
                      <div key={a} className="gantt-item">
                        <h3 className="gantt-item-title">{a}</h3>
                        {r && <GanttChart gantt={r.gantt} />}
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
