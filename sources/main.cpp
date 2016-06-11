// C lib stuff
#include <cstdlib>

// C++ lib stuff
#include <iostream>
#include <string>

// include GL
#include <GL/glew.h>

// OpenGL wrappers
#include <GLFW/glfw3.h>

#define NAME "Best Demo Ever"
const GLuint WIDTH = 1920;
const GLuint HEIGHT = 1080;
const GLfloat FPS = 60.0f;

bool keys[1024];

void fatalError(std::string error){
  std::cout << error << std::endl;
  glfwTerminate();
  std::exit(1);
}

void keycallback(GLFWwindow* window, int key, int scancode, int action, int mode){
  if (action == GLFW_PRESS) keys[key] = true;
  else if (action == GLFW_RELEASE) keys[key] = false;
}

void handleKeys(GLFWwindow* window){
  if (keys[GLFW_KEY_ESCAPE]) glfwSetWindowShouldClose(window, GL_TRUE);
}

int main(int argc, char** argv){
  // Set interactive mode for debugging the program when started with arguments
  bool interactive = false;
  if(argc > 1) interactive = true;

  // Initialize GLFW
  if (!glfwInit()) fatalError("GLFW could not be initialized");
  glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
  glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
  glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
  glfwWindowHint(GLFW_RESIZABLE, GL_FALSE);

  // Create window
  GLFWwindow* window = glfwCreateWindow(WIDTH, HEIGHT, NAME, NULL, NULL);
  if (window == NULL) fatalError("Failed to create GLFW window");
  glfwMakeContextCurrent(window);

  // Controls
  glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_DISABLED);
  glfwSetKeyCallback(window, keycallback);

  // Start GLEW
  glewExperimental = GL_TRUE;
  if (glewInit() != GLEW_OK) fatalError("Failed to initialize GLEW");
  glViewport(0, 0, WIDTH, HEIGHT);

  bool isTicking = true;
  GLint tick = 0;
  GLfloat lastFrame = (GLfloat) glfwGetTime();
  GLfloat thisFrame = (GLfloat) glfwGetTime();
  GLfloat deltaTime = thisFrame - lastFrame;

  while(!glfwWindowShouldClose(window)){
    if(isTicking) ++tick;

    // Handle Inputs if we are in interactive mode
    if (interactive) {
      glfwPollEvents();
      handleKeys(window);
    }

    glfwSwapBuffers(window);
  }
  glfwTerminate();
  return 0;
}
