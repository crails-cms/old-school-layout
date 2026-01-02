cmake_minimum_required(VERSION 3.5)

project(old-school_layout_plugin)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -O3")

find_package(PkgConfig)
pkg_check_modules(CRAILS_CMS REQUIRED libcrails-cms>=2.0.0)

include_directories(${CRAILS_CMS_INCLUDE_DIRS} .)

execute_process(COMMAND ./prebuild.sh WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR})

file(GLOB plugin_files
  src/*.cpp
  autogen/*.cpp
  autogen/renderers/*.cpp
  autogen/renderers/html/*.cpp)

add_library(old-school_layout SHARED ${plugin_files})
set_property(TARGET old-school_layout PROPERTY ENABLE_EXPORTS ON)
target_link_libraries(old-school_layout ${CRAILS_CMS_LIBRARIES})
install(TARGETS old-school_layout LIBRARY DESTINATION lib/libcrails-cms/layouts)
