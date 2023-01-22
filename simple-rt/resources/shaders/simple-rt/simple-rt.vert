#version 330

in vec3 in_position;

out vec3 fragPosition;

uniform vec3 cameraPosition;
uniform mat4 projectionMatrix;
uniform mat4 lookatMatrix;

void main() {
    gl_Position = vec4(in_position, 1.0);
    fragPosition = in_position;
}