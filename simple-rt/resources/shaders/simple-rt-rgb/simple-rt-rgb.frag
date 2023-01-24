#version 330

#define EPSILON 0.0001f
#define INFTY 9999

#define N_TRIANGLES 12

in vec3 fragPosition;

out vec4 fragColor;

uniform vec3 res;
uniform vec3 cameraPosition;
uniform float cameraAngle;

uniform vec3 leftTetrahedronColor;
uniform vec3 rightTetrahedronColor;
uniform vec3 wallsColor;
uniform vec3 lightColor;

struct Light
{
    vec3 position;
    vec3 color;
    float intensity;
};

struct Triangle
{
	vec3 vertex0;
	vec3 vertex1;
	vec3 vertex2;
    vec3 color;
};

struct Ray
{
	vec3 origin;
	vec3 direction;
};

struct HitData
{
	float rayLength;
	vec3 normal;
    vec3 pointHit;
    vec3 materialColor;
};

HitData TriangleRayIntersection(vec3 rayOrigin, vec3 rayVector, Triangle triangle);
vec3 traceRay(vec3 rayOrigin, vec3 rayVector, Triangle triangles[N_TRIANGLES], Light light, int hitNumber);
vec3 multiplyMatrixAndVector(mat3 mat, vec3 vec);
vec3 toViewport(vec2 resolution);

void main()
{
//    vec3 rightTetrahedronColor = vec3(1, 0, 0);
//    vec3 leftTetrahedronColor = vec3(0, 1, 0);
//    vec3 wallsColor = vec3(0, 0, 1);
//    vec3 lightColor = vec3(1);

    vec2 resolution = vec2(res);

    Triangle base;
    base.vertex0 = vec3(-3, 0, 1);
    base.vertex1 = vec3(0, 0, 2);
    base.vertex2 = vec3(-1, 0, -1);
    base.color = leftTetrahedronColor;

    Triangle wall1;
    wall1.vertex0 = vec3(-3, 0, 1);
    wall1.vertex1 = vec3(0, 0, 2);
    wall1.vertex2 = vec3(-1.5, 3, 0.5);
    wall1.color = leftTetrahedronColor;

    Triangle wall2;
    wall2.vertex0 = vec3(-3, 0, 1);
    wall2.vertex1 = vec3(-1, 0, -1);
    wall2.vertex2 = vec3(-1.5, 3, 0.5);
    wall2.color = leftTetrahedronColor;

    Triangle wall3;
    wall3.vertex0 = vec3(0, 0, 2);
    wall3.vertex1 = vec3(-1, 0, -1);
    wall3.vertex2 = vec3(-1.5, 3, 0.5);
    wall3.color = leftTetrahedronColor;

    Triangle base1;
    base1.vertex0 = vec3(0, 0, 2);
    base1.vertex1 = vec3(3, 0, 1);
    base1.vertex2 = vec3(1, 0, -1);
    base1.color = rightTetrahedronColor;

    Triangle wall11;
    wall11.vertex0 = vec3(0, 0, 2);
    wall11.vertex1 = vec3(3, 0, 1);
    wall11.vertex2 = vec3(1.5, 3, 0.5);
    wall11.color = rightTetrahedronColor;

    Triangle wall21;
    wall21.vertex0 = vec3(0, 0, 2);
    wall21.vertex1 = vec3(1, 0, -1);
    wall21.vertex2 = vec3(1.5, 3, 0.5);
    wall21.color = rightTetrahedronColor;

    Triangle wall31;
    wall31.vertex0 = vec3(1, 0, -1);
    wall31.vertex1 = vec3(3, 0, 1);
    wall31.vertex2 = vec3(1.5, 3, 0.5);
    wall31.color = rightTetrahedronColor;

    Triangle plane;
    plane.vertex0 = vec3(-20, -1, -20);
    plane.vertex1 = vec3( 20, -1, -20);
    plane.vertex2 = vec3(  0, -1,  20);
    plane.color = wallsColor;

    Triangle plane2;
    plane2.vertex0 = vec3(  0, -1, 20);
    plane2.vertex1 = vec3(  0, 20,  0);
    plane2.vertex2 = vec3( 20, -1,-20);
    plane2.color = wallsColor;

    Triangle plane3;
    plane3.vertex0 = vec3( 20, -1,-20);
    plane3.vertex1 = vec3(  0, 20,  0);
    plane3.vertex2 = vec3(-20, -1,-20);
    plane3.color = wallsColor;

    Triangle plane4;
    plane4.vertex0 = vec3(  0, -1, 20);
    plane4.vertex1 = vec3(  0, 20,  0);
    plane4.vertex2 = vec3(-20, -1,-20);
    plane4.color = wallsColor;

    Triangle tetrahedron[N_TRIANGLES] = Triangle[N_TRIANGLES] (
        base, wall1, wall2, wall3, base1, wall11, wall21, wall31, plane, plane2, plane3, plane4
    );

    Light light;
    light.position = vec3(-3.5, 5, -5);
    light.color = lightColor;
    light.intensity = 4;

    // normalized pixel coordinates (from 0 to 1)
    vec2 uv = gl_FragCoord.xy / resolution.xy;

	uv = uv * 2.0 - 1.0; // transform from [0,1] to [-1,1]
    uv.x *= resolution.x / resolution.y; // aspect fix

    vec3 u = vec3(0, 1, 0);
    mat3 uMatrix = mat3(0);
    uMatrix[2][0] = 1;
    uMatrix[0][2] = -1;
    mat3 cameraRotation = cos(cameraAngle) * mat3(1.0) + (1 - cos(cameraAngle)) * outerProduct(u, u) + sin(cameraAngle) * uMatrix;

    vec3 cameraDirection = normalize(toViewport(resolution));
    cameraDirection = multiplyMatrixAndVector(cameraRotation, cameraDirection);

    int hitNumber = 10;
    vec3 rayStartingPositon = cameraPosition;
    vec3 rayDirection = normalize(cameraDirection + vec3(uv, 0));


    vec3 color = traceRay(rayStartingPositon, rayDirection, tetrahedron, light, hitNumber);

    fragColor = vec4(color, 1);
}

