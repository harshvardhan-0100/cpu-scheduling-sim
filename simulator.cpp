#include <iostream>
#include <vector>
#include <queue> 

using namespace std;

struct Process {
    int pid;
    int arrival_time;
    int burst_time;
    int remaining_time;
    bool finished;
};

int main() {
    vector<Process> all_processes = 
        {{1, 1, 3, 3, false},
         {2, 2, 4, 4, false},
         {3, 6, 5, 5, false}, 
         {4, 8, 4, 4, false},
         {5, 11, 8, 8, false},
         {6, 17, 7, 7, false}};

    queue<Process> ready_queue; 

    Process current; 
    int current_time;


    int finished_count = 0; 
    int total_processes = all_processes.size();

    // loop guarantees all processes are taken into consideration
    while(finished_count < total_processes) {
        for (int i = 0; i < current_time; i++) {
            if (!ready_queue.empty() && ready_queue[i].finished = false);
        }
        while(!ready_queue.empty()) {
            if (ready_queue.front().arrival_time)
        }
    }
}