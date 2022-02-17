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
import { boneLookAtWorld } from './utils.js';

let scene, renderer, camera
let model, skeletonRemapper

let control, dot;

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

    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enablePan = true;
    orbit.enableZoom = true;
    orbit.target.set(0, 1, 0);
    orbit.update();

    const container = document.body;
    container.appendChild(renderer.domElement);


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

function animate() {

    requestAnimationFrame(animate);

    // smoothing
    let pose = smoother.smoothDamp()
    // remap mediapipe to mixamo landmarks 
    pose = skeletonRemapper.update(pose)
    model.update(pose);

    if (pose) {
        model.params.skinnedMesh.skeleton.bones.forEach((bone, index) => {
            const { name, parent } = bone

            // if(index > 2) return;
            const childName = bone.children[0]?.name

            if (childName) {

                // if (index <= 3) {
                scene.attach(bone); // detach from parent and add to scene
                bone.updateMatrixWorld()
                bone.position.copy(pose[name]);


                const child = pose[childName]
                bone.lookAt(child)
                bone.rotateX(Math.PI / 2)

                parent.attach(bone);
                bone.updateMatrix()
            }
            // }

            // if (index === 1) {
            //     // console.log(name)
            //     scene.attach(bone); // detach from parent and add to scene
            //     bone.position.copy(pose[name]);

            //     const childName = bone.children[0].name
            //     const child = pose[childName]

            //     bone.lookAt(child)
            //     bone.rotateX(Math.PI / 2)
            //     parent.attach(bone);
            // }


            // const pos = new THREE.Vector3()
            // const pos1 = dot.getWorldPosition(pos)

            // // console.log(dot.position)
            // scene.attach(bone)
            // bone.updateMatrixWorld()
            // // bone.up = new THREE.Vector3(0, -1, 0)
            // bone.lookAt(pos)
            // parent.attach(bone)
            // bone.updateMatrix()


            // if (index === 1) {
            //     const pos = new THREE.Vector3()
            //     const pos1 = dot.getWorldPosition(pos)

            //     // console.log(dot.position)
            //     scene.attach(bone)
            //     bone.updateMatrixWorld()
            //     // bone.up = new THREE.Vector3(0, -1, 0)
            //     bone.lookAt(pos)
            //     parent.attach(bone)
            //     bone.updateMatrix()
            //     // boneLookAt(bone, pos1)
            // }


            // // const firstChild = bone.children?.[0]
            // if (index > 0) return;

            // console.log(name)

            // // console.log(point)
            // // bone.lookAt(point)
            // boneLookAtWorld(scene, bone, point)
        })
    }


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
