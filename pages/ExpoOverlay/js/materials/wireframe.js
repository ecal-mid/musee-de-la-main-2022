import { ShaderMaterial, DoubleSide } from "three";

const vertexShader = `
attribute vec3 center;
varying vec3 vCenter;

void main() {

    vCenter = center;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

}`

const fragmentShader = `
uniform float thickness;

varying vec3 vCenter;

void main() {

    vec3 afwidth = fwidth( vCenter.xyz );

    vec3 edge3 = smoothstep( ( thickness - 1.0 ) * afwidth, thickness * afwidth, vCenter.xyz );

    float edge = 1.0 - min( min( edge3.x, edge3.y ), edge3.z );

    gl_FragColor.rgb = gl_FrontFacing ? vec3( 0.9, 0.9, 1.0 ) : vec3( 0.4, 0.4, 0.5 );
    gl_FragColor.a = edge;

}`

export const wireframe1 = new ShaderMaterial({
    uniforms: { 'thickness': { value: 0.01 } },
    vertexShader,
    fragmentShader,
    side: DoubleSide,
    // alphaToCoverage: true // only works when WebGLRenderer's "antialias" is set to "true"
});

wireframe1.extensions.derivatives = true;