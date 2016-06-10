# Compiler
CC = g++

# Compiler flags
CFLAGS = -Wall -g

# Libraries to include
LIBS = -lGLEW -lglfw3 -lGL -lm -lXrandr -lXi -lX11 -lXxf86vm -lpthread

# Files to compile
SOURCES = main.cpp

# Object files are source files with different files
OBJECTS = $(SOURCES:.cpp=.o)

# Name of the executable
TARGET = demo

all: $(TARGET)
	@echo Compiled to $(TARGET)

$(TARGET): $(OBJECTS)
	$(CC) $(CFLAGS) -o $(TARGET) $(OBJECTS) $(LIBS)

.c.o:
	$(CC) $(CFLAGS) $(INCLUDES) -c $< -o $@

clean:
	rm -f *.o *~ $(TARGET)

