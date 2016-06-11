#version 330 core

in vec2 coord;

out vec4 color;

uniform float time;

vec4 sphereScene()
{
  vec3 camera = vec3(0.0f, 0.0f, -3.0f);
  vec3 cameraFront = vec3(0.0f, 0.0f, 1.0f);
  vec3 pixelCoord = vec3(coord.x, coord.y, 0.0f);
  vec3 sphere = vec3(-1.0f, -1.0f, -1.0);
  float radius = 0.5f;

  vec3 rayDir = normalize(cameraFront + pixelCoord);
  vec3 cameraSphere = camera - sphere;

  float a = 1.0f;
  float b = 2.0f * (rayDir.x * cameraSphere.x + rayDir.y * cameraSphere.y + rayDir.z * cameraSphere.z);
  float c = length(cameraSphere) - radius;

  float delta = b * b - 4 * a * c;

  vec4 color = vec4(0.5f, 0.5f, 0.5f, 1.0f);

  float check = clamp(ceil(delta), 0.0f, 1.0f);
  float inverseA = 1.0f / (2.0f * a);
  float d1 = (-b - sqrt(delta)) * inverseA;
  float d2 = (-b + sqrt(delta)) * inverseA;

  vec3 collision = camera + min(d1, d2) * rayDir;

  vec3 normal = normalize(collision - sphere);

  color += vec4(normal, 0.0f);

  return color;
}

void main()
{
  color = vec4(0.0f, 0.0f, 0.0f, 0.0f);

  color = clamp(time, 0.0f, 5.0f) * sphereScene();
}

