//* Examples
// mixamo https://threejs.org/examples/?q=skin#webgl_animation_skinning_additive_blending
// footballer https://rawcdn.githack.com/mrdoob/three.js/r105/examples/webgl_loader_sea3d_bvh_retarget.html

//* styling
import '@ecal-mid/mediapipe/umd/css/index.css'
import '../styles/main.scss'
// import "../styles/main.scss"

//* node_modules
// import { MediaPipeSmoothPose, MediaPipeClient } from '@ecal-mid/mediapipe'
import * as THREE from 'three'

import { CSS3DRenderer, CSS3DObject, CSS3DSprite } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
// import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import FakeConsole from './fakeconsole/index.js'
import { TextLoading, TextTitle } from './fakeconsole/text/texts';


//* scripts
import Model from './rig/Model.js'
import SkeletonRemapper from './rig/SkeletonRemapper2.js'
import CONFIG from '../config.js'
import { random } from './utils/object.js'

import IframeBus from './IframeBus.js'

let scene, sceneBack, renderer, camera, composer, cssRendererFront, cssRendererBack
let headText
let model, skeletonRemapper

const BUS = new IframeBus()
const waitResume = BUS.waitFor('resume')

let control, dot, orbit

const consoles = {
    main: new FakeConsole({
        parent: document.body,
        entriesInterval: () => random(2 * 1000),
        attributes: {
            classList: 'console--main'
        }
    }),
    bg: new FakeConsole({
        parent: document.body,
        maxMessages: 50,
        entriesInterval: () => 100,
        attributes: {
            classList: 'console--bg'
        }
    }),
    loading: new FakeConsole({
        parent: document.body,
        attributes: {
            classList: 'console--loading'
        }
    }),
    splash: new FakeConsole({
        parent: document.body,
        attributes: {
            classList: 'console--splashscreen'
        }
    })
}


const canvas = document.querySelector('.main-canvas')

const clips = {
    'basemesh-idle-uv.fbx': ['idle'],
    'basemesh-jump-uv.fbx': ['jump'],
    'basemesh-rumba.fbx': ['rumba'],
}

// const smootherN = new MediaPipeSmoothPose({
//     lerpAmount: 0.33, // range [0-1], 0 is slowest, used by lerp()
//     dampAmount: 0.1, // range ~1-10 [0 is fastest], used by smoothDamp()
//     dampMaxSpeed: Infinity // max speed, used by smoothDamp()
// })
const smoother = new MediaPipeSmoothPose()

const mediaPipe = new MediaPipeClient()
// window.mediaPipe = mediaPipe
window.mediaPipe = mediaPipe

mediaPipe.on('setup', async () => {
    const { width, height } = mediaPipe.video
    mediaPipe.on('pose', (event) => {
        // smootherN.target(event.data.skeletonNormalized)
        smoother.target(event.data.skeletonNormalized)
    })
    await init(canvas, width, height)
})
// window.addEventListener('load', async () => await init(canvas, 1920, 1080))

function moveCamera() {
    // orbit.enabled = false;

    let bone = model.getBone('mixamorig_Hips');
    const pos = bone.getWorldPosition(new THREE.Vector3())
    // console.log(bone.userData.initialWorldPos)
    // camera.position.y = pos.y - 100
    camera.position.x = pos.x
    // camera.position.y += 0.1;
    camera.lookAt(orbit.target);

    // orbit.enabled = true;
}

