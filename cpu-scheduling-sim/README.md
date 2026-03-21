# CPU Scheduling Simulator

A discrete-time CPU scheduling simulator built in C++ with a React web frontend (coming soon).

## Algorithms Implemented
- **FCFS** — First Come First Serve
- **SJF** — Shortest Job First (non-preemptive)
- **SRTF** — Shortest Remaining Time First (preemptive)
- **Round Robin** — with configurable time quantum
- **Priority** — Priority Scheduling (non-preemptive, lower value = higher priority)

## Build

```bash
mkdir build && cd build
cmake ..
cmake --build .
```

## Run

```bash
# From build directory
./scheduler fcfs
./scheduler sjf
./scheduler srtf
./scheduler rr 3        # Round Robin with quantum=3
./scheduler priority
./scheduler all         # Run all and compare
```

## Project Structure

```
cpu-scheduling-sim/
├── core/
│   ├── algorithms/       # One header per scheduling algorithm
│   ├── include/          # Shared types (Process, GanttEntry, utils)
│   └── main.cpp          # CLI entry point
├── web/                  # React frontend (Phase 2)
├── sample_inputs/        # JSON process definitions
└── CMakeLists.txt
```

## Roadmap
- [x] FCFS
- [x] SJF
- [x] SRTF
- [x] Round Robin
- [x] Priority Scheduling
- [ ] JSON file input
- [ ] Web frontend with Gantt chart visualization
- [ ] Algorithm comparison dashboard
- [ ] Deploy to Vercel
