#version 330

in vec3 in_position;

uniform vec3 cameraPosition;
uniform mat4 projectionMatrix;
uniform mat4 lookatMatrix;

void main() {
    gl_Position = vec4(in_position, 1.0);
}