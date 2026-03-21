#include <iostream>
#include <vector>
#include <string>
#include "include/process.h"
#include "include/utils.h"
#include "algorithms/fcfs.h"
#include "algorithms/sjf.h"
#include "algorithms/srtf.h"
#include "algorithms/round_robin.h"
#include "algorithms/priority.h"

// ── Sample process set (replace with file input later) ────────────────────────
std::vector<Process> get_sample_processes() {
    return {
        {1, 0, 6, 6, 2, -1, -1, 0, 0, false, false},
        {2, 1, 4, 4, 1, -1, -1, 0, 0, false, false},
        {3, 2, 2, 2, 3, -1, -1, 0, 0, false, false},
        {4, 3, 5, 5, 2, -1, -1, 0, 0, false, false},
        {5, 4, 3, 3, 1, -1, -1, 0, 0, false, false},
    };
}

void print_usage() {
    std::cout << "\nCPU Scheduling Simulator\n";
    std::cout << "Usage: scheduler <algorithm> [quantum]\n\n";
    std::cout << "Algorithms:\n";
    std::cout << "  fcfs        First Come First Serve\n";
    std::cout << "  sjf         Shortest Job First (non-preemptive)\n";
    std::cout << "  srtf        Shortest Remaining Time First (preemptive)\n";
    std::cout << "  rr          Round Robin (default quantum=2)\n";
    std::cout << "  priority    Priority Scheduling (non-preemptive)\n";
    std::cout << "  all         Run all algorithms and compare\n\n";
}

void run_and_print(const std::string& name, SchedulerResult& result) {
    std::cout << "\n" << std::string(60, '=') << "\n";
    std::cout << "  ALGORITHM: " << name << "\n";
    std::cout << std::string(60, '=') << "\n";
    print_gantt(result);
    print_metrics(result);
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        print_usage();
        return 1;
    }

    std::string algo = argv[1];
    int quantum = (argc >= 3) ? std::stoi(argv[2]) : 2;

    auto processes = get_sample_processes();

    if (algo == "fcfs") {
        auto result = run_fcfs(processes);
        run_and_print("FCFS", result);
    } else if (algo == "sjf") {
        auto result = run_sjf(processes);
        run_and_print("SJF (Non-Preemptive)", result);
    } else if (algo == "srtf") {
        auto result = run_srtf(processes);
        run_and_print("SRTF (Preemptive)", result);
    } else if (algo == "rr") {
        auto result = run_round_robin(processes, quantum);
        run_and_print("Round Robin (Q=" + std::to_string(quantum) + ")", result);
    } else if (algo == "priority") {
        auto result = run_priority(processes);
        run_and_print("Priority (Non-Preemptive)", result);
    } else if (algo == "all") {
        auto r1 = run_fcfs(processes);          run_and_print("FCFS", r1);
        auto r2 = run_sjf(processes);           run_and_print("SJF", r2);
        auto r3 = run_srtf(processes);          run_and_print("SRTF", r3);
        auto r4 = run_round_robin(processes, quantum); run_and_print("Round Robin", r4);
        auto r5 = run_priority(processes);      run_and_print("Priority", r5);

        // Comparison summary
        std::cout << "\n" << std::string(60, '=') << "\n";
        std::cout << "  COMPARISON SUMMARY\n";
        std::cout << std::string(60, '=') << "\n";
        std::cout << std::left
                  << std::setw(20) << "Algorithm"
                  << std::setw(15) << "Avg Wait"
                  << std::setw(18) << "Avg Turnaround"
                  << std::setw(15) << "CPU Util%\n";
        std::cout << std::string(60, '-') << "\n";

        auto print_row = [](const std::string& name, const SchedulerResult& r) {
            std::cout << std::left << std::fixed << std::setprecision(2)
                      << std::setw(20) << name
                      << std::setw(15) << r.avg_waiting_time
                      << std::setw(18) << r.avg_turnaround_time
                      << std::setw(15) << r.cpu_utilization << "\n";
        };

        print_row("FCFS",         r1);
        print_row("SJF",          r2);
        print_row("SRTF",         r3);
        print_row("Round Robin",  r4);
        print_row("Priority",     r5);
    } else {
        std::cout << "Unknown algorithm: " << algo << "\n";
        print_usage();
        return 1;
    }

    return 0;
}
