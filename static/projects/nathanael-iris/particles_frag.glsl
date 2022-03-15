varying vec3 vColor;
varying vec4 vUv;
varying vec4 wuv;
uniform float time;
void main() {
   gl_FragColor = vec4(.1, .4, .9, 1.0);
   float d = 1. - wuv.z;
   d -= .2;
   gl_FragColor *= d *.9;
   /* gl_FragColor = vec4(vec3(.1 * d, .5 * d, .9 * d), 1.); */
   /* gl_FragColor = vec4(vec3(d), 1.); */
   /* gl_FragColor = vec4(float(int(time * 10.))); */
}