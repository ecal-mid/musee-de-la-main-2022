highp float;

varying vec3 vUv;
uniform vec2 resolution;
uniform sampler2D frame;
uniform vec2 hand_position;

#define PI 3.1415926538
#define TWO_PI 6.2831853071

vec3 radialblur(sampler2D tex, vec2 uv, float dist, float aspect, int sides) {
    vec3 result = vec3(0.);
    float t = 0.;
    aspect = 1. / aspect;

    for(int i = 0; i < sides; i++) {
        t = float(i + 1) * (TWO_PI / float(sides));
        vec2 offset = vec2(sin(t) * dist * aspect, cos(t) * dist);
        float d = .0025;
        float r = texture2D(tex, uv + offset + d).x;
        float g = texture2D(tex, uv + offset).y;
        float b = texture2D(tex, uv + offset - d).z;
        result += vec3(r, g, b);
    }

    result /= float(sides);

    return result;
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    float aspect = resolution.x / resolution.y;
    vec2 wx = vec2(uv.x * aspect, uv.y);

    vec2 ww = wx;
    ww += hand_position - .5;

    float d = .001;
    vec3 prev = radialblur(frame, uv, .001, aspect, 16);
    float alpha = (prev.x + prev.y + prev.z) / 3.;

    gl_FragColor = vec4(prev.x * ww.x, prev.y * 1., prev.z * ww.y, alpha);

    /* gl_FragColor = vec4(prev, alpha); */
    /* gl_FragColor = vec4(0., 0., 2., 0.1); */
}
