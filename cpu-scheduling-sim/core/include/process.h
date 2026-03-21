#pragma once
#include <string>

struct Process {
    int pid;
    int arrival_time;
    int burst_time;
    int remaining_time;
    int priority;        // used for Priority Scheduling (lower = higher priority)
    int start_time;
    int completion_time;
    int waiting_time;
    int turnaround_time;
    bool finished;
    bool started;
};

struct GanttEntry {
    int pid;             // -1 = context switch / idle
    int start_time;
    int end_time;
};

struct SchedulerResult {
    std::vector<GanttEntry> gantt;
    std::vector<Process>    processes;
    double avg_waiting_time;
    double avg_turnaround_time;
    double cpu_utilization;
    int    total_time;
};
