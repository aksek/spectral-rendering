#version 330

in vec3 fragPosition;

out vec4 fragColor;

uniform vec2 resolution;

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
};

HitData TriangleRayIntersection(vec3 rayOrigin, vec3 rayVector, Triangle triangle);

void main()
{
    Triangle base;
    base.vertex0 = vec3(0, 0, 0);
    base.vertex1 = vec3(0, 0, 1);
    base.vertex2 = vec3(-1, 0, 1);

    Triangle wall1;
    wall1.vertex0 = vec3(0, 0, 0);
    wall1.vertex1 = vec3(0, 0, 1);
    wall1.vertex2 = vec3(0.5, 1, 0.5);

    Triangle wall2;
    wall2.vertex0 = vec3(0, 0, 1);
    wall2.vertex1 = vec3(-1, 0, 1);
    wall2.vertex2 = vec3(0.5, 1, 0.5);

    Triangle wall3;
    wall3.vertex0 = vec3(0, 0, 0);
    wall3.vertex1 = vec3(-1, 0, 1);
    wall3.vertex2 = vec3(0.5, 1, 0.5);

    Triangle quadrangle[4] = Triangle[4] (
        base, wall1, wall2, wall3
    );

    vec3 lightPosition = vec3(4, 4, -6);
    vec3 lightColor = vec3(1, 1, 1);

    // normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragPosition.xy / resolution.xy;
    
	uv = uv * 2.0 - 1.0; // transform from [0,1] to [-1,1]
    uv.x *= resolution.x / resolution.y; // aspect fix

    vec3 cameraPosition = vec3(0.0, 0.0, 0.0);
    vec3 cameraTarget = vec3(0.0, 0.0, 1.0);
    vec3 cameraDirection = normalize(cameraTarget - cameraPosition);

    vec3 rayStartingPositon = cameraPosition;
    vec3 rayDirection = normalize(cameraDirection + vec3(uv, 0));

    HitData detectedHit;
    detectedHit.rayLength = 9999.0;
    for (int i = 0; i < 4; i++) {
        HitData hitResult = TriangleRayIntersection(rayStartingPositon, rayDirection, quadrangle[i]);
        if (detectedHit.rayLength < hitResult.rayLength) {
            detectedHit.rayLength = hitResult.rayLength;
        }
    }
    
    vec3 diffuse = vec3(0);
    if (detectedHit.rayLength < 9999.0) {
        fragColor = vec4(1.0, 1.0, 0.0, 1.0);
        // vec3 pointHit = (rayStartingPositon + rayDirection * detectedHit.rayLength);
        // float diff = max(dot(detectedHit.normal, rayDirection), 0.0);
        // vec3 diffuse = diff * lightColor;
        // fragColor = vec4(diffuse, 1.0);
    }
    else {
        fragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
    
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

                result.rayLength = resultRayLength;
                result.normal = cross(edge1, edge2);
			}
		}
	}

	return result;
}