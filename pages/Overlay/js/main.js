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

import { CSS3DRenderer, CSS3DObject, CSS3DSprite } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
// import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import FakeConsole from './fakeconsole/index.js'
import { TextLoading, TextTitle, Text } from './fakeconsole/text/texts'

//* scripts
import Model from './rig/Model.js'
import { CustomGridHelper } from './CustomGridHelper.js'
import SkeletonRemapper from './rig/SkeletonRemapper.js'
import CONFIG from '../config.js'
import { random, delay, isWindows } from './utils/object.js'
import { map, Smoother, mapClamped } from './utils/math.js'

import IframeBus from './IframeBus.js'

const transitionDelay = CONFIG.transitionDelay

let scene, sceneBack, renderer, camera, composer, cssRendererFront, cssRendererBack
let control, dot, orbit
let model, skeletonRemapper

console.log('INIT Overlay');

let text3DHead
let textProject = new Text({ text: '' })
let animationFrame = null

let PERSON = {
    size: 0.5, velocity: 0, smoothSize: new Smoother({
        smoothness: 1,
    }),
    control: new Smoother({
        smoothness: 0.3,
    }),
}

let someone = false
let TITLE_MODE = true

const GRID = {}
const BUS = new IframeBus({ transitionDelay })
const waitResume = BUS.waitFor('resume')
const clock = new THREE.Clock()

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

    "silly-dancing.fbx": ['silly'],
    "opening.fbx": ['opening'],
    "pointing.fbx": ['pointing'],
    "salsa-dancing.fbx": ['salsa'],
}

// const smootherN = new MediaPipeSmoothPose({
//     lerpAmount: 0.33, // range [0-1], 0 is slowest, used by lerp()
//     dampAmount: 0.1, // range ~1-10 [0 is fastest], used by smoothDamp()
//     dampMaxSpeed: Infinity // max speed, used by smoothDamp()
// })
const smoother = new MediaPipeSmoothPose({ dampAmount: 0 })
const smootherN = new MediaPipeSmoothPose({ dampAmount: .15 })

const mediaPipe = new MediaPipeClient()
// window.mediaPipe = mediaPipe
window.mediaPipe = mediaPipe

mediaPipe.on('setup', async () => {
    const { width, height } = mediaPipe.video
    await init(canvas, width, height)
})
// window.addEventListener('load', async () => await init(canvas, 1920, 1080))

function moveCamera(personSize) {
    let bone = model.getBone('mixamorig_Hips')
    const hips = bone.getWorldPosition(new THREE.Vector3())
    const { maxSize, centerZ } = CONFIG
    const centerPoint = centerZ
    const target = new THREE.Vector3()

    target.copy(orbit.target)

    camera.position.x = hips.x * 0.5


    // console.log(personSize)
    personSize = Math.min(personSize, maxSize)
    camera.position.z = map(personSize, centerPoint, maxSize, 0, 250)
    camera.position.y = map(personSize, centerPoint, maxSize, 0, 100)
    target.y += map(personSize, centerPoint, maxSize, 0, 50)

    camera.lookAt(target)
}