vec3 traceRay(vec3 rayOrigin, vec3 rayVector, Triangle triangles[N_TRIANGLES], Light light, int hitNumber) {
    vec3 ambient = vec3(0.01, 0.01, 0.05);

    vec3 color = vec3(0);
    for (int j = hitNumber; j >= 0; j--) {

        HitData detectedHit;
        detectedHit.rayLength = INFTY;
        for (int i = 0; i < N_TRIANGLES; i++) {
            HitData hitResult = TriangleRayIntersection(rayOrigin + EPSILON * rayVector, rayVector, triangles[i]);
            if (hitResult.rayLength < detectedHit.rayLength) {
                detectedHit = hitResult;
            }
        }
        if (detectedHit.rayLength == INFTY) {
            break;
        }

        vec3 lightVector = light.position - detectedHit.pointHit;
        float shadowRayLength = length(lightVector);
        lightVector = normalize(lightVector);
        HitData detectedShadowHit;
        detectedShadowHit.rayLength = INFTY;
        for (int i = 0; i < N_TRIANGLES; i++) {
            HitData shadowRayHit = TriangleRayIntersection(detectedHit.pointHit + EPSILON * lightVector, lightVector, triangles[i]);
            if (shadowRayHit.rayLength < detectedShadowHit.rayLength) {
                detectedShadowHit = shadowRayHit;
            }
        }
        if (detectedShadowHit.rayLength < shadowRayLength) {
            break;
        }

        float diff = max(dot(detectedHit.normal, normalize(-lightVector)), 0.0);
        vec3 diffuse = light.color * detectedHit.materialColor;
        diffuse = diffuse * diff * light.intensity / shadowRayLength;

        vec3 reflectedVector = reflect(normalize(lightVector), detectedHit.normal);

        float spec = pow(max(dot(-rayVector, -reflectedVector), 0.0), 32);
        vec3 specular = light.color * light.intensity * spec;

        vec3 currentColor = diffuse + specular;

        color += currentColor;

        light.intensity = light.intensity * 0.5;

        rayOrigin = detectedHit.pointHit;
        rayVector = -reflectedVector;
    }

    return color;
}

HitData TriangleRayIntersection(vec3 rayOrigin, vec3 rayVector, Triangle triangle)
{
	vec3 vertex0 = triangle.vertex0;
	vec3 vertex1 = triangle.vertex1;
	vec3 vertex2 = triangle.vertex2;
	vec3 edge1 = vertex1 - vertex0;
	vec3 edge2 = vertex2 - vertex0;
	vec3 h;
	vec3 s;
	vec3 q;
	float a;
	float f;
	float u;
	float v;
	h = cross(rayVector, edge2);
	a = dot(edge1, h);
    HitData result;
    result.rayLength = 9999.0;
	if (!(a > -EPSILON && a < EPSILON))
	{
		f = 1.0f / a;
		s = rayOrigin - vertex0;
		u = f * dot(s, h);
		if (!(u < 0.0f || u > 1.0f))
		{
			q = cross(s, edge1);
			v = f * dot(rayVector, q);
			if (!(v < 0.0f || u + v > 1.0f))
			{
				float resultRayLength = f * dot(edge2, q);

                if (resultRayLength > 0) {
                    result.rayLength = resultRayLength;
                    result.normal = normalize(cross(edge1, edge2));
                    result.pointHit = rayOrigin + rayVector * resultRayLength;
                    result.materialColor = triangle.color;
                }
			}
		}
	}

	return result;
}

vec3 toViewport(vec2 resolution) {
  return vec3(
    fragPosition[0] / resolution.x,
    fragPosition[1] / resolution.y,
    1);
}

// Multiplies a matrix and a vector.
vec3 multiplyMatrixAndVector(mat3 mat, vec3 vec) {
  vec3 result = vec3(0, 0, 0);

  for (int ii = 0; ii < 3; ii++) {
    for (int jj = 0; jj < 3; jj++) {
      result[ii] += vec[jj] * mat[ii][jj];
    }
  }
  return result;
}

