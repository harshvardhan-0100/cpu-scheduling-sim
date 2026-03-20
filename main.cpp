#include <iostream>
#include <queue>
#include <vector>

using namespace std;

struct Process
{
    int pid;            // process id
    int arrival_time;   // arrival time of process
    int burst_time;     // total time needed
    int remaining_time; // cpu time still needed
    bool finished;      // indicating process state
};

int main()
{
    queue<Process> ready_queue; // stores indices of processes

    // ready_queue.push({1, 0, 3, 3});
    // ready_queue.push({2, 3, 4, 4});
    // ready_queue.push({3, 7, 6, 6});
    // ready_queue.push({});
    /*
       this wasn't supposed to be here.
       we are pushing the processes into the ready queue manually
       instead, we have to make a conditional statement, explicitly stating that
       the process has to be pushed into the ready_queue conditionally
       the condition being -  if the process arrival time = current time;
                              push the process into the ready_queue;
    */

    vector<Process> all_processes = {
        {1, 0, 3, 3, false},
        {2, 3, 4, 4, false},
        {3, 7, 6, 6, false},
        {4, 10, 2, 2, false}};

    int current_time = 0;
    int finished_count = 0;
    bool cpu_idle = true;
    Process current;

    while (finished_count < all_processes.size())
    {
        // 1. Admitting newly arrived process
        for (int i = 0; i < all_processes.size(); i++)
        {
            if (all_processes[i].arrival_time == current_time &&
                all_processes[i].finished == false)
            {
                ready_queue.push(all_processes[i]);
                cout << "Time " << current_time
                     << ": Process P" << all_processes[i].pid
                     << " arrived\n";
            }
        }

        // 2. assign cpu if idle
        if (cpu_idle && !ready_queue.empty())
        {
            Process current = ready_queue.front();
            ready_queue.pop();
            cpu_idle = false;

            cout << "Time " << current_time
                 << ": Process P"
                 << current.pid
                 << " started execution\n";
        }

        // 3. execute running process (one unit)
        if (!cpu_idle) 
        {
            current.remaining_time--;

            cout << "Time " << current_time
                 << ": Process P" 
                 << current.pid
                 << " running\n";
                 
            
            // 4. check completion
            if (current.remaining_time == 0) 
            {
                current.finished = true;
                finished_count++;
                cpu_idle = true; 

                cout << "Time " << current_time + 1
                     << ": Process P"
                     << current.pid
                     << " finished\n";
            }
        }

        // 5. advance time
        current_time++;
    }

    cout << "All processes finished at time "
         << current_time << endl;

    return 0;
}
