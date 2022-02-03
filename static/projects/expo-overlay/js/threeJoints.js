import * as THREE from 'https://cdn.skypack.dev/three@0.137.5'

export default class ThreeJoints {
  constructor(options = {}) {

    this.params = {
      material: null,
      ...options
    }

    this.points = [new THREE.Vector3(- 0, 0, 0), new THREE.Vector3(5, 0, 5)]
    const geometry = new THREE.BufferGeometry().setFromPoints(this.points)
    const line = new THREE.Line(geometry, material)
    this.group = 
  }

  getObject() {

  }

  update() {

  }
}