import { MediaPipePose } from '@ecal-mid/mediapipe'
import * as THREE from 'three'

import DebugPoint from './DebugPoint.js'
import Joint from './Joint.js'
import { RED, GREEN } from './materials.js'
import PointOffset from './PointOffset.js'
import { MIXAMO_LANDMARKS } from '../landmarks.js';

const LANDMARK_KEYS = Object.keys(MediaPipePose.POSE_LANDMARKS)

console.log(LANDMARK_KEYS)

export default class SkeletonRemapper {
    constructor() {

        this.landmarks = {} // { THREE.Vector3, visibility }
        this.addedPointKeys = []
        this.updaters = []
        this.debugPoints = []
        this.mirror = true

        this.group = new THREE.Group()

        const red = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const geometry = new THREE.SphereGeometry(0.01, 6, 6);

        LANDMARK_KEYS.forEach(name => {
            const sphere = new THREE.Mesh(geometry, red);

            this.landmarks[name] = new Landmark(sphere.position)
            // this.group.add(sphere)
        })

        // mirroring
        const mixamo = 'mixamorig_'
        const mirrorSchema = [
            { mediapipe: 'LEFT_', mixamo: `${mixamo}Left` },
            { mediapipe: 'RIGHT_', mixamo: `${mixamo}Right` }
        ]

        mirrorSchema.forEach(({ mediapipe, mixamo }) => {

            // arms
            this.offsetPoint({ targetKey: `${mediapipe}SHOULDER`, name: `${mixamo}Arm` })
            this.offsetPoint({ targetKey: `${mediapipe}ELBOW`, name: `${mixamo}ForeArm` })
            this.offsetPoint({ targetKey: `${mediapipe}WRIST`, name: `${mixamo}Hand` })

            // legs
            this.offsetPoint({ targetKey: `${mediapipe}HIP`, name: `${mixamo}UpLeg` })
            this.offsetPoint({ targetKey: `${mediapipe}KNEE`, name: `${mixamo}Leg` })
            this.offsetPoint({ targetKey: `${mediapipe}ANKLE`, name: `${mixamo}Foot` })
            // this.offsetPoint({ targetKey: `${mediapipe}HEEL`, name: `${mixamo}Foot` })
            this.offsetPoint({ targetKey: `${mediapipe}FOOT_INDEX`, name: `${mixamo}ToeBase` })

            this.constructJoint({
                keyA: `${mediapipe}HEEL`,
                keyB: `${mixamo}ToeBase`,
                newKeys: [[`${mixamo}Toe_End`, 1.1]],
            })
        })

        this.offsetPoint({ targetKey: `LEFT_WRIST`, name: `mixamorig_LeftHand` })

        this.constructJoint({
            keyA: "mixamorig_LeftUpLeg",
            keyB: "mixamorig_RightUpLeg",
            newKeys: [["CENTER_HIPS", 0.5]],
        })

        this.constructJoint({
            keyA: "mixamorig_LeftArm",
            keyB: "mixamorig_RightArm",
            newKeys: [
                ["mixamorig_LeftShoulder", 0.35],
                ["CENTER_SHOULDERS", 0.5],
                ["mixamorig_RightShoulder", 1 - 0.35],
            ]
        })

        this.constructJoint({
            keyA: "CENTER_HIPS",
            keyB: "CENTER_SHOULDERS",
            newKeys: [
                ["mixamorig_Hips", 0.1],
                ["mixamorig_Spine", 0.3],
                ["mixamorig_Spine1", 0.6],
                ["mixamorig_Spine2", 0.9],
                ["mixamorig_Neck", 1.05],
                ["mixamorig_Head", 1.15],
                ["mixamorig_HeadTop_End", 1.35],
            ]
        })

            ;[
                "NOSE",
                "LEFT_EYE_INNER",
                "LEFT_EYE",
                "LEFT_EYE_OUTER",
                "RIGHT_EYE_INNER",
                "RIGHT_EYE",
                "RIGHT_EYE_OUTER",
                "LEFT_EAR",
                "RIGHT_EAR",
                "LEFT_RIGHT",
                "RIGHT_LEFT",
                "LEFT_SHOULDER",
                "RIGHT_SHOULDER",
                "LEFT_ELBOW",
                "RIGHT_ELBOW",
                "LEFT_WRIST",
                "RIGHT_WRIST",
                "LEFT_PINKY",
                "RIGHT_PINKY",
                "LEFT_INDEX",
                "RIGHT_INDEX",
                "LEFT_THUMB",
                "RIGHT_THUMB",
                "LEFT_HIP",
                "RIGHT_HIP",
                "LEFT_KNEE",
                "RIGHT_KNEE",
                "LEFT_ANKLE",
                "RIGHT_ANKLE",
                "LEFT_HEEL",
                "RIGHT_HEEL",
                "LEFT_FOOT_INDEX",
                "RIGHT_FOOT_INDEX"
            ].forEach(name => {
                const obj = this.landmarks[name]
                if (!obj) return
                // this.debugPoints.push(new DebugPoint({ point: obj.point, name, parent: this.group, material: RED }))
            })

            ;[
                "mixamorig_Hips",
                "mixamorig_Spine",
                "mixamorig_Spine1",
                "mixamorig_Spine2",
                "mixamorig_Neck",
                "mixamorig_Head",
                "mixamorig_HeadTop_End",
                "mixamorig_LeftShoulder",
                "mixamorig_LeftArm",
                "mixamorig_LeftForeArm",
                "mixamorig_LeftHand",
                "mixamorig_RightShoulder",
                "mixamorig_RightArm",
                "mixamorig_RightForeArm",
                "mixamorig_RightHand",
                "mixamorig_LeftUpLeg",
                "mixamorig_LeftLeg",
                "mixamorig_LeftFoot",
                "mixamorig_LeftToeBase",
                "mixamorig_LeftToe_End",
                "mixamorig_RightUpLeg",
                "mixamorig_RightLeg",
                "mixamorig_RightFoot",
                "mixamorig_RightToeBase",
                "mixamorig_RightToe_End"
            ].forEach(name => {
                const obj = this.landmarks[name]
                // console.log(obj)
                if (!obj) return
                this.debugPoints.push(new DebugPoint({ point: obj.point, name, parent: this.group, material: GREEN }))
            })
    }

