//* Examples
// mixamo https://threejs.org/examples/?q=skin#webgl_animation_skinning_additive_blending
// footballer https://rawcdn.githack.com/mrdoob/three.js/r105/examples/webgl_loader_sea3d_bvh_retarget.html

//* styling
import '@ecal-mid/mediapipe/umd/css/index.css'
// import "../styles/main.scss"

//* node_modules
import { MediaPipeSmoothPose, MediaPipeClient } from '@ecal-mid/mediapipe'
import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';
// import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

//* scripts
import Model from './Model.js'
import SkeletonRemapper from './SkeletonRemapper.js'
import CONFIG from '../config.js'
import { boneLookAtWorld } from './utils.js';

let scene, renderer, camera, stats
let model, skeletonRemapper

const smoother = new MediaPipeSmoothPose({
    lerpAmount: 0.33, // range [0-1], 0 is slowest, used by lerp()
    dampAmount: 0.1, // range ~1-10 [0 is fastest], used by smoothDamp()
    dampMaxSpeed: Infinity // max speed, used by smoothDamp()
})

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
        smoother.target(event.data.skeletonNormalized)
    })


    await init(canvas)
})

async function init(canvas) {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 10, 50);

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
    camera.position.set(- 1, 2, 3);

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

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.target.set(0, 1, 0);
    controls.update();

    stats = new Stats();

    const container = document.body;
    container.appendChild(renderer.domElement);
    container.appendChild(stats.dom);


    animate();

}

function animate() {

    requestAnimationFrame(animate);

    // smoothing
    let pose = smoother.smoothDamp()
    // remap mediapipe to mixamo landmarks 
    pose = skeletonRemapper.update(pose)
    model.update(pose);

    stats.update();

    if (pose) {
        model.params.skinnedMesh.skeleton.bones.forEach(bone => {
            const { name } = bone
            // // if (name !== "mixamorig_Hips") return

            // const firstChild = bone.children?.[0]
            // if (!firstChild) return;

            // const point = pose[firstChild.name]
            // // console.log(point)
            // // bone.lookAt(point)
            // boneLookAtWorld(scene, bone, point)
        })
    }


    renderer.render(scene, camera);
    composer.render();

}
