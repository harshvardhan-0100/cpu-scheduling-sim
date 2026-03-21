#pragma once
#include <vector>
#include <queue>
#include <algorithm>
#include "../include/process.h"
#include "../include/utils.h"

inline SchedulerResult run_round_robin(std::vector<Process> processes, int quantum = 2) {
    SchedulerResult result;
    int current_time   = 0;
    int finished_count = 0;
    int n              = processes.size();
    int quantum_left   = quantum;
    int running_idx    = -1;

    std::queue<int> ready_queue;
    std::vector<bool> in_queue(n, false);

    // Admit processes arriving at time 0
    for (int i = 0; i < n; i++) {
        if (processes[i].arrival_time == 0) {
            ready_queue.push(i);
            in_queue[i] = true;
        }
    }

    while (finished_count < n) {
        // Admit newly arrived processes (except time 0, done above)
        for (int i = 0; i < n; i++) {
            if (!in_queue[i] && !processes[i].finished &&
                processes[i].arrival_time == current_time) {
                ready_queue.push(i);
                in_queue[i] = true;
            }
        }

        // Pick from queue if CPU idle
        if (running_idx == -1 && !ready_queue.empty()) {
            running_idx  = ready_queue.front();
            ready_queue.pop();
            quantum_left = quantum;

            if (!processes[running_idx].started) {
                processes[running_idx].start_time = current_time;
                processes[running_idx].started    = true;
            }
        }

        if (running_idx != -1) {
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
            quantum_left--;
            current_time++;

            // Admit any new arrivals before deciding preemption
            for (int i = 0; i < n; i++) {
                if (!in_queue[i] && !processes[i].finished &&
                    processes[i].arrival_time == current_time) {
                    ready_queue.push(i);
                    in_queue[i] = true;
                }
            }

            if (p.remaining_time == 0) {
                p.completion_time = current_time;
                p.finished        = true;
                finished_count++;
                running_idx  = -1;
                quantum_left = quantum;
            } else if (quantum_left == 0) {
                // Quantum expired — preempt, push back
                ready_queue.push(running_idx);
                running_idx  = -1;
                quantum_left = quantum;
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
