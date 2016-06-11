// C lib stuff
#include <cstdlib>

// C++ lib stuff
#include <iostream>
#include <string>

// include GL
#include <GL/glew.h>

// OpenGL wrappers
#include <GLFW/glfw3.h>

// GL math stuff
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>

// Include local stuff
#include "Camera.h"
#include "Shader.h"

#define FPSlog false
#define SCALE 1.5f

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

void handleKeys(GLFWwindow* window, GLfloat& timeFromStart, bool& ticking, Shader& shader){
  if (keys[GLFW_KEY_ESCAPE]) glfwSetWindowShouldClose(window, GL_TRUE);
  if (keys[GLFW_KEY_SPACE]) {
    ticking = !ticking;
    keys[GLFW_KEY_SPACE] = false;
  }
  if (keys[GLFW_KEY_LEFT] && !ticking){
    timeFromStart -= 0.5f;
    keys[GLFW_KEY_LEFT] = false;
  }
  if (keys[GLFW_KEY_RIGHT] && !ticking){
    timeFromStart += 0.5f;
    keys[GLFW_KEY_RIGHT] = false;
  }
  if (keys[GLFW_KEY_ENTER]) {
    timeFromStart = 0.0f;
    keys[GLFW_KEY_ENTER] = false;
    shader = Shader("shaders/basic.vertex", "shaders/basic.frag");
  }
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

  // Load shaders
  Shader shader("shaders/basic.vertex", "shaders/basic.frag");

  // Raster scene settings
  Camera camera(glm::vec3(0.0f, 0.0f, 3.0f), -90.0f, 0.0f);
  GLfloat vertices[] = {
    -1.0f, -1.0f, 0.0f, -1.0f, -1.0f,
     1.0f, -1.0f, 0.0f,  1.0f, -1.0f,
    -1.0f,  1.0f, 0.0f, -1.0f,  1.0f,
     1.0f,  1.0f, 0.0f,  1.0f,  1.0f
  };
  GLuint indices[] = {
    0, 1, 2,
    2, 1, 3
  };

  GLuint VAO, VBO, EBO;
  glGenVertexArrays(1, &VAO);
  glBindVertexArray(VAO);

  glGenBuffers(1, &VBO);
  glBindBuffer(GL_ARRAY_BUFFER, VBO);
  glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
  glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 5 * sizeof(GLfloat), (GLvoid*)0);
  glEnableVertexAttribArray(0);
  glVertexAttribPointer(1, 2, GL_FLOAT, GL_FALSE, 5 * sizeof(GLfloat), (GLvoid*) (3* sizeof(GLfloat)));
  glEnableVertexAttribArray(1);

  glGenBuffers(1, &EBO);
  glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
  glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);

  glBindVertexArray(0);

  // FPS counter
  bool isTicking = true;
  int fpscount = 0;
  GLfloat fpstime = 0.0f;

  // Frame timings
  GLfloat timeFromStart = 0.0f;
  GLfloat lastFrame = (GLfloat) glfwGetTime();
  GLfloat thisFrame = (GLfloat) glfwGetTime();
  GLfloat deltaTime = thisFrame - lastFrame;

  while(!glfwWindowShouldClose(window)){
    thisFrame = (GLfloat) glfwGetTime();
    deltaTime = thisFrame - lastFrame;
    if(isTicking){
      timeFromStart += deltaTime;
      fpscount++;
      fpstime += deltaTime;
      if(fpstime > 1.0f) {
        if(FPSlog){
          std::cout << "FPS: " << (GLfloat) fpscount /  fpstime << std::endl;
        }
        fpstime = 0.0f;
        fpscount = 0;
      }
    }

    // Handle Inputs if we are in interactive mode
    //if (interactive) {
    glfwPollEvents();
    handleKeys(window, timeFromStart, isTicking, shader);
    //}


    glClearColor(0.05f, 0.05f, 0.05f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT); 

    glm::mat4 model;
    model = glm::scale(model, glm::vec3(SCALE, SCALE, SCALE));
    glm::mat4 view;
    view = glm::translate(view, glm::vec3(0.0f, 0.0f, -3.0f));
    glm::mat4 proj = glm::perspective(glm::radians(45.0f), (GLfloat) WIDTH / (GLfloat) HEIGHT, 0.1f, 100.0f);
    glm::mat4 trans = proj * view * model;

    glUseProgram(shader.program);
    glUniform1f(glGetUniformLocation(shader.program, "time"), timeFromStart);
    glUniformMatrix4fv(glGetUniformLocation(shader.program, "transform"), 1, GL_FALSE, glm::value_ptr(trans));
    glBindVertexArray(VAO);
    // Draw
    glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);

    glBindVertexArray(0);
    glfwSwapBuffers(window);
    lastFrame = thisFrame;
  }
  glfwTerminate();
  return 0;
}
