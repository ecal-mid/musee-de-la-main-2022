import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { MediaPipePose } from '@ecal-mid/mediapipe'

import { MIXAMO_LANDMARKS } from './landmarks.js'

import * as SceneUtils from 'three/examples/jsm/utils/SceneUtils.js'
import * as THREE from 'three'

import { wireframe1 } from '../materials/wireframe'
import TextLandmark from '../texts/TextLandmark.js'

import { NO_OP } from '../utils/object.js'

const DEBUG_MODE = true

const POSE_LANDMARKS_NAMES = Object.keys(MediaPipePose.POSE_LANDMARKS)
const REQUIRED = Symbol('required'),
    EMPTY = Symbol('empty')

const loader = new FBXLoader()

export default class Model {
    constructor(params = {}) {
        this.params = {
            model: REQUIRED,
            skinnedMesh: REQUIRED,
            allActions: [],
            mixer: null,
            clock: new THREE.Clock(),
            debug: DEBUG_MODE,
            manualControl: true,
            ...params
        }

        this.mixer = new THREE.AnimationMixer(this.params.skinnedMesh);
        this.mixer.addEventListener('finished', (e) => {
            console.log(e, 'lol')
        });
        this.currentAction = null

        const animations = extractClips(this.params.model)
        this.idleAction = animations[0]
        this.play(this.idleAction, { loop: true });

        this.texts = {}
        this.group = new THREE.Group()


        this.setupTexts()
        this.setupHelper()
    }

    addTo(scene) {
        const { group } = this

        group.add(this.params.model)
        group.add(this.params.helper)

        Object.values(this.texts).forEach(text => text.addTo(group))

        this.params.scene = scene

        scene.add(this.group)
    }

    destroy() {
        this.group.parent.remove(this.group)
    }

    update(pose) {
        const { model, gltf, clock, helper } = this.params
        this.mixer.update(clock.getDelta())


        return;


        const isVisible = Boolean(pose)
        this.group.visible = isVisible

        // gltf.animations.forEach((clip, index) => {
        //     // const action = this.params.allActions[i];
        //     // const clip = action.getClip();
        //     // const settings = CHOSEN_MODEL.baseActions[clip.name] || CHOSEN_MODEL.additiveActions[clip.name];
        //     // settings.weight = action.getEffectiveWeight();
        // })

        const mixerUpdateDelta = clock.getDelta()
        // mixer.update(mixerUpdateDelta)

        const { manualControl, scene, skinnedMesh } = this.params

        if (!manualControl || !pose) return


        var correctedUp = new THREE.Vector3(0, 1, 0)
        var axis = new THREE.Vector3(1, 0, 0)
        correctedUp.applyAxisAngle(axis, -Math.PI / 2)

        skinnedMesh.skeleton.bones.forEach((bone, index) => {
            const { name, parent } = bone

            // if (index >= 1) return
            const childName = bone.children[0]?.name
            const { point } = pose[name]

            // this.texts[name].update({ position: point, visibility })
            // console.log(bone, childName);

            // up: Vector3 {x: 0, y: 1, z: 0}

            if (childName) {

                // if (index <= 3) {
                scene.attach(bone) // detach from parent and add to scene
                bone.updateMatrixWorld()

                bone.position.copy(point)
                if (name === "mixamorig_Hips") {
                    // console.log(pose[name])
                }

                const child = pose[childName].point


                bone.up.copy(correctedUp)
                bone.lookAt(child)
                bone.up.set(0, 1, 0)
                bone.rotateX(Math.PI / 2)

                parent.attach(bone)
                bone.updateMatrix()
            }
            // }
        })

        POSE_LANDMARKS_NAMES.forEach(name => {
            this.texts[name].update(pose[name])
        })
    }

    setupTexts() {
        POSE_LANDMARKS_NAMES.forEach(name => {
            this.texts[name] = new TextLandmark()
        })
    }

    setupHelper() {
        const helper = new THREE.SkeletonHelper(this.params.model)
        helper.visible = true
        this.params.helper = helper
    }

    static async fromFile(path) {

        const model = await asyncLoad(loader, path)

        // const model = gltf.scene
        let skinnedMesh = EMPTY
        // //! scene.add(model);

        // // console.log(gltf)

        const lineMaterial = new THREE.MeshPhongMaterial({
            // skinning: true,
            color: 0xffffff,
            wireframe: true,
            linewidth: 2
        })

        model.traverse((object) => {
            if (!object.isMesh) return

            //* skinned mesh
            object.castShadow = false

            if (object.constructor.name === 'SkinnedMesh') {
                skinnedMesh = object
            }

            object.material = lineMaterial
        })

        // console.log(skinnedMesh.geometry)

        return new this({ model, skinnedMesh })

    }

    static async loadClipsFromFBX(path, names = []) {

        const model = await asyncLoad(loader, path)

        return extractClips(model, (animation, index) => {
            const name = names[index]
            if (name) animation.name = name
        })

    }

    play(animationClip, options = { loop: false }) {
        const { mixer } = this
        const delay = 0.1 //? seconds
        // mixer.stopAllAction()


        // this.idleAction.fadeOut = 1

        // const oldAction = mixer.existingAction(animationClip)
        // if (oldAction) oldAction.stop()

        const action = mixer.existingAction(animationClip) || mixer.clipAction(animationClip);


        console.log(mixer.existingAction(animationClip), animationClip)
        action.play()
        action.setLoop(options.loop ? THREE.LoopRepeat : THREE.LoopOnce)

        if (this.currentAction) this.currentAction.crossFadeTo(action, delay)

        if (!options.loop) {
            clearTimeout(this.mixerTimeout)
            this.mixerTimeout = setTimeout(() => action.crossFadeTo(this.idleAction, delay), Math.max(0, action.duration - delay))
        }


        this.currentAction = action
    }

}

async function asyncLoad(loader, path) {
    return new Promise((resolve, reject) => {
        loader.load(path, resolve)
    })
}

function extractClips(model, callback = NO_OP) {
    return model.animations.map((animation, index, animations) => { callback(animation, index, animations); return animation })
}