#pragma once
#include <vector>
#include <iostream>
#include "process.h"

struct GanttEntry {
    int pid;
    int start;
    int end;
};

struct SchedulerResult {
    std::vector<Process> processes;
    std::vector<GanttEntry> gantt;

    double avg_waiting_time = 0;
    double avg_turnaround_time = 0;
};

inline void compute_metrics(SchedulerResult &res) {
    double wt = 0, tat = 0;

    for (auto &p : res.processes) {
        p.turnaround_time = p.completion_time - p.arrival_time;
        p.waiting_time = p.turnaround_time - p.burst_time;

        wt += p.waiting_time;
        tat += p.turnaround_time;
    }

    int n = res.processes.size();
    res.avg_waiting_time = wt / n;
    res.avg_turnaround_time = tat / n;
}

inline void print_result(const SchedulerResult &res) {
    std::cout << "\nPID AT BT CT WT TAT\n";
    for (auto &p : res.processes) {
        std::cout << p.pid << "   "
                  << p.arrival_time << "   "
                  << p.burst_time << "   "
                  << p.completion_time << "   "
                  << p.waiting_time << "   "
                  << p.turnaround_time << "\n";
    }

    std::cout << "\nAvg WT: " << res.avg_waiting_time;
    std::cout << "\nAvg TAT: " << res.avg_turnaround_time << "\n";

    std::cout << "\nGantt:\n";
    for (auto &g : res.gantt) {
        std::cout << "[P" << g.pid << ": " << g.start << "-" << g.end << "] ";
    }
    std::cout << "\n";
}