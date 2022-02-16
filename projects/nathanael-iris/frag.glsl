highp float;

const int finger_number = 21;
varying vec3 vUv;
uniform vec2 resolution;
uniform sampler2D prevFrame;
uniform sampler2D debug_tex;
uniform float time;
uniform float stillness;
uniform vec2 mouse[21];
uniform bool mousedown;
uniform vec2 fk;

#define PI 3.1415926538
#define TWO_PI 6.2831853071

float blur(sampler2D tex, vec2 uv, float dist) {
    float result = 0.;

    result += texture2D(tex, vec2(uv.x + dist, uv.y)).x;
    result += texture2D(tex, vec2(uv.x + dist, uv.y - dist)).x;
    result += texture2D(tex, vec2(uv.x - dist, uv.y - dist)).x;
    result += texture2D(tex, vec2(uv.x - dist, uv.y)).x;
    result += texture2D(tex, vec2(uv.x, uv.y + dist)).x;
    result += texture2D(tex, vec2(uv.x + dist, uv.y + dist)).x;
    result += texture2D(tex, vec2(uv.x - dist, uv.y + dist)).x;
    result += texture2D(tex, vec2(uv.x, uv.y - dist)).x;

    result /= 8.;

    return result;
}

float laplacian(sampler2D tex, vec2 uv) {
    float result = 4. * texture2D(tex, uv).x;

    result -= texture2D(tex, vec2(uv.x - 1., uv.y)).x;
    result -= texture2D(tex, vec2(uv.x, uv.y - 1.)).x;
    result -= texture2D(tex, vec2(uv.x + 1., uv.y)).x;
    result -= texture2D(tex, vec2(uv.x, uv.y + 1.)).x;

    return result / 5.;
}

float combined(sampler2D tex, vec2 uv, float dist, float dist2, float aspect, int sides) {
    float result = 0.;
    float t = 0.;
    aspect = 1. / aspect;

    for(int i = 0; i < sides; i++) {
        t = float(i + 1) * (TWO_PI / float(sides));
        vec2 offset = vec2(sin(t) * dist, cos(t) * dist);
        result += texture2D(tex, vec2(uv.x + offset.x * aspect, uv.y + offset.y)).x;
    }

    result /= float(sides);
    /* float blur = result; */
    /* result = blur * 8.; */

    /* result -= texture2D(tex, vec2(uv.x - dist2, uv.y)).x;
    result -= texture2D(tex, vec2(uv.x, uv.y - dist2)).x;
    result -= texture2D(tex, vec2(uv.x + dist2, uv.y)).x;
    result -= texture2D(tex, vec2(uv.x, uv.y + dist2)).x;

    result -= texture2D(tex, vec2(uv.x - dist2, uv.y - dist2)).x;
    result -= texture2D(tex, vec2(uv.x - dist2, uv.y + dist2)).x;
    result -= texture2D(tex, vec2(uv.x + dist2, uv.y + dist2)).x;
    result -= texture2D(tex, vec2(uv.x + dist2, uv.y - dist2)).x; */

    result *= float(sides);
    for(int j = 0; j < sides; j++) {
        t = float(j + 1) * (TWO_PI / float(sides));
        vec2 offset = vec2(sin(t) * dist2, cos(t) * dist2);
        result -= texture2D(tex, vec2(uv.x + offset.x * aspect, uv.y + offset.y)).x;
    }

    for(int i = 0; i < sides; i++) {
        t = float(i + 1) * (TWO_PI / float(sides));
        vec2 offset = vec2(sin(t), cos(t)) * dist * 2.;
        result += texture2D(tex, vec2(uv.x + offset.x * aspect, uv.y + offset.y)).x;
    }
    result /= float(sides);

    /* float laplace = result; */
    return result;
    /* return mix(laplace, blur, lerp); */
}

float radialblur(sampler2D tex, vec2 uv, float dist, int sides) {
    float result = 0.;
    float t = 0.;

    for(int i = 0; i < sides; i++) {
        t = float(i + 1) * (TWO_PI / float(sides));
        vec2 offset = vec2(sin(t) * dist, cos(t) * dist);
        result += texture2D(tex, vec2(uv.x + offset.x, uv.y + offset.y)).x;
    }

    result /= float(sides);

    return result;
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    float aspect = resolution.x / resolution.y;
    vec2 wx = vec2(uv.x * aspect, uv.y);
    vec3 prev = texture2D(prevFrame, uv).xyz;
    vec4 debug = texture2D(debug_tex, wx);

    /* prev.xyz = vec3(radialblur(prevFrame, uv, .01, 16)); */
    /* prev = fk.xxx; */
    /* prev.xyz = vec3(laplacian(prevFrame, uv)); */
    /* prev.xyz = vec3(radialblur(prevFrame, uv, .004, 3)); */
    /* prev.xyz = vec3(combined(prevFrame, uv, fk.x, fk.y, 0., 64)); */
    /* vec2 average = vec2(0.);
    for(int i = 0; i < finger_number; i++) {
        average += mouse[i];
    }
    average /= float(finger_number);
    average.xy = distance(uv, average); */
    float scale = 4.;
    prev.xyz = vec3(combined(prevFrame, uv, 0.0014 * scale, 0.00636 * scale, aspect, 32));
    /* if(prev.x > .5) {
        prev.xyz = vec3(1);
    } else {
        prev.xyz = vec3(0);
    } */
    /* prev.xyz = vec3(smoothstep(prev.x, 0., 0.5) * 2.); */
    prev.xyz -= fk.y;
    prev.xyz += fk.x;

    /* prev.xyz -= uv.x + .5;
    prev.xyz += uv.y + .5; */

    /* prev += debug.xyz * .1; */

    /* prev.xyz =  */

    vec4 color = vec4(vec3(0.), 1.);

    /* float dist = distance(wx, vec2(aspect / 2., (sin(time * .1) + 1.) / 2.));
    dist = step(dist, .005); */
    /* if(time < .5) {
        color.xyz += vec3(dist);
    } */
    /* if(mousedown || true) {
        color.xyz += vec3(cursor) * 2.;
    } */
    float cursor = 0.;
    float cursorGradient = 0.;
    for(int i = 0; i < finger_number; i++) {
        vec2 m = vec2((mouse[i].x / resolution.x) * aspect, 1. - (mouse[i].y / resolution.y));
        /* float cursor = step(distance(wx, m), .01); */
        cursorGradient += distance(wx, m) - .1;
        cursor += step(distance(wx, m), .008) * 5.;
        /* cursor += cursorGradient; */
    }

    cursor /= 4.;
    cursorGradient /= 10.;
    color.xyz += vec3(cursor);
    prev.xyz += (1. - cursorGradient) * .001;
    color.xyz += prev.xyz;
    float hand_factor = (1.25 - cursorGradient) * 2. * (stillness);
    hand_factor = clamp(hand_factor, 0., 1.);
    color.xyz *= hand_factor;

    /* gl_FragColor = vec4(wx.x, wx.y, 0., 1.); */
    gl_FragColor = vec4(color.xxx, 1.);
    /* gl_FragColor = vec4(hand_factor); */
    /* gl_FragColor = vec4(stillness); */
    /* gl_FragColor = vec4(1. - cursorGradient); */
    /* gl_FragColor = vec4(1.); */
    /* gl_FragColor = vec4(dot(color.xyz, vec3(1.))); */
    /* gl_FragColor = vec4(cursorGradient); */
    /* gl_FragColor = vec4(cursor); */
    /* gl_FragColor = vec4(m.x * 2.); */
    /* gl_FragColor = debug; */
}
