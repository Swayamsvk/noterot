cmake_minimum_required(VERSION 3.4.1)
add_library( whisper SHARED
             whisper/ggml.c
             whisper/whisper.cpp
             native-lib.cpp )

include_directories(whisper)