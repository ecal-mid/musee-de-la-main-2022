import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three'

const REQUIRED = Symbol('required'),
    EMPTY = Symbol('empty')

const loader = new GLTFLoader();

const DEBUG_MODE = true;

const NO_OP = () => { }

export default class Model {
    constructor(params = {}) {
        this.params = {
            model: REQUIRED,
            gltf: REQUIRED,
            skinnedMesh: REQUIRED,
            allActions: [],
            mixer: null,
            clock: new THREE.Clock(),
            debug: DEBUG_MODE,
            ...params
        }

        this.setupAnimations()
        this.setupHelper()
    }

    addTo(scene) {
        scene.add(this.params.model)
        scene.add(this.params.helper)
        this.params.scene = scene
    }

    destroy() {
        scene.remove(this.params.model)
        scene.remove(this.params.helper)
    }

    update(pose) {

        const { model, gltf, mixer, clock, helper } = this.params

        // const isVisible = Boolean(pose)
        model.visible = false
        // helper.visible = isVisible

        gltf.animations.forEach((clip, index) => {
            // const action = this.params.allActions[i];
            // const clip = action.getClip();
            // const settings = CHOSEN_MODEL.baseActions[clip.name] || CHOSEN_MODEL.additiveActions[clip.name];
            // settings.weight = action.getEffectiveWeight();
        })

        const mixerUpdateDelta = clock.getDelta();
        mixer.update(mixerUpdateDelta);
    }

    setupHelper() {
        const helper = new THREE.SkeletonHelper(this.params.model);
        helper.visible = true;
        this.params.helper = helper
    }

    setupAnimations() {

        //! skeleton = new THREE.SkeletonHelper(model);
        const { gltf, model, allActions, skinnedMesh } = this.params
        // skeleton.visible = true;
        // scene.add(skeleton);

        const animations = gltf.animations;
        const mixer = new THREE.AnimationMixer(model);
        // console.log(model)
        // numAnimations = animations.length;

        const clip = THREE.AnimationClip.findByName(animations, 'Idle');
        console.log(skinnedMesh.skeleton.bones.map(({ name }) => name))

        // console.log(mixer)
        // console.log(animations)
        const action = mixer.clipAction(clip);
        // action.play();
        // action.setEffectiveTimeScale(1);
        // action.setEffectiveWeight(1);

        // animations.forEach((clip, index) => {
        //     const { name } = clip;
        //     const action = mixer.clipAction(clip);
        //     this.constructor.activateAction(action);
        //     allActions.push(action)
        //     this.constructor.setWeight(action, 0);
        // })

        // console.log(animations)

        this.params.mixer = mixer
        this.currentBaseAction = 'idle'

        // for (let i = 0; i !== numAnimations; ++i) {

        //     let clip = animations[i];
        //     const name = clip.name;

        //     if (CHOSEN_MODEL.baseActions[name]) {

        //         const action = mixer.clipAction(clip);
        //         activateAction(action);
        //         CHOSEN_MODEL.baseActions[name].action = action;
        //         allActions.push(action);

        //     } else if (CHOSEN_MODEL.additiveActions[name]) {

        //         // Make the clip additive and remove the reference frame

        //         THREE.AnimationUtils.makeClipAdditive(clip);

        //         if (clip.name.endsWith('_pose')) {

        //             clip = THREE.AnimationUtils.subclip(clip, clip.name, 2, 3, 30);

        //         }

        //         const action = mixer.clipAction(clip);
        //         activateAction(action);
        //         CHOSEN_MODEL.additiveActions[name].action = action;
        //         allActions.push(action);

        //     }

        // }
    }


    synchronizeCrossFade(startAction, endAction, duration) {
        const { mixer } = this.params

        mixer.addEventListener('loop', onLoopFinished);

        function onLoopFinished(event) {

            if (event.action !== startAction) return

            mixer.removeEventListener('loop', onLoopFinished);
            this.executeCrossFade(startAction, endAction, duration);
        }

    }

    prepareCrossFade(startAction, endAction, duration) {

        // If the current action is 'idle', execute the crossfade immediately;
        // else wait until the current action has finished its current loop

        if (this.currentBaseAction === 'idle' || !startAction || !endAction) {

            this.executeCrossFade(startAction, endAction, duration);

        } else {

            this.synchronizeCrossFade(startAction, endAction, duration);

        }

        // Update control colors

        if (endAction) {

            const clip = endAction.getClip();
            this.currentBaseAction = clip.name;

        } else {

            this.currentBaseAction = 'None';

        }

        crossFadeControls.forEach((control) => {
            const name = control.property;
            name === this.currentBaseAction ? control.setActive() : control.setInActive()
        });
    }

    executeCrossFade(startAction, endAction, duration) {

        if (endAction) {

            this.constructor.setWeight(endAction, 1);
            endAction.time = 0;

            if (startAction) {
                startAction.crossFadeTo(endAction, duration, true);
            } else {
                endAction.fadeIn(duration);
            }

        } else {
            startAction.fadeOut(duration);
        }

    }


    static async fromFile(path) {

        const gltf = await asyncLoad(loader, path)
        const model = gltf.scene;
        let skinnedMesh = EMPTY;
        //! scene.add(model);

        // console.log(gltf)

        const lineMaterial = new THREE.MeshBasicMaterial({
            // skinning: true,
            wireframe: true
        });

        model.traverse((object) => {
            if (!object.isMesh) return

            //* skinned mesh
            object.castShadow = false;

            if (object.constructor.name === 'SkinnedMesh')
                skinnedMesh = object

            // geometry.setAttribute( 'color', new Float32BufferAttribute( colors, 3 ) );

            object.material = lineMaterial
        });

        return new this({ model, gltf, skinnedMesh })

        //! skeleton = new THREE.SkeletonHelper(model);
        // skeleton.visible = true;
        // scene.add(skeleton);

        const animations = gltf.animations;
        mixer = new THREE.AnimationMixer(model);

        numAnimations = animations.length;

        for (let i = 0; i !== numAnimations; ++i) {

            let clip = animations[i];
            const name = clip.name;

            if (CHOSEN_MODEL.baseActions[name]) {

                const action = mixer.clipAction(clip);
                activateAction(action);
                CHOSEN_MODEL.baseActions[name].action = action;
                allActions.push(action);

            } else if (CHOSEN_MODEL.additiveActions[name]) {

                // Make the clip additive and remove the reference frame

                THREE.AnimationUtils.makeClipAdditive(clip);

                if (clip.name.endsWith('_pose')) {

                    clip = THREE.AnimationUtils.subclip(clip, clip.name, 2, 3, 30);

                }

                const action = mixer.clipAction(clip);
                activateAction(action);
                CHOSEN_MODEL.additiveActions[name].action = action;
                allActions.push(action);

            }

        }

        createPanel();

        animate();

    }

    static activateAction(action) {
        // const clip = action.getClip();
        this.setWeight(action, 0);
        action.play();
    }


    static setWeight(action, weight) {
        action.enabled = true;
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(weight);
    }
}


async function asyncLoad(loader, path) {
    return new Promise((resolve, reject) => {
        loader.load(path, resolve, NO_OP, reject)
    })
}