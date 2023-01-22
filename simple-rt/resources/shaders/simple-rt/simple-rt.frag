#version 330

in vec3 fragPosition;

out vec4 fragColor;

uniform vec3 res;
uniform vec3 cameraPosition;
uniform mat3 cameraRotation;

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
};

HitData TriangleRayIntersection(vec3 rayOrigin, vec3 rayVector, Triangle triangle);
vec3 traceRay(vec3 rayOrigin, vec3 rayVector, Triangle triangles[4], Light light, int hitNumber);
vec3 multiplyMatrixAndVector(mat3 mat, vec3 vec);
vec3 toViewport(vec2 resolution);

void main()
{
    vec2 resolution = vec2(res);

    Triangle base;
    base.vertex0 = vec3(-2, 0, -2);
    base.vertex1 = vec3(1, 0, -2);
    base.vertex2 = vec3(-2, 0, 2);

    Triangle wall1;
    wall1.vertex0 = vec3(-2, 0, -2);
    wall1.vertex1 = vec3(1, 0, -2);
    wall1.vertex2 = vec3(-1, 3, -1);

    Triangle wall2;
    wall2.vertex0 = vec3(1, 0, -2);
    wall2.vertex1 = vec3(-2, 0, 2);
    wall2.vertex2 = vec3(-1, 3, -1);

    Triangle wall3;
    wall3.vertex0 = vec3(-2, 0, 2);
    wall3.vertex1 = vec3(-2, 0, -2);
    wall3.vertex2 = vec3(-1, 3, -1);

    int nTriangles = 4;
    Triangle quadrangle[4] = Triangle[4] (
        base, wall1, wall2, wall3
    );

    Light light;
    light.position = vec3(-1, 5, -1);
    light.color = vec3(1.0, 1.0, 1.0);
    light.intensity = 0.99;

    // normalized pixel coordinates (from 0 to 1)
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    
	uv = uv * 2.0 - 1.0; // transform from [0,1] to [-1,1]
    uv.x *= resolution.x / resolution.y; // aspect fix

    //mat3 cameraRotation = mat3(vec3(1, 0, 0), vec3(0, 1, 0), vec3(0, 0, 1));
    //vec3 cameraDirection = normalize(cameraTarget - cameraPosition);

    vec3 cameraDirection = toViewport(resolution);
    cameraDirection = multiplyMatrixAndVector(cameraRotation, cameraDirection);

    int hitNumber = 10;
    vec3 rayStartingPositon = cameraPosition;
    vec3 rayDirection = normalize(cameraDirection + vec3(uv, 0));

    vec3 color = traceRay(rayStartingPositon, rayDirection, quadrangle, light, hitNumber);
    fragColor = vec4(color, 1);
}

vec3 traceRay(vec3 rayOrigin, vec3 rayVector, Triangle triangles[4], Light light, int hitNumber) {
    float INFTY = 9999;
    float EPSILON = 0.0001;

    vec3 color = vec3(0);
    for (int j = hitNumber; j >= 0; j--) {

        HitData detectedHit;
        detectedHit.rayLength = INFTY;
        for (int i = 0; i < 4; i++) {
            HitData hitResult = TriangleRayIntersection(rayOrigin + EPSILON * rayVector, rayVector, triangles[i]);
            if (hitResult.rayLength < detectedHit.rayLength) {
                detectedHit = hitResult;
            }
        }
        if (detectedHit.rayLength == INFTY) break;

        vec3 lightVector = light.position - detectedHit.pointHit;
        HitData detectedShadowHit;
        detectedShadowHit.rayLength = INFTY;
        for (int i = 0; i < 4; i++) {
            HitData shadowRayHit = TriangleRayIntersection(detectedHit.pointHit + EPSILON * lightVector, lightVector, triangles[i]);
            if (shadowRayHit.rayLength < detectedShadowHit.rayLength) {
                detectedShadowHit = shadowRayHit;
            }
        }
        if (detectedShadowHit.rayLength < length(lightVector)) break;

        float diff = max(dot(detectedHit.normal, -lightVector), 0.0);
        vec3 diffuse = diff * light.intensity * light.color / length(lightVector);

        vec3 reflectedVector = reflect(-rayVector, detectedHit.normal);

        float spec = pow(max(dot(rayVector, reflectedVector), 0.0), 32);
        vec3 specular = light.color * light.intensity * spec;

        rayOrigin = detectedHit.pointHit;
        rayVector = reflectedVector;

        color += (j+1)/(hitNumber+1) * (diffuse + specular);
    }

    return color;
}

HitData TriangleRayIntersection(vec3 rayOrigin, vec3 rayVector, Triangle triangle)
{
	float EPSILON = 0.0001f;
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