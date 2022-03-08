import * as THREE from 'three'

export default THREE.ShaderMaterial.extend(THREE.MeshStandardMaterial, {

  header: 'varying vec3 vColor; uniform vec3 color1; uniform vec3 color2;',

  vertex: {
    '#include <fog_vertex>': 'vColor = mix( color1, color2, texture2D( displacementMap, uv ).x );'
  },
  fragment: {
    'gl_FragColor = vec4( outgoingLight, diffuseColor.a );': 'gl_FragColor.rgb = vColor;'
  },

  material: {
    wireframe: true
  },

  uniforms: {
    displacementMap: YOUR_DISPLACEMENT_TEXTURE,
    displacementScale: 100,
    color1: new THREE.Color('blue'),
    color2: new THREE.Color('yellow')
  }

})