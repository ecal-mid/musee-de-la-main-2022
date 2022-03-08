import { deepCloneObject } from "../utils/object"
import * as THREE from 'three'

import * as SkeletonUtils from '../SkeletonUtils.js'

const lerp = THREE.MathUtils.lerp

const geometry = new THREE.SphereGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })

const correctedUp = new THREE.Vector3(0, 1, 0)
const axis = new THREE.Vector3(1, 0, 0)
correctedUp.applyAxisAngle(axis, -Math.PI / 2)
correctedUp.set(0, 1, 0)

const defaults = {
  scale: 200,
  mirrored: false,
  landmarks: [
    // { name: "NOSE", target: "NOSE" },
    // { name: "LEFT_EYE_INNER", target: "LEFT_EYE_INNER" },
    // { name: "LEFT_EYE", target: "LEFT_EYE" },
    // { name: "LEFT_EYE_OUTER", target: "LEFT_EYE_OUTER" },
    // { name: "RIGHT_EYE_INNER", target: "RIGHT_EYE_INNER" },
    // { name: "RIGHT_EYE", target: "RIGHT_EYE" },
    // { name: "RIGHT_EYE_OUTER", target: "RIGHT_EYE_OUTER" },
    // { name: "LEFT_EAR", target: "LEFT_EAR" },
    // { name: "RIGHT_EAR", target: "RIGHT_EAR" },
    // { name: "LEFT_RIGHT", target: "LEFT_RIGHT" },
    // { name: "RIGHT_LEFT", target: "RIGHT_LEFT" },
    { name: "mixamorigLeftArm", target: "LEFT_SHOULDER" },
    { name: "mixamorigLeftForeArm", target: "LEFT_ELBOW" },
    { name: "mixamorigLeftHand", target: "LEFT_WRIST" },

    { name: "mixamorigRightArm", target: "RIGHT_SHOULDER" },
    { name: "mixamorigRightForeArm", target: "RIGHT_ELBOW" },
    { name: "mixamorigRightHand", target: "RIGHT_WRIST" },

    { name: "mixamorigLeftUpLeg", target: "LEFT_HIP" },
    { name: "mixamorigLeftLeg", target: "LEFT_KNEE" },
    { name: "mixamorigLeftFoot", target: "LEFT_ANKLE" },

    { name: "mixamorigRightUpLeg", target: "RIGHT_HIP" },
    { name: "mixamorigRightLeg", target: "RIGHT_KNEE" },
    { name: "mixamorigRightFoot", target: "RIGHT_ANKLE" },
    // { name: "RIGHT_SHOULDER", target: "RIGHT_SHOULDER" },
    // { name: "RIGHT_ELBOW", target: "RIGHT_ELBOW" },
    // { name: "RIGHT_WRIST", target: "RIGHT_WRIST" },
    // { name: "LEFT_PINKY", target: "LEFT_PINKY" },
    // { name: "RIGHT_PINKY", target: "RIGHT_PINKY" },
    // { name: "LEFT_INDEX", target: "LEFT_INDEX" },
    // { name: "RIGHT_INDEX", target: "RIGHT_INDEX" },
    // { name: "LEFT_THUMB", target: "LEFT_THUMB" },
    // { name: "RIGHT_THUMB", target: "RIGHT_THUMB" },
    // { name: "LEFT_HIP", target: "LEFT_HIP" },
    // { name: "RIGHT_HIP", target: "RIGHT_HIP" },
    // { name: "LEFT_KNEE", target: "LEFT_KNEE" },
    // { name: "RIGHT_KNEE", target: "RIGHT_KNEE" },
    // { name: "LEFT_ANKLE", target: "LEFT_ANKLE" },
    // { name: "RIGHT_ANKLE", target: "RIGHT_ANKLE" },
    // { name: "LEFT_HEEL", target: "LEFT_HEEL" },
    // { name: "RIGHT_HEEL", target: "RIGHT_HEEL" },
    // { name: "LEFT_FOOT_INDEX", target: "LEFT_FOOT_INDEX" },
    // { name: "RIGHT_FOOT_INDEX", target: "RIGHT_FOOT_INDEX" }

    // { name: "HIPS", target: "RIGHT_HIP", target2: "LEFT_HIP" },
    // { name: "NECK", target: "LEFT_SHOULDER", target2: "RIGHT_SHOULDER" },
  ],
  //   'NOSE': {target: 'lol', }
  // }
}

