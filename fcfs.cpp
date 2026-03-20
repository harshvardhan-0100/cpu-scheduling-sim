#include <iostream>
#include <queue>
#include <vector>

using namespace std;

struct Process
{
    int pid;
    int arrival_time;
    int burst_time;
    int remaining_time;
    bool finished;
};

int main()
{
    // All processes defined upfront
    vector<Process> all_processes = {
        {1, 0, 3, 3, false},
        {2, 3, 4, 4, false},
        {3, 7, 6, 6, false},
        {4, 10, 2, 2, false}
    };

    queue<int> ready_queue;   // store indices of processes
    int current_time = 0;

    int finished_count = 0;
    int total_processes = all_processes.size();

    // CPU state
    bool cpu_idle = true;
    int current_process_index = -1;

    // Main time-driven simulation loop
    while (finished_count < total_processes)
    {
        // 1. Admit newly arrived processes
        for (int i = 0; i < total_processes; i++)
        {
            if (all_processes[i].arrival_time == current_time &&
                !all_processes[i].finished)
            {
                ready_queue.push(i);
                cout << "Time " << current_time
                     << ": Process P" << all_processes[i].pid
                     << " arrived (added to ready_queue)\n";
            }   
        }

        // 2. Assign CPU if idle
        if (cpu_idle && !ready_queue.empty())
        {
            current_process_index = ready_queue.front();
            ready_queue.pop();
            cpu_idle = false;

            cout << "Time " << current_time
                 << ": Process P"
                 << all_processes[current_process_index].pid
                 << " started execution\n";
        }

        // 3. Execute running process (one unit)
        if (!cpu_idle)
        {
            all_processes[current_process_index].remaining_time--;

            cout << "Time " << current_time
                 << ": Process P"
                 << all_processes[current_process_index].pid
                 << " running\n";

            // 4. Check completion
            if (all_processes[current_process_index].remaining_time == 0)
            {
                all_processes[current_process_index].finished = true;
                finished_count++;
                cpu_idle = true;

                cout << "Time " << current_time + 1
                     << ": Process P"
                     << all_processes[current_process_index].pid
                     << " finished\n";
            }
        }

        // 5. Advance time
        current_time++;
    }

    cout << "\nAll processes finished at time "
         << current_time << endl;

    return 0;
}
