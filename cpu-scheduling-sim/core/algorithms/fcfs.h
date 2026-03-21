#pragma once
#include <vector>
#include <algorithm>
#include "../include/process.h"
#include "../include/utils.h"

inline SchedulerResult run_fcfs(std::vector<Process> processes) {
    // Sort by arrival time
    std::sort(processes.begin(), processes.end(),
              [](const Process& a, const Process& b) {
                  return a.arrival_time < b.arrival_time;
              });

    SchedulerResult result;
    int current_time   = 0;
    int finished_count = 0;
    int n              = processes.size();
    bool cpu_idle      = true;
    int  running_idx   = -1;

    while (finished_count < n) {
        // Admit arrivals
        // (In FCFS sorted order, just find next unfinished)

        // Assign CPU if idle
        if (cpu_idle) {
            for (int i = 0; i < n; i++) {
                if (!processes[i].finished &&
                    processes[i].arrival_time <= current_time) {
                    running_idx = i;
                    cpu_idle    = false;
                    if (!processes[i].started) {
                        processes[i].start_time = current_time;
                        processes[i].started    = true;
                    }
                    break;
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
            // CPU idle — advance time
            result.gantt.push_back({-1, current_time, current_time + 1});
            current_time++;
        }
    }

    result.total_time = current_time;
    result.processes  = processes;
    compute_metrics(result);
    return result;
}
