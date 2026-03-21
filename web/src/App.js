/* eslint-disable no-loop-func */
import { useState, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from "recharts";

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

// ── Colour palette per PID ────────────────────────────────────────────────────
const PALETTE = [
  "#60a5fa","#34d399","#f472b6","#fb923c",
  "#a78bfa","#facc15","#38bdf8","#4ade80",
];
const pidColor = pid => PALETTE[(pid - 1) % PALETTE.length];

// ── Components ────────────────────────────────────────────────────────────────

function GanttChart({ gantt }) {
  if (!gantt.length) return null;
  const total = gantt[gantt.length - 1].end;
  return (
    <div style={{ overflowX: "auto", paddingBottom: 8 }}>
      <div style={{ display: "flex", minWidth: 480, height: 52, borderRadius: 8, overflow: "hidden", border: "1px solid #1e293b" }}>
        {gantt.map((g, i) => {
          const w = ((g.end - g.start) / total) * 100;
          return (
            <div key={i} title={`P${g.pid}: ${g.start}→${g.end}`}
              style={{
                width: `${w}%`, background: pidColor(g.pid),
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: "#0f172a",
                borderRight: i < gantt.length - 1 ? "1px solid rgba(0,0,0,0.15)" : "none",
                transition: "opacity 0.2s", cursor: "default",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = 0.75}
              onMouseLeave={e => e.currentTarget.style.opacity = 1}
            >
              {w > 4 ? `P${g.pid}` : ""}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#64748b", marginTop: 4 }}>
        {gantt.map((g, i) => (
          <span key={i} style={{ minWidth: 16, textAlign: "center" }}>{g.start}</span>
        ))}
        <span>{total}</span>
      </div>
    </div>
  );
}

function MetricsTable({ processes }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#0f172a" }}>
            {["PID","Arrival","Burst","Priority","Completion","Turnaround","Waiting"].map(h => (
              <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "#94a3b8", fontWeight: 600, fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {processes.map((p, i) => (
            <tr key={p.pid} style={{ background: i % 2 === 0 ? "#0f172a55" : "transparent", borderBottom: "1px solid #1e293b" }}>
              <td style={{ padding: "8px 12px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: pidColor(p.pid), display: "inline-block" }} />
                  <strong style={{ color: "#f1f5f9" }}>P{p.pid}</strong>
                </span>
              </td>
              {[p.arrival, p.burst, p.priority ?? "—", p.completion, p.turnaround, p.waiting].map((v, j) => (
                <td key={j} style={{ padding: "8px 12px", color: "#cbd5e1" }}>{v}</td>
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
    <div style={{ minHeight: "100vh", background: "#020817", color: "#e2e8f0", fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #1e293b", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", color: "#f8fafc" }}>
            <span style={{ color: "#38bdf8" }}>CPU</span> Scheduling Simulator
          </h1>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#475569" }}>Discrete-time OS simulation engine</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["single", "compare"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "7px 18px", borderRadius: 6, border: "1px solid",
              borderColor: tab === t ? "#38bdf8" : "#1e293b",
              background: tab === t ? "#0c2d48" : "transparent",
              color: tab === t ? "#38bdf8" : "#64748b",
              fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
              fontFamily: "inherit", letterSpacing: "0.04em",
            }}>{t === "single" ? "Single Run" : "Compare All"}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", minHeight: "calc(100vh - 73px)" }}>
        {/* Sidebar */}
        <div style={{ borderRight: "1px solid #1e293b", padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Algorithm selector */}
          <div>
            <label style={{ fontSize: 11, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>Algorithm</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 10 }}>
              {ALGOS.map(a => (
                <button key={a} onClick={() => setActiveAlgo(a)} style={{
                  padding: "9px 14px", borderRadius: 6, border: "1px solid",
                  borderColor: activeAlgo === a ? "#38bdf8" : "#1e293b",
                  background: activeAlgo === a ? "#0c2d48" : "transparent",
                  color: activeAlgo === a ? "#38bdf8" : "#94a3b8",
                  fontSize: 13, fontWeight: activeAlgo === a ? 700 : 400,
                  cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                  transition: "all 0.15s",
                }}>{a}</button>
              ))}
            </div>
          </div>

          {/* Quantum */}
          {activeAlgo === "Round Robin" && (
            <div>
              <label style={{ fontSize: 11, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>Time Quantum</label>
              <input type="number" min={1} max={10} value={quantum}
                onChange={e => setQuantum(Number(e.target.value))}
                style={{ width: "100%", marginTop: 8, padding: "8px 12px", background: "#0f172a", border: "1px solid #1e293b", borderRadius: 6, color: "#f1f5f9", fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }}
              />
            </div>
          )}

          {/* Processes */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <label style={{ fontSize: 11, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>Processes</label>
              <button onClick={addProcess} style={{
                padding: "4px 10px", borderRadius: 5, border: "1px solid #1e293b",
                background: "transparent", color: "#38bdf8", fontSize: 11,
                cursor: "pointer", fontFamily: "inherit", fontWeight: 700,
              }}>+ Add</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {processes.map((p, i) => (
                <div key={p.pid} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, padding: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: pidColor(p.pid) }}>P{p.pid}</span>
                    <button onClick={() => removeProcess(i)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 14, padding: 0 }}>×</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                    {[["arrival", "AT"], ["burst", "BT"], ["priority", "PR"]].map(([field, label]) => (
                      <div key={field}>
                        <div style={{ fontSize: 9, color: "#475569", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
                        <input type="number" min={0} value={p[field]}
                          onChange={e => updateProcess(i, field, e.target.value)}
                          style={{ width: "100%", padding: "5px 6px", background: "#020817", border: "1px solid #1e293b", borderRadius: 4, color: "#f1f5f9", fontSize: 12, fontFamily: "inherit", boxSizing: "border-box" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main panel */}
        <div style={{ padding: 32, overflowY: "auto" }}>
          {tab === "single" && result && (
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {[
                  { label: "Avg Waiting Time", value: result.avgWT.toFixed(2), unit: "units" },
                  { label: "Avg Turnaround", value: result.avgTAT.toFixed(2), unit: "units" },
                  { label: "Processes", value: processes.length, unit: "total" },
                ].map(s => (
                  <div key={s.label} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: "18px 20px" }}>
                    <div style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>{s.label}</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: "#f8fafc", marginTop: 6, letterSpacing: "-0.03em" }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{s.unit}</div>
                  </div>
                ))}
              </div>

              {/* Gantt */}
              <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: 20 }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 13, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Gantt Chart — {activeAlgo}</h3>
                <GanttChart gantt={result.gantt} />
              </div>

              {/* Table */}
              <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e293b" }}>
                  <h3 style={{ margin: 0, fontSize: 13, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Process Metrics</h3>
                </div>
                <MetricsTable processes={result.processes} />
              </div>
            </div>
          )}

          {tab === "compare" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: 24 }}>
                <h3 style={{ margin: "0 0 20px", fontSize: 13, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Algorithm Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={compareData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                    <Bar dataKey="Avg Wait" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Avg TAT" fill="#34d399" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Comparison table */}
              <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e293b" }}>
                  <h3 style={{ margin: 0, fontSize: 13, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Summary Table</h3>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#020817" }}>
                      {["Algorithm", "Avg Waiting Time", "Avg Turnaround"].map(h => (
                        <th key={h} style={{ padding: "10px 20px", textAlign: "left", color: "#475569", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ALGOS.map((a, i) => {
                      const r = runAlgo(a, processes, quantum);
                      const best = Math.min(...ALGOS.map(x => runAlgo(x, processes, quantum)?.avgWT ?? Infinity));
                      const isBest = r && Math.abs(r.avgWT - best) < 0.01;
                      return (
                        <tr key={a} style={{ borderBottom: "1px solid #1e293b", background: i % 2 === 0 ? "#0f172a44" : "transparent" }}>
                          <td style={{ padding: "11px 20px", fontWeight: 600, color: isBest ? "#34d399" : "#cbd5e1" }}>
                            {a} {isBest && <span style={{ fontSize: 10, background: "#064e3b", color: "#34d399", padding: "2px 6px", borderRadius: 4, marginLeft: 6 }}>BEST</span>}
                          </td>
                          <td style={{ padding: "11px 20px", color: "#94a3b8" }}>{r ? r.avgWT.toFixed(2) : "—"}</td>
                          <td style={{ padding: "11px 20px", color: "#94a3b8" }}>{r ? r.avgTAT.toFixed(2) : "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* All Gantt charts */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <h3 style={{ margin: 0, fontSize: 13, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>All Gantt Charts</h3>
                {ALGOS.map(a => {
                  const r = runAlgo(a, processes, quantum);
                  return (
                    <div key={a} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>{a}</div>
                      {r && <GanttChart gantt={r.gantt} />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
