#pragma once

struct Process {
    int pid;
    int arrival_time;
    int burst_time;

    int completion_time = 0;
    int waiting_time = 0;
    int turnaround_time = 0;
};