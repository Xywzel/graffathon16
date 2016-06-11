#version 330 core

in vec2 coord;

out vec4 outColor;

uniform float time;

#define PI 3.141592653589793238462643383279

struct Sphere {
  vec3 center;
  float radius;
};

struct Ray {
  vec3 origin;
  vec3 dir;
};

struct Camera {
  vec3 pos;
  vec3 front;
  vec3 up;
  vec3 right;
};

Sphere spheres[20];

vec2 sphereCollisionDistance(Ray ray, Sphere sphere){
  vec3 raySphere = ray.origin - sphere.center;
  float a = dot(ray.dir, ray.dir);
  float b = 2.0f * dot(ray.dir, raySphere);
  float c =
    dot(sphere.center, sphere.center)
    + dot(ray.origin, ray.origin)
    - 2.0f * dot(sphere.center, ray.origin)
    - (sphere.radius * sphere.radius);
  float delta = (b * b) - (4 * a * c);
  if (delta < 0) return vec2(-1.0f, -1.0f);
  else return vec2(-b-sqrt(delta)*0.5, -b+sqrt(delta)*0.5);
}

Ray cameraRay(Camera camera) {
  Ray ray;
  ray.origin = camera.pos;
  ray.dir = normalize(camera.front + coord.x * camera.right + coord.y * camera.up);
  return ray;
}

Camera normalizeCamera(Camera camera, vec3 worldUp){
  camera.front = normalize(camera.front);
  camera.right = normalize(cross(camera.front, normalize(worldUp)));
  camera.up = normalize(cross(camera.right, camera.front));
  return camera;
}

vec4 sampleBackground(Ray ray) {
 return vec4(sin(floor(20 * PI * ray.dir)), 0.0f);
}

Camera setCamera(){
  Camera camera;
  float t = time * 0.2f;
  float t2 = time * 0.2f + 0.4f * PI;
  float r = 10.0f * sin(t);
  camera.pos = vec3(r * cos(t), 0.0f, r * sin(t));
  camera.front = vec3(r * cos(t2), 0.0f, r * sin(t2));
  vec3 worldUp = vec3(0.0f, 30.0f, 0.0f) - camera.pos;
  camera = normalizeCamera(camera, worldUp);
  return camera;
}

Camera cameraEasy(){
  Camera camera;
  camera.pos = vec3(0.0f, 0.0f, -3.0f);
  camera.front = vec3(0.0f, 0.0, 1.0f);
  vec3 worldUp = vec3(0.0f, 1.0f, 0.0f);
  camera = normalizeCamera(camera, worldUp);
  return camera;
}


void addSpheres(){
  spheres[0].center = vec3(0.0f, 0.0f, 0.0f);
  spheres[0].radius = 1.0f;
  spheres[1].center = vec3(0.0f, 2.0f + 0.5f * sin(time * 0.3), 0.0f);
  spheres[1].radius = 0.5f;
  spheres[2].center = vec3(10.0f, 0.0f, 10.0f);
  spheres[2].radius = 0.5f;
  spheres[3].center = vec3(-10.0f, 0.0f, -10.0f);
  spheres[3].radius = 0.5f;
  spheres[4].center = vec3(5.0f * cos(time), 5.0f, 5.0f * sin(time));
  spheres[4].radius = 0.5f;
  spheres[5].center = vec3(5.0f * -cos(time), -5.0f, 5.0f * -sin(time));
  spheres[5].radius = 0.5f;
  spheres[6].center = vec3(-7.0f, 20.0f * cos(time), -7.0f);
  spheres[6].radius = 0.5f;
  spheres[7].center = vec3(7.0f, 20.0f * cos(time), -7.0f);
  spheres[7].radius = 0.5f;
  spheres[8].center = vec3(7.0f, 20.0f * cos(time), 7.0f);
  spheres[8].radius = 0.5f;
  spheres[9].center = vec3(-7.0f, 20.0f * cos(time), 7.0f);
  spheres[9].radius = 0.5f;
  spheres[10].center = vec3(sin(time * 0.5f), 4.0f, 0.0f);
  spheres[10].radius = 1.0f;
  spheres[11].center = vec3(4.0f, sin(time * 0.5f), 0.0f);
  spheres[11].radius = 0.5f;
  spheres[12].center = vec3(0.0f, 4.0f, sin(time * 0.5f));
  spheres[12].radius = 0.5f;
  spheres[13].center = vec3(0.0f, sin(time * 0.5f), 4.0f);
  spheres[13].radius = 0.5f;
  spheres[14].center = vec3(sin(time * 0.5f), -4.0f, 0.0f);
  spheres[14].radius = 1.0f;
  spheres[15].center = vec3(-4.0f, sin(time * 0.5f), 0.0f);
  spheres[15].radius = 0.5f;
  spheres[16].center = vec3(0.0f, -4.0f, sin(time * 0.5f));
  spheres[16].radius = 0.5f;
  spheres[17].center = vec3(0.0f, sin(time * 0.5f), -4.0f);
  spheres[17].radius = 0.5f;
  spheres[18].center = vec3(7.0f, 20.0f * cos(time), -7.0f);
  spheres[18].radius = 0.5f;
  spheres[19].center = vec3(7.0f, 20.0f * cos(time), 7.0f);
  spheres[19].radius = 0.5f;
}

vec4 trace(Ray ray){
  float smallestD = -1.0f;
  int sphereHit = -1;
  vec4 color;
  for(int i = 0; i < 20; i++){
    vec2 d = sphereCollisionDistance(ray, spheres[i]);
    if(min(d.x, d.y) > 0.0f){
      sphereHit = 1;
    }
  }
  if(sphereHit > 0) {
    color = vec4(1.0f, 0.0f, 1.0f, 0.0f);
  }
  else {
    color = sampleBackground(ray);
  }
  return color;
}

void main(){
  outColor = vec4(0.0f, 0.0f, 0.0f, 1.0f);
  Camera camera = setCamera();
  Ray ray = cameraRay(camera);
  addSpheres();
  outColor += trace(ray);
}

