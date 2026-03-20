#include <iostream> 
#include <vector> 
#include <queue> 
using namespace std;

struct Process
{
    int pid;
    int arrival_time;
    int burst_time;
    int remaining_time;
    bool finished;
};

int main() {
    vector<Process> all_processes = {
        {1, 0, 3, 3, false},
        {2, 3, 4, 4, false},
        {3, 7, 6, 6, false},
        {4, 10, 2, 2, false}
    };

    priority_queue<int, std::vector<int>, std::greater<int>> ready_priority_queue;

    
}