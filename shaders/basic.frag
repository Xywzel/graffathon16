#version 330 core

in vec2 coord;

out vec4 outColor;

uniform float time;

uniform float first;
uniform float second;
uniform float third;

float sphereCollisionDistance(vec3 rayStart, vec3 rayDir, vec3 sphere, float radius){
  float c = distance(sphere, rayStart);
  float v = dot(sphere - rayStart, rayDir);
  float d = (radius * radius) - (c * c - v * v);
  if (d < 0) return -1.0f;
  else return (v - sqrt(d));
}

vec3 rayDirection(vec3 front, vec3 worldUp) {
  vec3 right = normalize(cross(front, worldUp));
  vec3 up = normalize(cross(right, front));
  return normalize(front + coord.x * right + coord.y * up);
}

vec4 sampleBackground(vec3 direction) {
 return vec4(sin(3 * direction), 0.0f);
}

vec4 sphereScene()
{
  vec4 color;

  vec3 camera = vec3(0.0f, 0.0f, -1.0f);
  vec3 rayDir = normalize(vec3(coord.x, coord.y, 0.0f) - camera);
  vec3 sphere = vec3(0.0f, 0.0f, 1.0f);
  float radius = 0.5f;

  float d = sphereCollisionDistance(camera, rayDir, sphere, radius);

  vec3 collision = camera + d * rayDir;
  vec3 normal = normalize(collision - sphere);
  d = clamp(ceil(d), 0.0f, 1.0f);

  float normalFactor = clamp(dot(normal, -rayDir), 0.0f, 1.0f);
  float xFactor = clamp(sin(5.0f*normal.x+time), 0.0f, 1.0f);
  float yFactor = clamp(cos(3.0f*(normal.y+time)), 0.0f, 1.0f);
  float zFactor = clamp(cos(2.0f*normal.z-3.0*time), 0.0f, 1.0f);
  color += d * vec4(xFactor, yFactor, zFactor, 0.0f) * normalFactor;
  color += ((1.0f - d) * sampleBackground(rayDir));
  return color;
}

vec4 secondEffect(){
  vec4 color = vec4(0.0f, 0.0f, 0.0f, 0.0f);
  float effectTime = time - first;

  float cameraX = sin(effectTime) * clamp(effectTime, 1.0f, 4.0f);
  float cameraZ = cos(effectTime) * clamp(effectTime, 1.0f, 4.0f);
  vec3 camera = vec3(cameraX , 0.0f, cameraZ);
  vec3 sphere = vec3(0.0f, 0.0f, 1.0f);
  vec3 rayDir = rayDirection(normalize(sphere - camera), vec3(0.0f, 1.0f, 0.0f));
  float radius = 0.5f;

  float d = sphereCollisionDistance(camera, rayDir, sphere, radius);

  vec3 collision = camera + d * rayDir;
  vec3 normal = normalize(collision - sphere);
  d = clamp(ceil(d), 0.0f, 1.0f);

  float normalFactor = clamp(dot(normal, -rayDir), 0.0f, 1.0f);
  float xFactor = clamp(sin(5.0f*normal.x+time), 0.0f, 1.0f);
  float yFactor = clamp(cos(3.0f*(normal.y+time)), 0.0f, 1.0f);
  float zFactor = clamp(cos(2.0f*normal.z-3.0*time), 0.0f, 1.0f);
  color += d * vec4(xFactor, yFactor, zFactor, 0.0f) * normalFactor;
  color += ((1.0f - d) * sampleBackground(rayDir));

  return color;
}

vec4 thirdEffect(){
  vec4 color = vec4(0.0f, 0.0f, 0.0f, 0.0f);
  float effectTime = time - first;
  float cameraX = sin(effectTime) * clamp(effectTime, 1.0f, 4.0f);
  float cameraZ = cos(effectTime) * clamp(effectTime, 1.0f, 4.0f);
  vec3 camera = vec3(cameraX , 0.0f, cameraZ);
  vec3 sphere = vec3(0.0f, 0.0f, 1.0f);
  vec3 rayDir = rayDirection(normalize(sphere - camera), vec3(0.0f, 1.0f, 0.0f));
  float radius = 0.5f;

  float d = sphereCollisionDistance(camera, rayDir, sphere, radius);

  if(d < 0) {
    color += sampleBackground(rayDir);
  }
  else {
    vec3 collision = camera + d * rayDir;
    vec3 normal = normalize(collision - sphere);
    vec3 refraction = refract(rayDir, normal, 1.0f + sin(time * 3.0) * 0.3);
    vec3 reflection = reflect(rayDir, normal);
    float portion = dot(reflection, normal);
    color += sampleBackground(refraction) * portion * portion + sampleBackground(reflection) * (1.0f - portion * portion);
  }
  return color;
}

vec4 fourthEffect(){
  vec4 color = vec4(0.0f, 0.0f, 0.0f, 0.0f);
  float effectTime = time - first;
  float cameraX = sin(effectTime) * clamp(effectTime, 1.0f, 4.0f);
  float cameraZ = cos(effectTime) * clamp(effectTime, 1.0f, 4.0f);
  vec3 camera = vec3(cameraX , 0.0f, cameraZ);
  vec3 sphere = vec3(0.0f, 0.0f, 1.0f);
  vec3 rayDir = rayDirection(normalize(sphere - camera), vec3(0.0f, 1.0f, 0.0f));
  float radius = 0.5f;

  float d1 = sphereCollisionDistance(camera, rayDir, sphere, radius);
  if (d1 > 0) {
    vec3 collision = camera + d1 * rayDir;
    vec3 normal = normalize(collision - sphere);
    vec3 newRay = refract(rayDir, normal, 1.25f);
/*
    float d2 = sphereCollisionDistance(collision, newRay, sphere, radius);
    if (d2 > 0) {
      collision = collision + d2 * newRay;
      normal = normalize(collision -sphere);
      newRay = refract(newRay, normal, 1.0f/1.25f);
      color += sampleBackground(newRay);
    }
    color += sampleBackground(newRay);
*/
    color += sampleBackground(newRay);
  }
  else color += sampleBackground(rayDir);
  return color;
}

void main()
{
  outColor = vec4(0.0f, 0.0f, 0.0f, 1.0f);
  float fade1 = clamp(exp(time * 0.1f) - 1.0f, 0.0f, 1.0f);
  float fade2 = clamp(exp((time - first) * 0.2) - 1.0f, 0.0f, 1.0f);
  float fade3 = clamp(exp((time - second) * 0.2) - 1.0f, 0.0f, 1.0f);
  float fade4 = clamp(exp((time - third) * 0.2) - 1.0f, 0.0f, 1.0f);

  outColor += fade1 * (1.0f - fade2) * sphereScene();
  outColor += fade2 * (1.0f - fade3) * secondEffect();
  outColor += fade3 * (1.0f - fade4) * thirdEffect();
  outColor += fade4 * fourthEffect();
}

