cmake_minimum_required(VERSION 3.18.1)

project("whisper")

# Add the current directory to the include path so headers can be found
include_directories(.)

add_library(
    whisper
    SHARED
    whisper.cpp
    ggml.c
    native-lib.cpp
)

find_library(log-lib log)

target_link_libraries(
    whisper
    ${log-lib}
) 