    offsetPoint({ targetKey, name, multiplier = [1, 1, 1] }) {

        if (name in this.landmarks) return

        multiplier = Array.isArray(multiplier) ? new THREE.Vector3(...multiplier) : multiplier;

        const targetPoint = this.landmarks[targetKey].point
        const pointOffset = new PointOffset({ targetPoint, multiplier })
        const { point } = pointOffset
        this.landmarks[name] = new Landmark(point)
        this.updaters.push(pointOffset)
        // this.debugPoints.push(new DebugPoint({ point, name, parent: this.group }))
    }

    constructJoint({ keyA, keyB, newKeys }) {

        const { [keyA]: objA, [keyB]: objB } = this.landmarks
        const mapRange = newKeys.length + 1

        const newPoints = newKeys.map((entry, index) => {
            let key, interpolation;

            if (Array.isArray(entry)) {
                [key, interpolation] = entry
                if (isNaN(interpolation)) console.error(`Interpolation is not set for point ${key}`)
            } else {
                key = entry
                interpolation = THREE.MathUtils.mapLinear(index + 1, 0, mapRange, 0, 1);
            }

            const point = new THREE.Vector3()
            if (key in this.landmarks) console.error(`${key} already exists!`, this.landmarks)
            this.landmarks[key] = new Landmark(point)
            // this.debugPoints.push(new DebugPoint({ point, parent: this.group, material: RED }))
            //! this.addedPointKeys.push(key)
            return { point, interpolation }
        })

        const newJoint = new Joint({ pointA: objA.point, pointB: objB.point, newPoints })
        this.updaters.push(newJoint)


        return newJoint
    }

    getPose() {
        // return MIXAMO_LANDMARKS.map(key => this.landmarks[key])
        return this.landmarks
    }

    addTo(scene) {
        scene.add(this.group)
    }

    update(pose) {

        const isVisible = Boolean(pose)
        const scaleFactor = 1.5
        const mirrorFactor = 1
        const translationY = 1

        this.group.visible = isVisible

        if (!isVisible) return

        LANDMARK_KEYS.forEach((name) => {
            const landmark = this.landmarks[name]
            const { x, y, z, visibility } = pose[name]

            landmark.setPosition(
                x * scaleFactor * mirrorFactor,
                -y * scaleFactor + translationY,
                -z * scaleFactor
            )
            landmark.setVisibility(visibility)
        })

        this.updaters.forEach(joint => {
            joint.update()
        })

        this.debugPoints.forEach(point => point.update())

        return this.getPose()
        // console.log(this.landmarks["BETWEEN_HIPS"])
        // this.target.position.copy(this.landmarks["BETWEEN_HIPS"])

        // this.landmarks['RIGHT_WRIST'].getWorldPosition(this.target.position)

    }
}

class Landmark {
    constructor(point, visibility = null) {
        this.point = point
        this.visibility = visibility
    }
    setPosition(x, y, z) {
        this.point.set(x, y, z)
    }
    setVisibility(visibility) {
        this.visibility = visibility
    }
}