//* Examples
// mixamo https://threejs.org/examples/?q=skin#webgl_animation_skinning_additive_blending
// footballer https://rawcdn.githack.com/mrdoob/three.js/r105/examples/webgl_loader_sea3d_bvh_retarget.html

//* Styling
import "../styles/main.scss"

//* node_modules
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

//* scripts
import Model from './model.js'

let scene, renderer, camera, stats;
let mixer;

const crossFadeControls = [];

const params = {
    exposure: 1,
    bloomStrength: 1.5,
    bloomThreshold: 0,
    bloomRadius: 0
}

let currentBaseAction = 'idle';
const allActions = [];
// const baseActions = {
//     idle: { weight: 1 },
//     walk: { weight: 0 },
//     run: { weight: 0 }
// };
// const additiveActions = {
//     sneak_pose: { weight: 0 },
//     sad_pose: { weight: 0 },
//     agree: { weight: 0 },
//     headShake: { weight: 0 }
// };

const MODELS = {
    demo: {
        path: '/models/gltf/Xbot.glb',
        baseActions: {
            idle: { weight: 1 },
            walk: { weight: 0 },
            run: { weight: 0 }
        },
        additiveActions: {
            sneak_pose: { weight: 0 },
            sad_pose: { weight: 0 },
            agree: { weight: 0 },
            headShake: { weight: 0 }
        }
    },
    simple: {
        path: '/models/gltf/human-backflip+idle.glb',
        // path: '/models/gltf/human-backflip-9.glb',

    }
}

const CHOSEN_MODEL = MODELS.demo

let panelSettings, numAnimations;

let myModel;

init();

async function init() {
    myModel = await Model.fromFile(MODELS.simple.path).catch(error => {
        console.log(error)
    })
    const container = document.body;
    clock = new THREE.Clock();

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 10, 50);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 20, 0);
    // scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(3, 10, 10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = - 2;
    dirLight.shadow.camera.left = - 2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 40;
    // scene.add(dirLight);
    myModel.addTo(scene);

    // ground

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);

    // const loader = new GLTFLoader();
    // loader.load(CHOSEN_MODEL.path, function (gltf) {

    //     model = gltf.scene;
    //     scene.add(model);

    //     model.traverse(function (object) {

    //         if (object.isMesh) object.castShadow = true;

    //     });

    //     skeleton = new THREE.SkeletonHelper(model);
    //     skeleton.visible = true;
    //     scene.add(skeleton);

    //     const animations = gltf.animations;
    //     mixer = new THREE.AnimationMixer(model);

    //     numAnimations = animations.length;
    //     console.log(animations)

    //     for (let i = 0; i !== numAnimations; ++i) {

    //         let clip = animations[i];
    //         const name = clip.name;

    //         if (CHOSEN_MODEL.baseActions[name]) {

    //             const action = mixer.clipAction(clip);
    //             activateAction(action);
    //             CHOSEN_MODEL.baseActions[name].action = action;
    //             allActions.push(action);

    //         } else if (CHOSEN_MODEL.additiveActions[name]) {

    //             // Make the clip additive and remove the reference frame

    //             THREE.AnimationUtils.makeClipAdditive(clip);

    //             if (clip.name.endsWith('_pose')) {

    //                 clip = THREE.AnimationUtils.subclip(clip, clip.name, 2, 3, 30);

    //             }

    //             const action = mixer.clipAction(clip);
    //             activateAction(action);
    //             CHOSEN_MODEL.additiveActions[name].action = action;
    //             allActions.push(action);

    //         }

    //     }

    //     createPanel();

    // });

    const gridHelperFine = new THREE.GridHelper(10, 60, 0xffff00, 0x111111);
    const gridHelper = new THREE.GridHelper(10, 10, new THREE.Color( 0, 0.5, 0.3 ), 0xffffff);

    scene.add(gridHelperFine);
    scene.add(gridHelper);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
    camera.position.set(- 1, 2, 3);

    // bloom
    const renderScene = new RenderPass(scene, camera);

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;

    composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);


    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.target.set(0, 1, 0);
    controls.update();

    stats = new Stats();
    container.appendChild(stats.dom);

    window.addEventListener('resize', onWindowResize);

    animate();

}

