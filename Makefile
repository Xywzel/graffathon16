# Compiler
CC = g++
DEBUG = -g

# Compiler flags
CFLAGS = -Wall -std=c++11 -march=native -O3

# Libraries to include
LIBS = -lGLEW -lglfw3 -lGL -lm -lXrandr -lXi -lX11 -lXxf86vm -lpthread

# Extra headers
INCLUDES = -I headers -I include

# Files to compile
SOURCES = main.cpp Shader.cpp Camera.cpp

# Directories
SRCDIR = sources
OBJDIR = objects

# Object files are source files with different files
OBJECTS = $(SOURCES:%.cpp=$(OBJDIR)/%.o)

# Name of the executable
TARGET = demo.out

all: $(TARGET)
	@echo Compiled to $(TARGET)

$(TARGET): $(OBJECTS)
	$(CC) $(CFLAGS) $(INCLUDES) -o $(TARGET) $(OBJECTS) $(LIBS)

$(OBJDIR)/%.o: $(SRCDIR)/%.cpp
	$(CC) $(CFLAGS) $(INCLUDES) -c $< -o $@

clean:
	find . -name \*.o -type f -delete
	-rm $(TARGET)

