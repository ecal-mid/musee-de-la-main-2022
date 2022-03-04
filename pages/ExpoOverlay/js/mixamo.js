//* Examples
// mixamo https://threejs.org/examples/?q=skin#webgl_animation_skinning_additive_blending
// footballer https://rawcdn.githack.com/mrdoob/three.js/r105/examples/webgl_loader_sea3d_bvh_retarget.html

//* styling
import '@ecal-mid/mediapipe/umd/css/index.css'
// import "../styles/main.scss"

//* node_modules
import { MediaPipeSmoothPose, MediaPipeClient } from '@ecal-mid/mediapipe'
import * as THREE from 'three';

// import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';


import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

//* scripts
import Model from './Model.js'
import SkeletonRemapper from './SkeletonRemapper.js'
import CONFIG from '../config.js'
import { boneLookAtWorld, interpolateLandmarks } from './utils.js';

let scene, renderer, camera
let model, skeletonRemapper

let control, dot, orbit;

const smootherN = new MediaPipeSmoothPose({
    lerpAmount: 0.33, // range [0-1], 0 is slowest, used by lerp()
    dampAmount: 0.1, // range ~1-10 [0 is fastest], used by smoothDamp()
    dampMaxSpeed: Infinity // max speed, used by smoothDamp()
})
const smoother = new MediaPipeSmoothPose()

const mediaPipe = new MediaPipeClient()
window.mediaPipe = mediaPipe

mediaPipe.on('setup', async () => {
    const canvas = document.querySelector('.main-canvas')
    const { width, height } = mediaPipe.video

    const ratio = width / height
    const canvasWidth = window.innerWidth
    const canvasHeight = canvasWidth * ratio

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    mediaPipe.on('pose', (event) => {
        smootherN.target(event.data.skeletonNormalized)
        smoother.target(event.data.skeleton)
        // smoother.target(event.data.skeleton)
    })


    await init(canvas)
})

async function init(canvas) {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 0, 10);

    skeletonRemapper = new SkeletonRemapper()
    model = await Model.fromFile(CONFIG.models.simple.path).catch(error => {
        console.log(error)
    })

    model.addTo(scene);
    skeletonRemapper.addTo(scene)

    const gridHelperFine = new THREE.GridHelper(10, 60, 0xffff00, 0x111111);
    const gridHelper = new THREE.GridHelper(10, 10, new THREE.Color(0, 0.5, 0.3), 0xffffff);

    scene.add(gridHelperFine);
    scene.add(gridHelper);

    // console.log(canvas.width, canvas.height)
    renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    // renderer.setSize(canvas.width, canvas.height);
    renderer.setPixelRatio(CONFIG.density)
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.toneMappingExposure = Math.pow(CONFIG.bloom.exposure, 4.0);

    // camera
    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 100);
    const camParent = new THREE.Group()
    camera.position.set(0, 2, 3);
    camParent.add(camera)
    scene.add(camParent);

    // bloom
    const renderScene = new RenderPass(scene, camera);

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(canvas.width, canvas.height), 1.5, 0.4, 0.85);
    console.log(bloomPass)
    bloomPass.threshold = CONFIG.bloom.bloomThreshold;
    bloomPass.strength = CONFIG.bloom.bloomStrength;
    bloomPass.radius = CONFIG.bloom.bloomRadius;

    composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enablePan = true;
    orbit.enableZoom = true;
    orbit.target.set(0, 1, 0);
    orbit.update();

    const container = document.body;
    container.appendChild(renderer.domElement);

    console.log(orbit)


    //! debug
    control = new TransformControls(camera, renderer.domElement);
    control.addEventListener('dragging-changed', (event) => {
        orbit.enabled = !event.value;
    });


    let dotGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(1, 0, 0)])
    const dotMaterial = new THREE.PointsMaterial({ size: 1, sizeAttenuation: false });
    dot = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(dot);

    // console.log(model.params.skinnedMesh.skeleton.bones[0])

    control.attach(dot);
    scene.add(control);

    animate();

}

function panCam(camera) {
    let screenPose = smoother.smoothDamp()
    if (!screenPose) return;
    const { x, y, z } = interpolateLandmarks(screenPose['LEFT_HIP'], screenPose['LEFT_RIGHT'], 0.5)
    camera.parent.position.set(-(x - 0.5), (y - 2) * 2, 0);
    camera.lookAt(new THREE.Vector3(0, 1, 0))
}

function animate() {

    requestAnimationFrame(animate);

    panCam(camera)

    // smoothing
    let pose = smootherN.smoothDamp()
    // remap mediapipe to mixamo landmarks 
    pose = skeletonRemapper.update(pose)
    // console.log(pose)
    model.update(pose);

    renderer.render(scene, camera);
    composer.render();

}

function boneLookAt(bone, position) {
    // const { parent } = bone

    // scene.attach(bone)
    // boneLookAtLocal(bone, vector3)
    // parent.attach(bone)

    const target = new THREE.Vector3(
        position.x - bone.matrixWorld.elements[12],
        position.y - bone.matrixWorld.elements[13],
        position.z - bone.matrixWorld.elements[14]
    ).normalize();

    let v = new THREE.Vector3(1, 0, 0);
    let q = new THREE.Quaternion().setFromUnitVectors(v, target);
    let tmp = q.z;

    q.z = -q.y;
    q.y = tmp;

    bone.quaternion.copy(q);
}