function createPanel() {

    const panel = new GUI({ width: 310 });

    const folder1 = panel.addFolder('Base Actions');
    const folder2 = panel.addFolder('Additive Action Weights');
    const folder3 = panel.addFolder('General Speed');

    panelSettings = {
        'modify time scale': 1.0
    };

    const baseNames = ['None', ...Object.keys(CHOSEN_MODEL.baseActions)];

    for (let i = 0, l = baseNames.length; i !== l; ++i) {

        const name = baseNames[i];
        const settings = CHOSEN_MODEL.baseActions[name];
        panelSettings[name] = function () {

            const currentSettings = CHOSEN_MODEL.baseActions[currentBaseAction];
            const currentAction = currentSettings ? currentSettings.action : null;
            const action = settings ? settings.action : null;

            prepareCrossFade(currentAction, action, 0.35);

        };

        crossFadeControls.push(folder1.add(panelSettings, name));

    }

    for (const name of Object.keys(CHOSEN_MODEL.additiveActions)) {

        const settings = CHOSEN_MODEL.additiveActions[name];

        panelSettings[name] = settings.weight;
        folder2.add(panelSettings, name, 0.0, 1.0, 0.01).listen().onChange(function (weight) {

            setWeight(settings.action, weight);
            settings.weight = weight;

        });

    }

    folder3.add(panelSettings, 'modify time scale', 0.0, 1.5, 0.01).onChange(modifyTimeScale);

    folder1.open();
    folder2.open();
    folder3.open();

    crossFadeControls.forEach(function (control) {

        control.setInactive = function () {

            control.domElement.classList.add('control-inactive');

        };

        control.setActive = function () {

            control.domElement.classList.remove('control-inactive');

        };

        const settings = CHOSEN_MODEL.baseActions[control.property];

        if (!settings || !settings.weight) {

            control.setInactive();

        }

    });

}

function activateAction(action) {

    const clip = action.getClip();
    const settings = CHOSEN_MODEL.baseActions[clip.name] || CHOSEN_MODEL.additiveActions[clip.name];
    setWeight(action, settings.weight);
    action.play();

}

function modifyTimeScale(speed) {

    mixer.timeScale = speed;

}

function prepareCrossFade(startAction, endAction, duration) {

    // If the current action is 'idle', execute the crossfade immediately;
    // else wait until the current action has finished its current loop

    if (currentBaseAction === 'idle' || !startAction || !endAction) {

        executeCrossFade(startAction, endAction, duration);

    } else {

        synchronizeCrossFade(startAction, endAction, duration);

    }

    // Update control colors

    if (endAction) {

        const clip = endAction.getClip();
        currentBaseAction = clip.name;

    } else {

        currentBaseAction = 'None';

    }

    crossFadeControls.forEach(function (control) {

        const name = control.property;

        if (name === currentBaseAction) {

            control.setActive();

        } else {

            control.setInactive();

        }

    });

}

function synchronizeCrossFade(startAction, endAction, duration) {

    mixer.addEventListener('loop', onLoopFinished);

    function onLoopFinished(event) {

        if (event.action === startAction) {

            mixer.removeEventListener('loop', onLoopFinished);

            executeCrossFade(startAction, endAction, duration);

        }

    }

}

function executeCrossFade(startAction, endAction, duration) {

    // Not only the start action, but also the end action must get a weight of 1 before fading
    // (concerning the start action this is already guaranteed in this place)

    if (endAction) {

        setWeight(endAction, 1);
        endAction.time = 0;

        if (startAction) {

            // Crossfade with warping

            startAction.crossFadeTo(endAction, duration, true);

        } else {

            // Fade in

            endAction.fadeIn(duration);

        }

    } else {

        // Fade out

        startAction.fadeOut(duration);

    }

}

// This function is needed, since animationAction.crossFadeTo() disables its start action and sets
// the start action's timeScale to ((start animation's duration) / (end animation's duration))

function setWeight(action, weight) {

    action.enabled = true;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(weight);

}

function onWindowResize() {

    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    composer.setSize(width, height);

}

function animate() {

    // Render loop

    requestAnimationFrame(animate);

    myModel.update()
    // // Get the time elapsed since the last frame, used for mixer update

    // const mixerUpdateDelta = clock.getDelta();

    // // Update the animation mixer, the stats panel, and render this frame

    // mixer.update(mixerUpdateDelta);

    stats.update();

    renderer.render(scene, camera);
    composer.render();

}
