cmake_minimum_required(VERSION 3.16)
project(cpu_scheduling_sim CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Release build optimizations
if(NOT CMAKE_BUILD_TYPE)
  set(CMAKE_BUILD_TYPE Release)
endif()

set(CMAKE_CXX_FLAGS_RELEASE "-O2")

# Main CLI executable
add_executable(scheduler
    core/main.cpp
)

target_include_directories(scheduler PRIVATE core/include core/algorithms)
