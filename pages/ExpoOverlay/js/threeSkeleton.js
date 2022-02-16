import * as THREE from 'three'

export default class ThreeSkeleton {
  constructor(options = {}) {

    this.params = {
      material: null,
      ...options
    }

    this.group = new THREE.Group()
    this.landmarks = {}

    // shoulders
    this.addLine('RIGHT_SHOULDER', 'LEFT_SHOULDER')
    // hands
    this.addLine('LEFT_SHOULDER', 'LEFT_ELBOW', 'LEFT_WRIST')
    this.addLine('RIGHT_SHOULDER', 'RIGHT_ELBOW', 'RIGHT_WRIST')
    // feets
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
      bufferPoint.updatePosition(pose[name])
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

  updatePosition({ x, y, z }) {
    this.position.set(x, y, z)
    this.buffers.forEach(({ geometry, index }) => {
      const { array } = geometry.attributes.position
      geometry.attributes.position.needsUpdate = true
      let i = index * 3
      array[i++] = x
      array[i++] = y
      array[i++] = z
    })
  }
}