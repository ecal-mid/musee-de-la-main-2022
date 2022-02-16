varying vec3 vColor;
varying vec4 vUv;
varying vec4 wuv;
uniform float time;
void main() {
   gl_FragColor = vec4(0, 1.0, 0, 1.0);
   float d = 1. - wuv.z;
   gl_FragColor = vec4(vec3(.2 * d, .6 * d, 1. * d), 1.);
   /* gl_FragColor = vec4(float(int(time * 10.))); */
}