async function init(canvas, width, height) {

    const ratio = width / height
    const canvasWidth = 1080
    const canvasHeight = canvasWidth * ratio

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    scene = new THREE.Scene()
    sceneBack = new THREE.Scene()
    // scene.background = null
    scene.background = new THREE.Color(0x000000)
    scene.fog = new THREE.Fog(0x000000, 250, 1000);

    // const imgUrl = new URL('./static/models/basemesh/basemesh-tpose.fbx', import.meta.url).href

    skeletonRemapper = new SkeletonRemapper()
    skeletonRemapper.addTo(scene)
    model = await Model.createFromFile('basemesh-tpose-uv.fbx').catch(error => {
        console.log(error)
    })

    const loads = Object.entries(clips).map(([filePath, clipsName]) => model.loadAdditionalAnimations(filePath, clipsName))
    await Promise.all(loads)

    model.setIdleAnimation('idle')

    model.addTo(scene)

    const gridHelperFine = new THREE.GridHelper(1000, 60, new THREE.Color(0.2, 0.2, 0.2), 0x111111)
    const gridHelper = new THREE.GridHelper(1000, 10, new THREE.Color(0, 0.5, 0.3), new THREE.Color(0.2, 0.2, 0.2))

    scene.add(gridHelperFine)
    scene.add(gridHelper)

    // console.log(canvas.width, canvas.height)
    renderer = new THREE.WebGLRenderer({ antialias: true, canvas, alpha: false })
    // renderer.setSize(canvas.width, canvas.height);

    //! css
    let object = new CSS3DObject(consoles.bg.elem);
    object.position.set(0, 100, -300);
    sceneBack.add(object);

    let object2 = new CSS3DObject(consoles.main.elem);
    object2.position.set(-0, 50, 100);
    let sc = 0.2
    object2.scale.set(sc, sc, sc);
    scene.add(object2);

    headText = new CSS3DSprite(consoles.loading.elem);
    sc = 0.3
    headText.position.set(0, 200, 0);
    headText.scale.set(sc, sc, sc);
    consoles.loading.addEntry(new TextLoading({
        text: 'Next project',
        lifeSpan: 1000 * 1000,
    }))

    consoles.loading.setVisibility(false)

    let titleSprite = new CSS3DSprite(consoles.splash.elem);
    titleSprite.position.set(5, 205, -50);
    sc = 0.3
    titleSprite.scale.set(sc, sc, sc);
    consoles.splash.addEntry(new TextTitle({
        text: 'Alter Ego',
    }))

    scene.add(titleSprite);

    cssRendererBack = new CSS3DRenderer({
        element: document.querySelector('.css-renderer.back')
    });
    cssRendererFront = new CSS3DRenderer({
        element: document.querySelector('.css-renderer.front')
    });
    resize()

    renderer.setPixelRatio(CONFIG.density)
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.shadowMap.enabled = true
    renderer.setClearColor(0x000000, 0);
    renderer.toneMappingExposure = Math.pow(CONFIG.bloom.exposure, 4.0)

    // camera
    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 20000)
    const camParent = new THREE.Group()
    const camPos = new THREE.Vector3(0, 200, 300)
    // camera.userData.origPosition = camPos
    // camera.position.set( 1000, - 300, 1000 );
    camParent.add(camera)
    scene.add(camParent)
    camParent.position.copy(camPos)

    // bloom
    const renderScene = new RenderPass(scene, camera)

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(canvas.width, canvas.height), 1.5, 0.4, 0.85)
    // console.log(bloomPass)
    bloomPass.threshold = CONFIG.bloom.bloomThreshold
    bloomPass.strength = CONFIG.bloom.bloomStrength
    bloomPass.radius = CONFIG.bloom.bloomRadius

    composer = new EffectComposer(renderer)
    composer.addPass(renderScene)
    composer.addPass(bloomPass)

    orbit = new OrbitControls(camParent, document.body)
    orbit.enablePan = true
    orbit.enableZoom = true
    orbit.target.set(0, 100, 0)
    orbit.update()

    const container = document.body
    container.appendChild(renderer.domElement)

    // console.log(orbit)


    //! debug
    control = new TransformControls(camera, renderer.domElement)
    control.addEventListener('dragging-changed', (event) => {
        orbit.enabled = !event.value
    })


    let dotGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(1, 0, 0)])
    const dotMaterial = new THREE.PointsMaterial({ size: 1, sizeAttenuation: false })
    dot = new THREE.Points(dotGeometry, dotMaterial)
    scene.add(dot)


    const light = new THREE.PointLight(0xff0000, 100, 3500)
    light.position.set(0, 0, 0)
    scene.add(light)

    // scene.add(new THREE.HemisphereLight(0xffffff, 0x80ffe5, 0.5))

    // console.log(model.params.skinnedMesh.skeleton.bones[0])
    control.attach(light)

    const bone = model.getBone('mixamorig_Head')
    bone.attach(headText)
    headText.position.set(0, 30, 0)
    // scene.add(control);

    if (window !== window.parent) {
        render()
        await waitResume
        animate()
        model.play('rumba')
    } else {
        animate()
    }

    window.addEventListener('click', () => {
        // idle
        // jump
        // rumba
        model.play('rumba')
    })

    //! skeleton remapping

    // skeletonRemapper.group.visible = false;


    window.addEventListener('resize', resize)
}

function resize() {
    cssRendererFront.setSize(window.innerWidth, window.innerHeight);
    cssRendererBack.setSize(window.innerWidth, window.innerHeight);
}

function animate() {

    requestAnimationFrame(animate)
    render()

}

function render() {
    Object.values(consoles).forEach(console => console.update())
    moveCamera()


    // smoothing
    let pose = smoother.smoothDamp()
    // // remap mediapipe to mixamo landmarks 
    const { skeleton } = model.params.skinnedMesh
    // // console.log(pose)

    model.update(pose)
    // pose = skeletonRemapper.update(pose, skeleton)

    renderer.render(scene, camera)
    cssRendererFront.render(scene, camera);
    cssRendererBack.render(sceneBack, camera);
    composer.render()
}