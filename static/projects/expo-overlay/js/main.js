// https://github.com/mrdoob/three.js/blob/master/examples/webgl_postprocessing_dof2.html
// https://threejs.org/examples/?q=bokeh#webgl_postprocessing_dof2

import * as THREE from 'https://cdn.skypack.dev/three@0.137.5'

import MediaPipeClient from 'https://mediapipe.ecal-mid.ch/scripts/mediapipe-client.js'
import MediapipeSmoothPose from 'https://mediapipe.ecal-mid.ch/scripts/mediapipe-smooth-pose.js'
import ThreeSkeleton from './threeSkeleton.js'

const smoother = new MediapipeSmoothPose({
    lerpAmount: 0.33, // range [0-1], 0 is slowest, used by lerp()
    dampAmount: 0.1, // range ~1-10 [0 is fastest], used by smoothDamp()
    dampMaxSpeed: Infinity // max speed, used by smoothDamp()
})

let SCENE, CAMERA, RENDERER, skeleton
const mediaPipe = new MediaPipeClient()
window.mediaPipe = mediaPipe // global object mediaPipe

mediaPipe.addEventListener('setup', () => {
    const canvas = document.querySelector('.main-canvas')
    const { width, height } = mediaPipe.video

    const ratio = width / height
    const canvasWidth = window.innerWidth * 2
    const canvasHeight = canvasWidth * ratio

    canvas.width = canvasWidth
    canvas.height = canvasHeight
    buildScene(canvas)

    requestUpdate()
})

mediaPipe.addEventListener('pose', (event) => {
    smoother.target(event.data.skeletonNormalized)
})

function requestUpdate() {
    requestAnimationFrame(update)
}

function update() {
    RENDERER.render(SCENE, CAMERA)

    const pose = smoother.smoothDamp()
    skeleton.update(pose)

    requestUpdate()
}

function buildScene(canvas) {
    SCENE = new THREE.Scene()
    CAMERA = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000)
    RENDERER = new THREE.WebGLRenderer({ canvas, alpha: true })
    CAMERA.position.z = 3
    RENDERER.setClearColor(0x000000, 0) // the default

    const material = new THREE.LineBasicMaterial({ color: 0x0000ff })

    skeleton = new ThreeSkeleton({ material })
    SCENE.add(skeleton.getObject())

    // // const geometry = new THREE.BoxGeometry(1, 1, 1)
    // // const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
    // // const cube = new THREE.Mesh(geometry, material)
    // // SCENE.add(cube)


    // const points = []
    // points.push(new THREE.Vector3(- 0, 0, 0))
    // points.push(new THREE.Vector3(5, 0, 5))

    // const geometry = new THREE.BufferGeometry().setFromPoints(points)

    // const line = new THREE.Line(geometry, material)
    // SCENE.add(line)
}