export default class SkeletonRemapper {
  constructor(options = {}) {

    this.options = { ...deepCloneObject(defaults), options }
    this.group = new THREE.Group()

    this.elements = {}

    this.options.landmarks.forEach(landmark => {
      const { name } = landmark
      const element = new THREE.Mesh(geometry, material)
      this.elements[name] = element
      element.visible = false
      this.group.add(element)
    })

    // const sc = this.options.scale
    // this.group.scale.set(sc, sc, sc)
  }

  update(pose, skeleton, amt = 1) {
    if (!pose) return

    this.positionElements(pose)

    this.retarget(skeleton, "mixamorigLeftArm", "mixamorigLeftForeArm", amt)
    this.retarget(skeleton, "mixamorigLeftForeArm", "mixamorigLeftHand", amt)

    this.retarget(skeleton, "mixamorigRightArm", "mixamorigRightForeArm", amt)
    this.retarget(skeleton, "mixamorigRightForeArm", "mixamorigRightHand", amt)

    this.retarget(skeleton, "mixamorigLeftUpLeg", "mixamorigLeftLeg", amt)
    this.retarget(skeleton, "mixamorigLeftLeg", "mixamorigLeftFoot", amt)

    this.retarget(skeleton, "mixamorigRightUpLeg", "mixamorigRightLeg", amt)
    this.retarget(skeleton, "mixamorigRightLeg", "mixamorigRightFoot", amt)

    // { name: "mixamorigLeftUpLeg", target: "LEFT_HIP" },
    // { name: "mixamorigLeftLeg", target: "LEFT_KNEE" },
    // { name: "mixamorigLeftFoot", target: "LEFT_ANKLE" },
    // this.positionElements(pose)
    // Object.values(pose).forEach(([name, value]) => {

    // })
    // return pose
  }

  positionElements(pose) {
    const { scale, mirrored, landmarks } = this.options
    const mirror = mirrored ? -1 : 1

    landmarks.forEach(landmark => {
      const { name, target, target2, amt = 0.5 } = landmark
      const element = this.elements[name]
      let { x, y, z } = getTarget(pose, target)

      if (target2) {
        const pos = getTarget(pose, target2)

        x = lerp(x, pos.x, amt)
        y = lerp(y, pos.y, amt)
        z = lerp(z, pos.z, amt)
      }

      this.group.attach(element)

      element.position.set(
        x * scale * mirror,
        -y * scale,
        -z * scale
      )
    })
  }

  retarget(skeleton, originName, targetName, amt) {

    const origin = tempClone(this.elements[originName])
    const target = tempClone(this.elements[targetName])

    const bone = SkeletonUtils.getBoneByName(originName, skeleton)

    origin.attach(target)
    bone.attach(origin)
    origin.position.set(0, 0, 0)

    const pos = target.getWorldPosition(new THREE.Vector3())

    // var vector = new THREE.Vector3(0, 0, 1)
    // var axis = new THREE.Vector3(1, 0, 0)
    // var angle = Math.PI / 2
    // vector.applyAxisAngle(axis, angle)

    bone.up.copy(correctedUp)
    // const rotation = bone.
    // var qm = new THREE.Quaternion()
    // THREE.Quaternion.slerp(camera.quaternion, destRotation, qm, 0.07)
    // camera.quaternion = qm
    // camera.quaternion.normalize()

    const oldAngle = bone.quaternion.clone()

    bone.lookAt(pos)
    bone.up.set(0, 1, 0)
    bone.rotateX(Math.PI / 2)

    bone.quaternion.slerp(oldAngle, 1 - amt)

    origin.removeFromParent()
    target.removeFromParent()
    // var axis = new THREE.Vector3(0, 0, 1)
    // var angle = Math.PI / 2
    // bone.up.applyAxisAngle(axis, angle)

    // console.log(bone.up);

    // bone.lookAt(pos)
    // bone.up.set(0, 1, 0)
    // bone.rotateX(Math.PI / 2)

    // bone.rotation.x = 0;
    // bone.rotation.y = 0;
    // bone.rotation.z = 0;


    // this.group.attach(target)
    // this.group.attach(origin)

    // origin.position.copy(oPos)
    // target.position.copy(tPos)
  }

  addTo(parent) {
    parent.add(this.group)
  }


}

function getTarget(pose, targetName) {
  let target = pose[targetName]
  if (target) return target

  return this.elements[targetName].position
}

function tempClone(orig) {
  const object = new THREE.Object3D()
  orig.parent.attach(object)
  object.position.copy(orig.position)
  return object
}