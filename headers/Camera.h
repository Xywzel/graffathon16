#pragma once

/***********************************************************************
 * This is a simple camera helper class that can be used to abstract   *
 * FPS style camera movement and creation of view transform  matrix    *
 ***********************************************************************/

#include <GL/glew.h>
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>

const GLfloat NEAR_PLANE = 0.1f;
const GLfloat FAR_PLANE = 100.0f;

class Camera {
public:
	glm::vec3 position;
	glm::vec3 front;
	glm::vec3 up;
	glm::vec3 right;
	glm::vec3 worldUp;

	GLfloat yaw;
	GLfloat pitch;

	GLfloat speed;
	GLfloat sensitivity;
	GLfloat fov;

	Camera();
	Camera(GLfloat posX, GLfloat posY, GLfloat posZ, GLfloat yaw, GLfloat pitch);
	Camera(glm::vec3 pos, GLfloat yaw, GLfloat pitch);

	glm::mat4 viewMatrix();

private:
	void updateVectors();
};
