import * as THREE from 'https://cdn.skypack.dev/three@0.137.5'
// import ThreeJoints from 'ThreeJoints'

export default class ThreeSkeleton {
  constructor(options = {}) {

    this.params = {
      material: null,
      ...options
    }

    this.group = new THREE.Group()
    this.landmarks = {}
    this.addLine('RIGHT_SHOULDER', 'LEFT_SHOULDER')
    // hands
    this.addLine('LEFT_SHOULDER', 'LEFT_ELBOW', 'LEFT_WRIST')
    this.addLine('RIGHT_SHOULDER', 'RIGHT_ELBOW', 'RIGHT_WRIST')
    // feets
    this.addLine('LEFT_SHOULDER', 'LEFT_ELBOW', 'LEFT_WRIST')
    this.addLine('LEFT_SHOULDER', 'LEFT_ELBOW', 'LEFT_WRIST')
    
    this.addLine('LEFT_HIP', 'LEFT_KNEE', 'LEFT_ANKLE')
    this.addLine('RIGHT_HIP', 'RIGHT_KNEE', 'RIGHT_ANKLE')

  }

  getObject() {
    return this.group
  }

  update(pose) {
    const poseVisible = Boolean(pose)
    this.group.visible = poseVisible
    if (!poseVisible) return

    Object.entries(this.landmarks).forEach(([name, bufferPoint]) => {
      const { x, y, z } = pose[name]
      bufferPoint.position.set(x, y, z)
      bufferPoint.buffers.forEach(({ geometry, index }) => {
        const { array } = geometry.attributes.position
        geometry.attributes.position.needsUpdate = true
        let i = index * 3
        array[i++] = x
        array[i++] = y
        array[i++] = z
      })
    })
  }

  addLine(...names) {
    const geometry = new THREE.BufferGeometry()
    const positions = names.map((name, index) => {
      const landmark = this.getCreateLandmark(name)
      landmark.addAtIndex(geometry, index)
      return landmark.position
    })
    geometry.setFromPoints(positions)
    this.group.add(new THREE.Line(geometry, this.params.material))
  }

  getCreateLandmark(name) {
    return this.landmarks[name] = this.landmarks[name] || new BufferPoint()
  }
}

class BufferPoint {
  constructor() {
    this.position = new THREE.Vector3
    this.buffers = []
  }

  addAtIndex(geometry, index) {
    this.buffers.push({ geometry, index })
  }
}

// MEDIA_PIPE_BODY_PARTS = {
//   NOSE: { x: 0, y: 0, z: 0, visibility: 0 },
//   LEFT_EYE_INNER: { x: 0, y: 0, z: 0, visibility: 0 },
//   LEFT_EYE: { x: 0, y: 0, z: 0, visibility: 0 },
//   LEFT_EYE_OUTER: { x: 0, y: 0, z: 0, visibility: 0 },
//   RIGHT_EYE_INNER: { x: 0, y: 0, z: 0, visibility: 0 },
//   RIGHT_EYE: { x: 0, y: 0, z: 0, visibility: 0 },
//   RIGHT_EYE_OUTER: { x: 0, y: 0, z: 0, visibility: 0 },
//   LEFT_EAR: { x: 0, y: 0, z: 0, visibility: 0 },
//   RIGHT_EAR: { x: 0, y: 0, z: 0, visibility: 0 },
//   LEFT_RIGHT: { x: 0, y: 0, z: 0, visibility: 0 },
//   RIGHT_LEFT: { x: 0, y: 0, z: 0, visibility: 0 },
//   LEFT_SHOULDER: { x: 0, y: 0, z: 0, visibility: 0 },
//   RIGHT_SHOULDER: { x: 0, y: 0, z: 0, visibility: 0 },
//   LEFT_ELBOW: { x: 0, y: 0, z: 0, visibility: 0 },
//   RIGHT_ELBOW: { x: 0, y: 0, z: 0, visibility: 0 },
//   LEFT_WRIST: { x: 0, y: 0, z: 0, visibility: 0 },
//   RIGHT_WRIST: { x: 0, y: 0, z: 0, visibility: 0 },
//   LEFT_PINKY: { x: 0, y: 0, z: 0, visibility: 0 },
//   RIGHT_PINKY: { x: 0, y: 0, z: 0, visibility: 0 },
//   LEFT_INDEX: { x: 0, y: 0, z: 0, visibility: 0 },
//   RIGHT_INDEX: { x: 0, y: 0, z: 0, visibility: 0 },
//   LEFT_THUMB: { x: 0, y: 0, z: 0, visibility: 0 },
//   RIGHT_THUMB: { x: 0, y: 0, z: 0, visibility: 0 },
//   LEFT_HIP: { x: 0, y: 0, z: 0, visibility: 0 },
//   RIGHT_HIP: { x: 0, y: 0, z: 0, visibility: 0 },
//   LEFT_KNEE: { x: 0, y: 0, z: 0, visibility: 0 },
//   RIGHT_KNEE: { x: 0, y: 0, z: 0, visibility: 0 },
//   LEFT_ANKLE: { x: 0, y: 0, z: 0, visibility: 0 },
//   RIGHT_ANKLE: { x: 0, y: 0, z: 0, visibility: 0 },
//   LEFT_HEEL: { x: 0, y: 0, z: 0, visibility: 0 },
//   RIGHT_HEEL: { x: 0, y: 0, z: 0, visibility: 0 },
//   LEFT_FOOT_INDEX: { x: 0, y: 0, z: 0, visibility: 0 },
//   RIGHT_FOOT_INDEX: { x: 0, y: 0, z: 0, visibility: 0 }
// }