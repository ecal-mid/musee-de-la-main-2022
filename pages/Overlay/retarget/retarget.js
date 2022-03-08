import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { BVHLoader } from 'three/examples/jsm/loaders/BVHLoader.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { ColorCorrectionShader } from 'three/examples/jsm/shaders/ColorCorrectionShader.js'
import { VignetteShader } from 'three/examples/jsm/shaders/VignetteShader.js'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js'

var container, stats

var camera, scene, renderer, composer, player, hat

var loader, options

var bvhSkeletonHelper, bvhMixer

// Initialize Three.JS

init()

//
// SEA3D Loader
//

loader = new THREE.SEA3D({

  autoPlay: false, // Auto play animations
  container: scene, // Container to add models
  multiplier: .6 // Light multiplier

})

loader.onComplete = function () {

  // Get the first camera from SEA3D Studio
  // use loader.get... to get others objects

  var cam = loader.cameras[0]
  camera.position.copy(cam.position)
  camera.rotation.copy(cam.rotation)

  new OrbitControls(camera, renderer.domElement)

  // get meshes
  player = loader.getMesh("Player")
  hat = loader.getMesh("Hat")

  hat.visible = false

  loadBVH()

  animate()

}

loader.load('./models/sea3d/skin.tjs.sea')

//

options = {
  hip: "hip",
  // left is SEA3D bone names and right BVH bone names
  names: {
    "Base HumanPelvis": "hip",
    "Base HumanSpine3": "abdomen",
    "Base HumanRibcage": "chest",
    "Base HumanHead": "head",

    "Base HumanRUpperarm": "rShldr",
    "Base HumanRForearm1": "rForeArm",
    "Base HumanRPalm": "rHand",

    "Base HumanLUpperarm": "lShldr",
    "Base HumanLForearm1": "lForeArm",
    "Base HumanLPalm": "lHand",

    "Base HumanRThigh": "rThigh",
    "Base HumanRCalf1": "rShin",
    "Base HumanRFoot": "rFoot",

    "Base HumanLThigh": "lThigh",
    "Base HumanLCalf1": "lShin",
    "Base HumanLFoot": "lFoot"
  }
}

//

function loadBVH() {

  var loader = new BVHLoader()
  loader.load("models/bvh/pirouette.bvh", function (result) {

    bvhSkeletonHelper = new THREE.SkeletonHelper(result.skeleton.bones[0])
    bvhSkeletonHelper.skeleton = result.skeleton // allow animation mixer to bind to SkeletonHelper directly

    var boneContainer = new THREE.Group()
    boneContainer.add(result.skeleton.bones[0])
    boneContainer.position.z = - 100
    boneContainer.position.y = - 100

    scene.add(bvhSkeletonHelper)
    scene.add(boneContainer)

    // get offsets when it is in T-Pose
    options.offsets = THREE.SkeletonUtils.getSkeletonOffsets(player, bvhSkeletonHelper, options)

    // play animation
    bvhMixer = new THREE.AnimationMixer(bvhSkeletonHelper)
    bvhMixer.clipAction(result.clip).setEffectiveWeight(1.0).play()

  })

}

function init() {

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x333333)

  container = document.createElement('div')
  document.body.appendChild(container)

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 20000)
  camera.position.set(1000, - 300, 1000)

  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.appendChild(renderer.domElement)

  stats = new Stats()
  container.appendChild(stats.dom)

  // post-processing

  composer = new EffectComposer(renderer)

  var renderPass = new RenderPass(scene, camera)
  var copyPass = new ShaderPass(CopyShader)
  composer.addPass(renderPass)

  var vh = 1.4, vl = 1.2

  var colorCorrectionPass = new ShaderPass(ColorCorrectionShader)
  console.log(colorCorrectionPass)
  colorCorrectionPass.uniforms["powRGB"].value = new THREE.Vector3(vh, vh, vh)
  colorCorrectionPass.uniforms["mulRGB"].value = new THREE.Vector3(vl, vl, vl)
  composer.addPass(colorCorrectionPass)

  var vignettePass = new ShaderPass(VignetteShader)
  vignettePass.uniforms["darkness"].value = 1.0
  composer.addPass(vignettePass)

  composer.addPass(copyPass)

  // events

  window.addEventListener('resize', onWindowResize, false)

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  composer.setSize(window.innerWidth, window.innerHeight)
  renderer.setSize(window.innerWidth, window.innerHeight)

}

//

var clock = new THREE.Clock()

function animate() {

  var delta = clock.getDelta()

  requestAnimationFrame(animate)

  // Update SEA3D Animations
  THREE.SEA3D.AnimationHandler.update(delta)

  if (bvhMixer) {

    bvhMixer.update(delta)

    THREE.SkeletonUtils.retarget(player, bvhSkeletonHelper, options)

  }

  render(delta)

  stats.update()

}

function render(dlt) {

  //renderer.render( scene, camera );
  composer.render(dlt)

}

