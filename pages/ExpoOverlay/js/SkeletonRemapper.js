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

        this.points = {}
        this.addedPointKeys = []
        this.updaters = []
        this.debugPoints = []
        this.mirror = true

        this.group = new THREE.Group()

        const red = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const geometry = new THREE.SphereGeometry(0.01, 6, 6);

        LANDMARK_KEYS.forEach(name => {
            const sphere = new THREE.Mesh(geometry, red);

            this.points[name] = sphere.position
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
                // "NOSE",
                // "LEFT_EYE_INNER",
                // "LEFT_EYE",
                // "LEFT_EYE_OUTER",
                // "RIGHT_EYE_INNER",
                // "RIGHT_EYE",
                // "RIGHT_EYE_OUTER",
                // "LEFT_EAR",
                // "RIGHT_EAR",
                // "LEFT_RIGHT",
                // "RIGHT_LEFT",
                // "LEFT_SHOULDER",
                // "RIGHT_SHOULDER",
                // "LEFT_ELBOW",
                // "RIGHT_ELBOW",
                // "LEFT_WRIST",
                // "RIGHT_WRIST",
                // "LEFT_PINKY",
                // "RIGHT_PINKY",
                // "LEFT_INDEX",
                // "RIGHT_INDEX",
                // "LEFT_THUMB",
                // "RIGHT_THUMB",
                // "LEFT_HIP",
                // "RIGHT_HIP",
                // "LEFT_KNEE",
                // "RIGHT_KNEE",
                // "LEFT_ANKLE",
                // "RIGHT_ANKLE",
                // "LEFT_HEEL",
                // "RIGHT_HEEL",
                // "LEFT_FOOT_INDEX",
                // "RIGHT_FOOT_INDEX"
            ].forEach(name => {
                const point = this.points[name]
                if (!point) return
                this.debugPoints.push(new DebugPoint({ point, name, parent: this.group, material: RED }))
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
                const point = this.points[name]
                if (!point) {
                    return
                }
                this.debugPoints.push(new DebugPoint({ point, name, parent: this.group, material: GREEN }))
            })
    }

    offsetPoint({ targetKey, name, multiplier = [1, 1, 1] }) {

        if (name in this.points) return

        multiplier = Array.isArray(multiplier) ? new THREE.Vector3(...multiplier) : multiplier;

        const targetPoint = this.points[targetKey]
        const pointOffset = new PointOffset({ targetPoint, multiplier })
        const { point } = pointOffset
        this.points[name] = point
        this.updaters.push(pointOffset)
        // this.debugPoints.push(new DebugPoint({ point, name, parent: this.group }))
    }

    constructJoint({ keyA, keyB, newKeys }) {

        const { [keyA]: pointA, [keyB]: pointB } = this.points
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
            if (key in this.points) console.error(`${key} already exists!`, this.points)
            this.points[key] = point
            // this.debugPoints.push(new DebugPoint({ point, parent: this.group, material: RED }))
            //! this.addedPointKeys.push(key)
            return { point, interpolation }
        })

        const newJoint = new Joint({ pointA, pointB, newPoints })
        this.updaters.push(newJoint)


        return newJoint
    }

    getPose() {
        return MIXAMO_LANDMARKS.forEach(key => this.points[key])
    }

    addTo(scene) {
        scene.add(this.group)
    }

    update(pose) {

        const isVisible = Boolean(pose)
        const scaleFactor = 1.5
        const mirrorFactor = this.mirror ? -1 : 1
        const translationY = 1

        this.group.visible = isVisible

        if (!isVisible) return

        LANDMARK_KEYS.forEach((name) => {
            const position = this.points[name]
            const { x, y, z } = pose[name]

            position.set(
                x * scaleFactor * mirrorFactor,
                -y * scaleFactor + translationY,
                -z * scaleFactor
            )
        })

        this.updaters.forEach(joint => {
            joint.update()
        })

        this.debugPoints.forEach(point => point.update())
        // console.log(this.points["BETWEEN_HIPS"])
        // this.target.position.copy(this.points["BETWEEN_HIPS"])

        // this.landmarks['RIGHT_WRIST'].getWorldPosition(this.target.position)

    }
}