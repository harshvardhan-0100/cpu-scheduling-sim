#pragma once
#include <vector>
#include <algorithm>
#include "../include/process.h"
#include "../include/utils.h"

inline SchedulerResult run_sjf(std::vector<Process> processes) {
    SchedulerResult result;
    int current_time   = 0;
    int finished_count = 0;
    int n              = processes.size();
    bool cpu_idle      = true;
    int  running_idx   = -1;

    while (finished_count < n) {
        // Assign CPU: pick shortest burst among arrived, unfinished processes
        if (cpu_idle) {
            int shortest = -1;
            for (int i = 0; i < n; i++) {
                if (!processes[i].finished &&
                    processes[i].arrival_time <= current_time) {
                    if (shortest == -1 ||
                        processes[i].burst_time < processes[shortest].burst_time) {
                        shortest = i;
                    }
                }
            }

            if (shortest != -1) {
                running_idx = shortest;
                cpu_idle    = false;
                if (!processes[running_idx].started) {
                    processes[running_idx].start_time = current_time;
                    processes[running_idx].started    = true;
                }
            }
        }

        if (!cpu_idle) {
            Process& p = processes[running_idx];

            // Log gantt
            if (result.gantt.empty() ||
                result.gantt.back().pid != p.pid ||
                result.gantt.back().end_time != current_time) {
                result.gantt.push_back({p.pid, current_time, current_time + 1});
            } else {
                result.gantt.back().end_time++;
            }

            p.remaining_time--;
            current_time++;

            if (p.remaining_time == 0) {
                p.completion_time = current_time;
                p.finished        = true;
                finished_count++;
                cpu_idle    = true;
                running_idx = -1;
            }
        } else {
            // CPU idle
            result.gantt.push_back({-1, current_time, current_time + 1});
            current_time++;
        }
    }

    result.total_time = current_time;
    result.processes  = processes;
    compute_metrics(result);
    return result;
}