async function init(canvas, width, height) {

    // console.log('NANI');
    const ratio = width / height
    //TODO
    // const canvasWidth = 1080*2
    const quality = isWindows() ? 2 : 1
    const canvasWidth = 1080 * quality
    const canvasHeight = canvasWidth * ratio

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    scene = new THREE.Scene()
    sceneBack = new THREE.Scene()
    // scene.background = null
    scene.background = new THREE.Color(0x000000)
    scene.fog = new THREE.Fog(0x000000, 250, 1000)

    // const imgUrl = new URL('./static/models/basemesh/basemesh-tpose.fbx', import.meta.url).href

    skeletonRemapper = new SkeletonRemapper()
    skeletonRemapper.addTo(scene)
    model = await Model.createFromFile('basemesh-tpose-uv.fbx').catch(error => {
        console.log(error)
    })

    model.setVisibility(true)

    const loads = Object.entries(clips).map(([filePath, clipsName]) => model.loadAdditionalAnimations(filePath, clipsName))
    await Promise.all(loads)

    model.play('idle')

    model.addTo(scene)

    renderer = new THREE.WebGLRenderer({ antialias: true, canvas, alpha: false })
    // renderer.setSize(canvas.width, canvas.height);

    //! 3D consoles
    let object = new CSS3DObject(consoles.bg.elem)
    object.position.set(0, 100, -300)
    sceneBack.add(object)

    let object2 = new CSS3DObject(consoles.main.elem)
    object2.position.set(-0, 50, 100)
    let sc = 0.2
    object2.scale.set(sc, sc, sc)
    scene.add(object2)

    text3DHead = new CSS3DSprite(consoles.loading.elem)
    sc = 0.3
    text3DHead.position.set(0, 200, 0)
    text3DHead.scale.set(sc, sc, sc)

    consoles.loading.addEntry(textProject)

    let titleSprite = new CSS3DSprite(consoles.splash.elem)
    titleSprite.position.set(5, 205, -50)
    sc = 0.3
    titleSprite.scale.set(sc, sc, sc)
    consoles.splash.addEntry(new TextTitle({
        text: 'Alter Ego',
    }))

    scene.add(titleSprite)

    cssRendererBack = new CSS3DRenderer({
        element: document.querySelector('.css-renderer.back')
    })
    cssRendererFront = new CSS3DRenderer({
        element: document.querySelector('.css-renderer.front')
    })
    resizeRenderer()

    renderer.setPixelRatio(CONFIG.density)
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.shadowMap.enabled = true
    renderer.setClearColor(0x000000, 0)
    renderer.toneMappingExposure = Math.pow(CONFIG.bloom.exposure, 4.0)

    // camera
    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 20000)
    const camParent = new THREE.Group()
    const camPos = new THREE.Vector3(0, 200, 300)

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

    // grids
    GRID.fineGrid = new CustomGridHelper(1000, 60, new THREE.Color(0.2, 0.2, 0.2), 0x111111, 3000)
    GRID.grid = new CustomGridHelper(1000, 10, new THREE.Color(0, 0.5, 0.3), new THREE.Color(0.2, 0.2, 0.2), 200)
    GRID.grid.position.y = 1;
    scene.add(GRID.fineGrid)
    scene.add(GRID.grid)

    const bone = model.getBone('mixamorig_Head')
    bone.attach(text3DHead)
    text3DHead.position.set(0, 30, 0)
    // scene.add(control);

    BUS.addEventListener('projectchange', (project) => {
        // console.log(project)

        consoles.loading.setVisibility(true)
        consoles.splash.setVisibility(false)

        consoles.loading.addEntry(new TextLoading({
            text: '',
            lifeSpan: transitionDelay,
        }))

        textProject.setAttributes({ textContent: `${project.title}` })

        const clipName = random(['rumba', 'rumba', 'silly', 'pointing'])
        model?.play(clipName)
        TITLE_MODE = false

    })

    BUS.addEventListener('showtitle', () => {
        model?.play('idle', { loop: true })
        consoles.loading.setVisibility(false)
        consoles.splash.setVisibility(true, 500)
        TITLE_MODE = true
    })

    BUS.addEventListener('pause', () => {
        pause()
    })

    BUS.addEventListener('hide', () => {
        consoles.loading.setVisibility(false)
        consoles.splash.setVisibility(false)
        model.setVisibility(false)

        GRID.grid.appear(false)
        GRID.fineGrid.appear(false, 100)
        showOverlay(false)
    })

    BUS.addEventListener('resume', () => {
        // console.log('YWEAFGBSG')
        resume()
        GRID.grid.appear(true)
        GRID.fineGrid.appear(true, 500)
        model.setVisibility(true)
        showOverlay(true)
    })

    BUS.emit('resume')
    BUS.emit('showtitle')

    window.addEventListener('resize', resizeRenderer)

    mediaPipe.on('pose', (event) => {
        // smootherN.target(event.data.skeletonNormalized)

        someone = Boolean(event.data.skeleton)

        // GRID.grid.appear(!someone)
        consoles.main.setVisibility(!someone)
        consoles.bg.setVisibility(!someone)
        // consoles.splash.setVisibility(!someone)

        smootherN.target(event.data.skeletonNormalized)
        smoother.target(event.data.skeleton)
    })


    // appear

    await delay(2000);
    GRID.grid.appear(true)
    await delay(1000);
    GRID.fineGrid.appear(true)
}

function resizeRenderer() {
    const { innerHeight, innerWidth } = window
    cssRendererFront.setSize(innerWidth, innerHeight)
    cssRendererBack.setSize(innerWidth, innerHeight)
}

function resume() {
    pause()
    animate()
}

function animate() {
    animationFrame = requestAnimationFrame(animate)
    render()
}

function pause() {
    cancelAnimationFrame(animationFrame)
    animationFrame = null
}

function showOverlay(visible) {
    const container = document.querySelector('.visibilityContainer')
    const { classList } = container
    visible ? classList.remove('hidden') : classList.add('hidden')

    container.ontransitionend = (event) => {
        if(event.target !== container) return;

        const isHidden = classList.contains('hidden')

        if(!isHidden) return;
        BUS.emit('pause')
    }
}

function render() {

    const deltaTime = clock.getDelta()

    Object.values(consoles).forEach(console => console.update())


    // smoothing
    let poseN = smootherN.smoothDamp()
    let pose = smoother.smoothDamp()

    // personSize
    let dist = CONFIG.centerZ
    if (someone) dist = SkeletonRemapper.dist2D(pose.RIGHT_SHOULDER, pose.LEFT_SHOULDER)

    const value = PERSON.smoothSize.smoothen(deltaTime, dist)
    // console.log(value)
    moveCamera(value)

    const { skeleton } = model.params.skinnedMesh
    model.update(poseN, deltaTime)

    const canControl = someone && TITLE_MODE
    const controlAmount = PERSON.control.smoothen(deltaTime, canControl ? 1 : 0, 0.1)

    if (smootherN.smoothedLandmarks) skeletonRemapper.update(smootherN.smoothedLandmarks, skeleton, controlAmount)

    // animate grids
    GRID.fineGrid.update(deltaTime)
    GRID.grid.update(deltaTime)

    // rendering
    renderer.render(scene, camera)
    composer.render()
    cssRendererFront.render(scene, camera)
    cssRendererBack.render(sceneBack, camera)
}