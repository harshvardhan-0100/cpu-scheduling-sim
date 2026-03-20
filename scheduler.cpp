#include <iostream>
#include <queue>
using namespace std;

struct Process {
    int pid;             // process id
    int burst_time;      // total cpu time needed
    int remaining_time;  // cpu time still needed
};

int main() {
    queue<Process> ready_queue;

    ready_queue.push({1, 5, 5});
    ready_queue.push({2, 3, 3});
    ready_queue.push({3, 8, 8});
    ready_queue.push({4, 7, 7});

    
    int current_time = 0;
    while (!ready_queue.empty()) {
        Process current = ready_queue.front();
        ready_queue.pop();

        // assuming that cpu is assigned to the process

        while(current.remaining_time > 0) {
            // process under execution
            current.remaining_time--;
            current_time++;
        }

        cout << "Process P" << current.pid
             << " finished at time " << current_time << endl;
    }

}
