#pragma once
#include <vector>
#include <string>
#include <numeric>
#include <iostream>
#include <iomanip>
#include "process.h"

// ── Metrics ──────────────────────────────────────────────────────────────────

inline void compute_metrics(SchedulerResult& result) {
    double total_waiting = 0, total_turnaround = 0;

    for (auto& p : result.processes) {
        p.turnaround_time = p.completion_time - p.arrival_time;
        p.waiting_time    = p.turnaround_time - p.burst_time;
        total_waiting    += p.waiting_time;
        total_turnaround += p.turnaround_time;
    }

    int n = result.processes.size();
    result.avg_waiting_time    = total_waiting    / n;
    result.avg_turnaround_time = total_turnaround / n;

    // CPU utilization: time spent on real processes / total time
    int busy = 0;
    for (auto& g : result.gantt)
        if (g.pid != -1) busy += (g.end_time - g.start_time);
    result.cpu_utilization = result.total_time > 0
        ? (double)busy / result.total_time * 100.0 : 0;
}

// ── Text Gantt chart ──────────────────────────────────────────────────────────

inline void print_gantt(const SchedulerResult& result) {
    std::cout << "\nGANTT CHART\n";
    std::cout << std::string(60, '-') << "\n";
    for (auto& g : result.gantt) {
        if (g.pid == -1)
            std::cout << std::setw(4) << "CS/IDLE";
        else
            std::cout << std::setw(4) << ("P" + std::to_string(g.pid));
        std::cout << "  [" << std::setw(3) << g.start_time
                  << " -> " << std::setw(3) << g.end_time << "]\n";
    }
}

// ── Process metrics table ─────────────────────────────────────────────────────

inline void print_metrics(const SchedulerResult& result) {
    std::cout << "\nPROCESS METRICS\n";
    std::cout << std::string(70, '-') << "\n";
    std::cout << std::left
              << std::setw(6)  << "PID"
              << std::setw(10) << "Arrival"
              << std::setw(10) << "Burst"
              << std::setw(12) << "Completion"
              << std::setw(12) << "Turnaround"
              << std::setw(10) << "Waiting"
              << "\n";
    std::cout << std::string(70, '-') << "\n";

    for (auto& p : result.processes) {
        std::cout << std::left
                  << std::setw(6)  << ("P" + std::to_string(p.pid))
                  << std::setw(10) << p.arrival_time
                  << std::setw(10) << p.burst_time
                  << std::setw(12) << p.completion_time
                  << std::setw(12) << p.turnaround_time
                  << std::setw(10) << p.waiting_time
                  << "\n";
    }

    std::cout << "\nAverage Waiting Time    : "
              << std::fixed << std::setprecision(2)
              << result.avg_waiting_time << "\n";
    std::cout << "Average Turnaround Time : "
              << result.avg_turnaround_time << "\n";
    std::cout << "CPU Utilization         : "
              << result.cpu_utilization << "%\n";
}

// ── JSON output ───────────────────────────────────────────────────────────────

inline std::string to_json(const SchedulerResult& result, const std::string& algo) {
    std::string out = "{\n";
    out += "  \"algorithm\": \"" + algo + "\",\n";
    out += "  \"total_time\": " + std::to_string(result.total_time) + ",\n";
    out += "  \"avg_waiting_time\": " + std::to_string(result.avg_waiting_time) + ",\n";
    out += "  \"avg_turnaround_time\": " + std::to_string(result.avg_turnaround_time) + ",\n";
    out += "  \"cpu_utilization\": " + std::to_string(result.cpu_utilization) + ",\n";

    // Gantt
    out += "  \"gantt\": [\n";
    for (size_t i = 0; i < result.gantt.size(); i++) {
        auto& g = result.gantt[i];
        out += "    {\"pid\": " + std::to_string(g.pid) +
               ", \"start\": " + std::to_string(g.start_time) +
               ", \"end\": "   + std::to_string(g.end_time) + "}";
        if (i + 1 < result.gantt.size()) out += ",";
        out += "\n";
    }
    out += "  ],\n";

    // Processes
    out += "  \"processes\": [\n";
    for (size_t i = 0; i < result.processes.size(); i++) {
        auto& p = result.processes[i];
        out += "    {\"pid\": " + std::to_string(p.pid) +
               ", \"arrival\": "     + std::to_string(p.arrival_time) +
               ", \"burst\": "       + std::to_string(p.burst_time) +
               ", \"completion\": "  + std::to_string(p.completion_time) +
               ", \"turnaround\": "  + std::to_string(p.turnaround_time) +
               ", \"waiting\": "     + std::to_string(p.waiting_time) + "}";
        if (i + 1 < result.processes.size()) out += ",";
        out += "\n";
    }
    out += "  ]\n}\n";
    return out;
}
