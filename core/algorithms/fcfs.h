#pragma once
#include <vector>
#include <algorithm>
#include "../include/utils.h"

inline SchedulerResult run_fcfs(std::vector<Process> processes) {
    SchedulerResult res;

    std::sort(processes.begin(), processes.end(), [](auto &a, auto &b) {
        return a.arrival_time < b.arrival_time;
    });

    int current_time = 0;

    for (auto &p : processes) {
        if (current_time < p.arrival_time)
            current_time = p.arrival_time;

        int start = current_time;
        current_time += p.burst_time;

        p.completion_time = current_time;

        res.gantt.push_back({p.pid, start, current_time});
    }

    res.processes = processes;
    compute_metrics(res);

    return res;
}