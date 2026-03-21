#include <vector>
#include <iostream>

#include "include/process.h"
#include "include/utils.h"
#include "algorithms/fcfs.h"

int main() {
    std::vector<Process> processes = {
        {1, 0, 5},
        {2, 1, 3},
        {3, 2, 8},
        {4, 3, 6}
    };

    SchedulerResult result = run_fcfs(processes);

    print_result(result);

    return 0;
}