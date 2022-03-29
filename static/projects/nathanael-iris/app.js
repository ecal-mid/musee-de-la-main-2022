// let log = console.log;
let log = () => { }

import {
    boid_handler
} from "./boids.js"

import {
    clamp,
    lerp,
    delay
} from './js/utils.js'


//---
class Velocity {
    constructor() {
        this.velocity = 0
        this.pose = new THREE.Vector3()
    }

    update({ x, y, z } = this.pose) {
        const newPosition = new THREE.Vector3(x, y, z)
        const v = newPosition.clone().sub(this.pose)
        this.pose.copy(newPosition)
        this.velocity = Math.min(v.length(), 1)
        return this.velocity
    }
}

const mediaPipe = new MediaPipeClient()
window.mediaPipe = mediaPipe
let app

mediaPipe.on("setup", () => {
    // console.log(mediaPipe.mirrored)
    app = new App()
    document.app = app
    // console.log()

    if (mediaPipe.mirrored) document.body.style.transform = "scaleX(-1)"
})



// window.onload = () => {
//     log("app loaded")


//     /* envmap = texload.load("./textures/pool_1k.exr", ((tex) => {
//         envmap = app.PMREMGen.fromEquirectangular(tex);
//     })); */

//     /* document.body.appendChild(stats.domElement)
//     stats.showPanel(0); */
// }

/* let pops = ["pop1.wav", "pop2.ogg", "pop3.ogg", "ploof.mp3"] */
let pops = [
    // "ploof/ploof.mp3",
    // "woosh/woosh1.wav",
    // "woosh/woosh2.wav",
    // "woosh/woosh3.wav",
    // "woosh/woosh4.wav"
].map(fileName => createAudio(fileName, { volume: 0.1 }))

//const background = createAudio("./background.mp3", { autoplay: true, loop: true, volume: 0.1 })

// const crunches = ["crunch1.wav", "crunch2.wav", "crunch3.wav", "crunch4.wav"].map(fileName => {
//     return createAudio(fileName)
// })

function createAudio(fileName, {
    loop = false,
    volume = 1,
    autoplay = false,
    directory = './sounds/'
} = {}) {
    const audio = new Audio(`${directory}${fileName}`)
    audio.loop = loop
    if (autoplay) audio.play()
    audio.volume = volume
    return audio
}
AudioLoop.setBaseURL('./sounds/')
new AudioLoop({
    file: 'background/ambient-underwater.wav',
    gain: 0.8,
    reverb: 1,
    decay: 2,
})

new AudioLoop({
    file: 'background/background.mp3',
    gain: 0.4,
    reverb: 1,
    decay: 2,
})

const [WOOSHES, VELOCITY] = buildWooshes({
    'LEFT_WRIST': 'loop-2.wav',
    'RIGHT_WRIST': 'loop.wav',
    'RIGHT_HEEL': 'loop.wav',
    'LEFT_HEEL': 'loop-3.wav',
}, {
    gain: 0,
    reverb: 0.8,
    decay: 0.3,
    pitch: 0,
})

const NOISES = [
    "underwater/small-2.wav",
    "underwater/small-1.wav",
    "underwater/deep-4.wav",
    "underwater/medium-1.wav",
    "underwater/medium-2.wav",
    "underwater/medium-3.wav",
    "underwater/medium-4.wav",
    "underwater/medium-5.wav",
    "underwater/medium-6.wav",
    "underwater/medium-7.wav",
    "underwater/medium-8.wav",
    "underwater/deep-1.wav",
    "underwater/deep-2.wav",
    "underwater/deep-3.wav",
].map(file => {
    return new AudioTrigger({
        file,
        gain: 0.6,
        reverb: 0.5,
        decay: 0.2,
        pitch: -4,
    })
})




function randomElement(arr) {
    const index = Math.floor(Math.random() * arr.length)
    return arr[index]
}

// window.onclick = () => {
//     // randomElement(NOISES).playVariation()
// }
// let bg_music_init = false
// let bg_music = createAudio("background/background.mp3", {
//     loop: true,
//     volume: 0.5
// })
// bg_music.play()

let SETTINGS = {
    hand_scale: -5,
    invert_x: false,
    invert_y: false,
    invert_z: false,
    // used for calibration
    offset_x: -.0,
    offset_y: -.06,
    offset_y: -.09,
    //  offset_z: 0.5,
    offset_z: 0.63
}

let number = 1500
let initialized = false
let tracker_amount = 79

// TRACKERS DEBUG
let debug = false
let tracker_numbers = []
let font

if (debug) {
    for (let i = 0; i < tracker_amount; i++) {
        tracker_numbers.push(document.createElement("div"))
        tracker_numbers[i].className = "debug_tracker"
        tracker_numbers[i].textContent = i
        document.body.appendChild(tracker_numbers[i])
    }
}

/* let synths = []
let freqs = []

for (let i = 0; i < tracker_amount; i++) {
    synths.push(new Tone.Synth().toDestination())
    freqs.push(i * 100);
} */


/* for (let synth of synths) {
    synth.triggerAttackRelease(100, "8n");
} */
// Petite touche débug + calibrer les positions avec les touches

// Plus de besoin d'intégration

// Une ou des formes qui vont sur les points pour faire apparaitre le pantin de base

// plus de densité

// loading a changer ( autre language graphique )


// faire apparaitre les boids progressivement
//      Débarquent de hors-écran (cycles ?)
//          Cool d'en avoir plein, mais aussi moins

console.warn("WASD, . et , pour calibrer la position")
console.warn("C pour ouvrir le mode débug")

let offset = .01
let debug_visible = false
document.addEventListener("keypress", key => {
    switch (key.key) {
        case "w":
            SETTINGS.offset_y += offset
            break
        case "a":
            SETTINGS.offset_x += offset
            break
        case "s":
            SETTINGS.offset_y -= offset
            break
        case "d":
            SETTINGS.offset_x -= offset
            break

        case ".":
            SETTINGS.offset_z += offset
            break
        case ",":
            SETTINGS.offset_z -= offset
            break

        case "c":
            if (debug_visible) {
                log(debug_visible)
                document.querySelector("#webcam").style.display = "none"
                document.querySelector("#debug_canvas").style.display = "none"
            } else {
                document.querySelector("#webcam").style.display = "block"
                document.querySelector("#debug_canvas").style.display = "block"
            };
            debug_visible = !debug_visible
            break
        case "v":
            SETTINGS.invert_x = !SETTINGS.invert_x

    }
    console.log("x:" + SETTINGS.offset_x, "y:" + SETTINGS.offset_y, "z:" + SETTINGS.offset_z)
})

let texload = new THREE.TextureLoader()
let loader = new THREE.GLTFLoader()
let draco = new THREE.DRACOLoader()
log(loader)
draco.setDecoderPath("./node_modules/three/examples/js/libs/draco/")
loader.setDRACOLoader(draco)
let envmap
let voro = texload.load("./textures/voro.jpg")
let testmap = texload.load("./textures/uv_checker.png")
let tracking_circle_texture = texload.load("./textures/tracking_circle_2.png")
let tracking_circle_mat = new THREE.SpriteMaterial({
    map: tracking_circle_texture,
    color: 0xffffff
})
let tracking_sprites = []
for (let i = 0; i < 5; i++) {
    let s = new THREE.Sprite(tracking_circle_mat)
    s.scale.set(.1, .1, .1)
    tracking_sprites.push(s)
}
new THREE.Sprite(tracking_circle_mat)
let stats = new Stats()

let trackerLights = []

let handConfidence = 0
let handStillness = 100
let hand_pos_history = []
//
let pollenMaterial = new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    specularIntensity: .9,
    metalness: .3,
    roughness: .9,
    sheen: 1,
    emissiveMap: voro,
    emissive: new THREE.Color(0x33ffbb)
})
/* pollenMaterial = new THREE.MeshBasicMaterial({
    color: 0xffaabb
}) */


let numberTaken = 0

// LOAD 3D MODELS

let modelSources = [
    /* "./models/seashells.glb" */
    "./beach_seaShells_export._v3.glb"
]
let modelList = []
let rawTrackers = []

let offsets = []
for (let i = 0; i < tracker_amount; i++) {
    let sc = .125
    offsets[i] = {
        x: Math.random() * sc,
        y: Math.random() * sc,
        z: Math.random() * sc
    }
    /* offsets[i] = {
        x: 0,
        y: 0,
        z: 0
    } */
}

let palette = [
    0xFF4D00,
    0xFFFE75,
    0xFFB290,
    0x4DFFE7,
    0xBD82FF,
]

let circle_i = 0
let circle_max = 21
let circle_r = 10

let display_circle = new THREE.Object3D()
document.circle = display_circle
display_circle.position.z = -5.5
display_circle.position.y = 1.6

for (let source of modelSources) {
    loader.load(source, gltf => {
        let scene_add_cb = false
        /* log(gltf) */
        for (let child of gltf.scene.children) {
            /* log(child) */
            let i = new THREE.InstancedMesh(child.geometry,
                pollenMaterial,
                Math.floor(number / gltf.scene.children.length))
            numberTaken += i.count
            /* i.receiveShadow = true;
            i.castShadow = true */
            i.positions = new Array(i.count * 3)
            i.seeds = new Array(i.count)
            i.scales = new Array(i.count)
            i.rotations = new Array(i.count * 3)
            for (let k = 0; k < i.count; k++) {
                let k_2 = k * 3
                i.seeds[k] = Math.random() * 1000
                i.positions[k_2] = (Math.random() * 2 - 1) * 3
                i.positions[k_2 + 1] = (Math.random() * 2 - 1) * 3
                i.positions[k_2 + 2] = (Math.random() * 2 - 1) * 3 - 3

                let m = new THREE.Matrix4()
                i.rotations[k_2] = Math.random() * 1000
                i.rotations[k_2 + 1] = Math.random() * 1000
                i.rotations[k_2 + 2] = Math.random() * 1000
                let e = new THREE.Euler(
                    i.rotations[k_2],
                    i.rotations[k_2 + 1],
                    i.rotations[k_2 + 2])
                /* k == 0 ? log(e) : {}; */
                let scale = 1
                i.scales[k] =
                    scale = Math.random() < .05 ?
                        Math.random() * .014 + .01 :
                        (Math.random() * 1 + .1) * .011
                m.makeRotationFromEuler(e)
                m.makeScale(scale, scale, scale)
                m.setPosition(i.positions[k_2], i.positions[k_2 + 1], i.positions[k_2 + 2])
                i.setMatrixAt(k, m)
                let c = palette[Math.floor(Math.random() * palette.length)]
                i.setColorAt(k, new THREE.Color().setHex(c))
                /* log(c) */
            };
            i.instanceColor.needsUpdate = true
            /* log(i.seeds) */
            /* log(app.scene) */
            modelList.push(i)
            let circlePart = new THREE.Mesh(child.geometry, pollenMaterial)
            circlePart.scale.set(.02, .02, .02)
            circlePart.position.set(
                Math.sin(circle_i / circle_max * Math.PI * 2) * circle_r,
                0,
                Math.cos(circle_i / circle_max * Math.PI * 2) * circle_r
            )
            display_circle.add(circlePart)
            circle_i++


            // CREATE TRACKER MODELS




            // CALLBACK TO ADD TO SCENE

            if (app && !scene_add_cb) {
                log("adding instance to scene")
                app.scene.add(i)
                /* log(app.scene) */
            } else {
                log("failed to add instances to scene")
                scene_add_cb = true
            }
        }
        while (numberTaken < number) {
            log(modelList[0].count++)
            numberTaken++
        }
        let tally = 0
        for (let m of modelList) {
            tally += m.count
        }
        log(tally)
        /* log(modelList)
        let v = new THREE.Vector3()
        log(v)
        let m = new THREE.Matrix4()
        modelList[0].getMatrixAt(0, m)
        v.setFromMatrixPosition(m)
        app.camera.lookAt(v)
        log(app.camera.rotation) */

        if (scene_add_cb) {
            log("adding instances to scene via callback")
            scene_add_cb = () => {
                if (app && app.scene) {
                    log("app ready, adding instances to scene")
                    for (let model of modelList) {
                        app.scene.add(model)
                        log(app.scene)
                    }
                    log("successfully added instances to scene")
                } else {
                    log("failed to add instances to scene")
                    setTimeout(scene_add_cb, 300)
                }
            }
            setTimeout(scene_add_cb, 300)
        }
        log(modelList)
        let display_circle_cb = () => {
            log("trying to add display circle to scene")
            if (app && app.scene) {
                app.scene.add(display_circle)
                log("display circle added to scene")
            } else {
                setTimeout(display_circle_cb, 100)
                log("trying to add display circle in callback")
            }
        }
        /* if (app && app.scene) {
            app.scene.add(display_circle);
        } else {
            
        } */
        display_circle_cb()
        for (let i = 0; i < tracker_amount; i++) {

        }
    })
}

let tracking_offset = new THREE.Vector3(-.5, -.5, -.5)




export class App {
    constructor() {
        this.start_time = Date.now()
        this.video = document.querySelector("#webcam")
        /* this.video.width = window.innerWidth / 4;
        this.video.height = window.innerHeight / 4; */
        this.debug_canvas = document.querySelector("#debug_canvas")
        this.ctx = this.debug_canvas.getContext('2d')

        this.landmarks = new Array(tracker_amount)
        this.landmarks.fill((new THREE.Vector3()))
        this.landmark_trackers = []

        /* this.landmark_lights = new Array(21);
        this.landmark_lights.fill(new THREE.PointLight({
            color: (Math.random() < .5 ? "#2255FF" : "#FF2255"),
            intensity: .4
        })); */

        // MEDIAPIPE HANDS

        /* this.hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        }) */
        /* this.holistic = new Holistic({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
            }
        })
        this.holistic.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: false,
            refineFaceLandmarks: true,
            minDetectionConfidence: .5,
            minTrackingConfidence: .5
        })
        this.holistic.onResults(results => { */

        /* this.pose = new Pose({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;

            }
        }) */
        // this.pose = mediaPipe.pose.pose
        // this.pose.setOptions({
        //     modelComplexity: 1,
        //     smoothLandmarks: true,
        //     enableSegmentation: false,
        //     smoothSegmentation: false,
        //     minDetectionConfidence: 0.5,
        //     minTrackingConfidence: 0.5
        // });
        this.subdivision_indices = [
            // TORSO
            [11, 12],
            [11, 23],
            [23, 24],
            [12, 24],
            // LEGS
            [24, 26],
            [26, 28],
            [23, 25],
            [25, 27],
            // ARMS
            [12, 14],
            [14, 16],
            [11, 13],
            [15, 13],
            // NECK

        ]
        this.subdivide = (trackers, i, i2, subdivisons) => {
            let result = []
            /* log(trackers) */
            /* log(1 / (subdivisons + 1)); */
            for (let j = 1 / (subdivisons + 1); j < 1; j += 1 / (subdivisons + 1)) {
                /* log(j); */
                result.push({
                    visibility: lerp(trackers[i].visibility, trackers[i2].visibility, j),
                    x: lerp(trackers[i].x, trackers[i2].x, j),
                    y: lerp(trackers[i].y, trackers[i2].y, j),
                    z: lerp(trackers[i].z, trackers[i2].z, j)
                })
            }
            return result
        }
        this.makeFakeTrackers = (trackers) => {
            for (let subdiv of this.subdivision_indices) {
                let subdiv_amt = 3
                if (subdiv[3]) subdiv_amt = subdiv[3]
                for (let addendum of this.subdivide(trackers, subdiv[0], subdiv[1], subdiv_amt)) {
                    trackers.push(addendum)
                }
            }

            let more_trackers = [
                [38, 44, 3],
                [37, 43, 3],
                [36, 42, 3],
                [9, 34, 1]

            ]
            for (let sub of more_trackers) {
                for (let addendum of this.subdivide(trackers, sub[0], sub[1], sub[2])) {
                    trackers.push(addendum)
                }
            }

            /* console.log(trackers.length) */
            return trackers
        }
        let prevVisibility = 0

        // navigator.mediaDevices.getUserMedia({
        //     video: true
        // })

        // let videoSources = []
        // try {
        //     navigator.mediaDevices.enumerateDevices().then(devices => {
        //         for (let d of devices) {
        //             if (d.kind == "videoinput") {
        //                 videoSources.push(d)
        //                 /* log(d) */
        //                 log("cam" + (videoSources.length - 1) + ": " + d.label)
        //             }
        //         }
        //         /* this.webcam = new Camera(this.video, {
        //             onFrame: async () => {
        //                 await this.hands.send({
        //                     image: this.video
        //                 });
        //             },
        //             width: this.video.width,
        //             height: this.video.height,
        //             deviceId: {
        //                 exact: videoSources[1].deviceId
        //             }
        //         })
        //         this.webcam.start(); */
        //         // navigator.mediaDevices.getUserMedia({
        //         //     audio: false,
        //         //     /* video: {
        //         //         advanced: [{
        //         //             width: 1080,
        //         //             height: 1920
        //         //         }]
        //         //     }, */
        //         //     video: true,
        //         //     width: 1080,
        //         //     height: 1920,
        //         //     aspectRatio: 0.5625,
        //         //     deviceId: {
        //         //         exact: videoSources[0].deviceId
        //         //     }
        //         //     /* ,
        //         //                     aspectRatio: 0.5625 */
        //         // }).then(stream => {
        //         //     try {
        //         //         log("received vid")
        //         //         log(stream.getVideoTracks()[0])
        //         //         let capa = stream.getVideoTracks()[0].getCapabilities()
        //         //         this.video.srcObject = stream;
        //         //         this.video.width = 1080
        //         //         this.video.height = 1920
        //         //         /* this.video.width = capa.width.max / 4;
        //         //         this.video.width = 1080 / 4;
        //         //         this.video.height = capa.height.max / 4;
        //         //         this.video.height = 1920 / 4;  */
        //         //         log(capa)
        //         //     } catch {}

        //         //     document.interval = async () => {
        //         //         /* log("fuck") */
        //         //         /* await this.hands.send({
        //         //             image: this.video
        //         //         }) */
        //         //         await this.pose.send({
        //         //             image: this.video
        //         //         })
        //         //         requestAnimationFrame(document.interval)
        //         //     }
        //         //     /* this.video.width = 640;
        //         //     this.video.height = 360; */
        //         //     /* document.interval() */
        //         // })
        //     })
        // } catch {

        // }


        // THREEJS

        this.scene = new THREE.Scene()
        let pointlight = new THREE.DirectionalLight("#AAEEFF", .3)
        pointlight.position.y = 5
        pointlight.position.x = 2
        pointlight.rotation.x = 20
        log(pointlight)
        this.scene.add(pointlight)
        /* let point = new THREE.PointLight("#AAEEFF", .3);
        point.position.z = 4.8
        this.scene.add(point) */

        let rect = new THREE.RectAreaLight("#ff2600", 12000 * 5, 1, .4)
        let rect2 = new THREE.RectAreaLight("#00ffa2", 12000 * 5, 1, .4)
        let rect3 = new THREE.RectAreaLight("#2b00ff", 12000 * 5, 1, .4)
        rect.position.z = -6
        rect2.position.z = -6
        rect3.position.z = -6

        rect.position.x = 10
        rect3.position.x = -10

        rect.position.y = 2
        rect3.position.y = 2
        rect2.position.y = -3

        rect.rotation.y = Math.PI / 4
        rect2.rotation.y = Math.PI * .5
        rect3.rotation.y = -Math.PI / 4

        rect2.rotation.x = Math.PI / 4


        this.scene.add(rect)
        this.scene.add(rect2)
        this.scene.add(rect3)
        let rects = [rect, rect2, rect3]
        for (let rect of rects) {
            /* rect.rotation.y = Math.PI; */
            let cube = new THREE.Mesh(
                new THREE.BoxGeometry(.01, 1, .4),
                new THREE.MeshBasicMaterial({
                    color: 0xFF00FF
                })
            )
            rect.add(cube)
        }
        log(rects)

        let rect4 = new THREE.RectAreaLight(0xFFEEDD, 30, 1, .4)
        rect4.position.z = 8
        this.scene.add(rect4)

        if (!debug) {
            this.fog = new THREE.Fog( /* 0x08070f */ 0x000617, 4.3, 6)
        }
        this.scene.fog = this.fog
        let bg = new THREE.Mesh(
            new THREE.PlaneGeometry(1000, 1000),
            new THREE.MeshBasicMaterial({
                color: 0xffffff
            })
        )
        bg.position.z = -100
        this.scene.add(bg)

        this.particles = new GPUParticles(128)

            console.log(this.particles)

        if (!debug) {
            this.scene.add(this.particles.points)
        }

        /* let ambientlight = new THREE.AmbientLight("#AAAAFF", .02); */
        let ambientlight = new THREE.AmbientLight("#AAAAFF", .3)
        this.scene.add(ambientlight)

        /* for (let landmark_light of this.landmark_lights) {
            this.scene.add(landmark_light);
        } */
        for (let sprite of tracking_sprites) {
            this.scene.add(sprite)
        }

        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, .1, 1000)
        this.camera.position.z = 5.8
        this.camera.rotation.x = 0.58

        this.camera.position.y = -3
        // this.camera.rotation.x = .3
        // this.camera.zoom *= 2 
        /* this.camera.rotation.x  */
        /* this.camera.lookAt(rects[0]) */
        this.renderer = new THREE.WebGLRenderer({
            alpha: false
        })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setClearColor(0x000000, 0)
        this.renderer.setPixelRatio(1)
        this.scene.background = null
        this.renderer.domElement.id = "three"
        document.body.appendChild(this.renderer.domElement)

        // POST PROCESSING

        this.composer = new THREE.EffectComposer(this.renderer)
        const renderPass = new THREE.RenderPass(this.scene, this.camera)
        this.composer.addPass(renderPass)

        const SAOPass = new THREE.SAOPass(this.scene, this.camera, false, true)
        SAOPass.params.saoIntensity = .1
        SAOPass.params.saoScale = 2
        /* log(SAOPass) */
        this.composer.addPass(SAOPass)

        const bloomPass = new THREE.UnrealBloomPass(1, 25, 4, 256)
        bloomPass.strength = 4
        bloomPass.threshold = .01
        this.composer.addPass(bloomPass)
        /* log(bloomPass) */

        const taa = new THREE.TAARenderPass(this.scene, this.camera)
        taa.unbiased = false
        taa.sampleLevel = 4
        this.composer.addPass(taa)



        /* this.PMREMGen = new THREE.PMREMGenerator(this.renderer); */

        const depthShader = THREE.BokehDepthShader

        let materialDepth = new THREE.ShaderMaterial({
            uniforms: depthShader.uniforms,
            vertexShader: depthShader.vertexShader,
            fragmentShader: depthShader.fragmentShader
        })

        materialDepth.uniforms['mNear'].value = this.camera.near
        materialDepth.uniforms['mFar'].value = this.camera.far

        let testObject = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 4), new THREE.MeshStandardMaterial({
            color: "#EEEEEE",
            roughness: .04,
            /* specularIntensity: .9, */

        }))

        /* this.scene.add(testObject); */

        /* this.instanceThing = new THREE.InstancedMesh(new THREE.BoxGeometry, new THREE.MeshBasicMaterial({
            color: "#FFFFFF"
        }), 100);

        this.scene.add(this.instanceThing)
        log(this.instanceThing) */



        // Landmark trackers initialization

        for (let l of this.landmarks) {

            let tracker_mat = new THREE.MeshPhysicalMaterial({
                color: "#aabbcc",
                roughness: .2,
                specularIntensity: .9,
                metalness: .2,
                envMap: envmap
            })
            tracker_mat = new THREE.MeshBasicMaterial({
                color: 0xFF00FF
            })
            let tracker_scale = .2
            tracker_scale = 0
            let tracker_mesh = new THREE.BoxGeometry(tracker_scale, tracker_scale, tracker_scale)
            let tracker = new THREE.Mesh(tracker_mesh, tracker_mat)
            tracker.goal = new THREE.Vector3()


            this.scene.add(tracker)
            this.landmark_trackers.push(tracker)
        }

        // Boid world

        this.boid_handler = new boid_handler(number, this.scene, modelList, tracker_amount)
        /* this.scene.add(this.boid_handler.boid_instancedGeo); */
        log(this.boid_handler.boid_instancedGeo)
        let goal = 0
        this.prevState = "no bueno"
        setInterval(() => {
            handConfidence = Math.max(handConfidence - 6, 0)
            if (handConfidence < 50 /* && handStillness < 10  */ && this.boid_handler.app) {
                log("no bueno", handConfidence)
                if (this.prevState == "bueno") {
                    log("OFF")

                    let i = 4
                    while (i--) {
                        // setTimeout(() => {
                        randomElement(NOISES).playVariation(randomRange(2, 6))
                        // }, Math.random() * 600 + 100)
                    }
                }
                this.prevState = "no bueno"
                for (let i = 0; i < tracker_amount; i++) {
                    setTimeout(() => {
                        this.boid_handler.app.set_goal(i, 0, i / tracker_amount * 2, -(i / tracker_amount) * 15 - 1)
                    }, i * 20)
                }
                goal = lerp(goal, .1, .1)
                /* log(goal) */
                this.boid_handler.app.set_boid_goal_weight(goal)
                /* this.boid_handler.app.set_boid_goal_weight(0) */
                /* log("set goal weight to 0, " + handConfidence, handStillness) */
            } else if (handConfidence >= 50 && this.boid_handler.app) {
                goal = lerp(goal, .3, .1)
                if (this.prevState == "no bueno") {
                    log("ON")
                    let i = 8
                    while (i--) {
                        // for (let i = 0; i < 120 * Math.random(); i++) {
                        randomElement(NOISES).playVariation(randomRange(2, 10))
                        // }
                    }
                    // if (!bg_music_init) {
                    //     bg_music.play()
                    //     bg_music_init = true
                    // }
                }
                this.prevState = "bueno"
                this.boid_handler.app.set_boid_goal_weight(goal)
                log("bueno", handConfidence)
                /* this.boid_handler.app.set_boid_goal_weight(-.01); */
                /* log("set goal weight to -.01, " + handConfidence, handStillness) */
            }
        }, 50)


        // Render loop

        this.colorOffset = Math.random() * 100
        this.first_set_positions = false

        this.still_indicator = document.getElementById("still")
        this.frame = 0
        let render = () => {
            let time = Date.now() - this.start_time
            this.time = time
            stats.begin()
            this.frame++
            display_circle.rotation.y = time / 32000
            for (let c of display_circle.children) {
                c.rotation.y = -time / 4000
            }
            /* rd.shader.uniforms.fk.value.x = rd.shader.
            baseFK.x - handStillness / 100 */
            /* rd.shader.uniforms.stillness.value = (handStillness) * (handConfidence / 100); */
            /* this.still_indicator.style.opacity = .8 - (handConfidence / 100) */
            /* this.renderer.render(this.scene, this.camera) */
            this.composer.render(this.renderer)
            let col = new THREE.Color(0xffffff).setHSL(time / 100000 + this.colorOffset, .7, .4)
            pollenMaterial.emissive = col
            /* log(col, time / 100000) */

            /* log(handConfidence) */

            /* for (let i = 0; i < this.instanceThing.count; i++) {
                let m = new THREE.Matrix4();
                m.setPosition(i * .1, 0, Math.sin(i + this.frame))
                this.instanceThing.setMatrixAt(i, m);
            }
            this.instanceThing.instanceMatrix.needsUpdate = true; */
            /* if (handConfidence < 80) {
                tracking_circle_mat.visible = true;
            } */
            /* tracking_circle_mat.visible = handConfidence < 80; */

            for (let t of this.landmark_trackers) {
                t.position.lerp(t.goal.clone().add(tracking_offset).multiplyScalar(SETTINGS.hand_scale), .1)
            }
            let prevGoal = new THREE.Vector3()
            for (let s of tracking_sprites) {
                if (s.goal) {
                    s.position.lerp(s.goal.clone().add(tracking_offset).multiplyScalar(SETTINGS.hand_scale), .1)
                    /* log(s.goal == prevGoal, s.goal, prevGoal) */
                    prevGoal.copy(s.goal)
                }
            }
            // let i = 0;
            // for (let ll of this.landmark_lights) {
            //     ll.position.copy(this.landmark_trackers[i].position);
            //     i++;
            //     /* log(this.landmark_trackers[i].position == ll.position, ll.position) */
            // }
            if (!this.first_set_positions && this.boid_handler.app) {
                for (let i = 0; i < tracker_amount; i++) {
                    this.boid_handler.app.set_goal(i, 0, i / tracker_amount * 2, -(i / tracker_amount) * 15 - 1)
                }
                this.first_set_positions = true
            }
            try {
                this.boid_handler.step()
            } catch (e) {
                log(e)
            };

            this.particles.update()

            for (let i of modelList) {
                /* log(i) */
                for (let j = 0; j < i.count; j++) {
                    /* if (j == 0) {
                        log(i.positions[j * 3], i.positions[1], i.positions[2])
                    } */
                    /* let m = new THREE.Matrix4();
                    m.makeRotationFromEuler(new THREE.Euler(time + i.seeds[j], time + i.seeds[j], time + i.seeds[j]));
                    m.setPosition(new THREE.Vector3(
                        i.positions[j * 3] + quickNoise.noise(
                            i.positions[j * 3],
                            i.positions[j * 3 + 1] + time,
                            i.positions[j * 3 + 2]),
                        i.positions[j * 3 + 1] + quickNoise.noise(
                            i.positions[j * 3] + time,
                            i.positions[j * 3 + 1],
                            i.positions[j * 3 + 2]),
                        i.positions[j * 3 + 2] + quickNoise.noise(
                            i.positions[j * 3],
                            i.positions[j * 3 + 1],
                            i.positions[j * 3 + 2] + time)
                    ))
                    i.setMatrixAt(j, m); */
                }
            }



            stats.end()
            requestAnimationFrame(render)
        }
        render()

        console.log(WOOSHES, VELOCITY)
        // const VELOCITY = Object.keys(WOOSHES)

        mediaPipe.on('pose', async (event) => {
            if (!this.boid_handler.app) return

            const results = event.data.raw

            if (!initialized) {
                document.querySelector("#hide").style.opacity = 0
                document.querySelector("#loading_label").style.opacity = 0
                initialized = true
            }

            if (results.poseLandmarks) {
                results.poseLandmarks = this.makeFakeTrackers(results.poseLandmarks)
                handConfidence = Math.min(handConfidence + 6, 100)
            }

            Object.keys(WOOSHES).forEach((key) => {
                const pos = event.data.skeletonNormalized?.[key]
                const velocity = VELOCITY[key].update(pos)
                WOOSHES[key].woosh(velocity * 2)
            })


            /* this.hands.setOptions({
                maxNumHands: 1,
                modelComplexity: 1,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            }); */

            // HANDLE TRACKING DATA
            /* this.hands.onResults(results => { */
            /* log(results.image.width + "x" + results.image.height) */
            this.ctx.save()
            /* this.ctx.clearRect(0, 0, this.debug_canvas.width, this.debug_canvas.height);
            this.ctx.drawImage(results.image, 0, 0, this.debug_canvas.width, this.debug_canvas.height); */

            let canvasCtx = this.ctx
            canvasCtx.clearRect(0, 0, this.debug_canvas.width, this.debug_canvas.height)
            try {
                canvasCtx.drawImage(results.segmentationMask, 0, 0,
                    this.debug_canvas.width, this.debug_canvas.height)
            } catch { }
            // Only overwrite existing pixels.
            canvasCtx.globalCompositeOperation = 'source-in'
            canvasCtx.fillStyle = '#00FF00'
            canvasCtx.fillRect(0, 0, this.debug_canvas.width, this.debug_canvas.height)

            // Only overwrite missing pixels.
            canvasCtx.globalCompositeOperation = 'destination-atop'
            canvasCtx.drawImage(
                results.image, 0, 0, this.debug_canvas.width, this.debug_canvas.height)

            canvasCtx.globalCompositeOperation = 'source-over'
            /* for (let landmarks of results.multiHandLandmarks) {
                drawConnectors(this.ctx, landmarks, HAND_CONNECTIONS, {
                    color: '#00FF00',
                    lineWidth: 5
                });
                drawLandmarks(this.ctx, landmarks, {
                    color: '#FF0000',
                    lineWidth: 2
                });
            } */
            // drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
            //     color: '#00FF00',
            //     lineWidth: 4
            // });
            // drawLandmarks(canvasCtx, results.poseLandmarks, {
            //     color: '#FF0000',
            //     lineWidth: 2
            // });
            // if (results.multiHandLandmarks[0]) {
            // handConfidence = Math.min(handConfidence + 5, 100);
            // let j = 0;
            // let tracker_ids = [4, 8, 12, 16, 20]
            // for (let track_sprite of tracking_sprites) {
            //     /* log(this.landmark_lights[tracker_ids[j]].position) */
            //     track_sprite.goal = (this.landmark_trackers[tracker_ids[j]].goal);
            //     /* log(track_sprite.position) */
            //     j++;
            // }
            let tally = new THREE.Vector3()
            let i = 0

            if (results.poseLandmarks) {
                /* let fac = (quickNoise.noise(this.time / 10000, this.time / 10000, this.time / 10000) + 1) / 2;
                fac *= .24 
                log(fac) */
                /* this.boid_handler.app.set_boid_goal_weight(.3) */
                for (let l of results.poseLandmarks) {
                    l.x += SETTINGS.offset_x + offsets[i].x
                    l.y += SETTINGS.offset_y + offsets[i].y
                    l.z += SETTINGS.offset_z + offsets[i].z
                    l.x *= 1
                    l.z *= .3


                    /* app.landmarks[i].x = l.x;
                    app.landmarks[i].y = l.y;
                    app.landmarks[i].z = l.z; */

                    // this.landmark_trackers[i].goal.x = SETTINGS.invert_x ? 1 - l.x : l.x /* * SETTINGS.invert_x ? -1 : 1 */ ;
                    // this.landmark_trackers[i].goal.y = l.y /* * SETTINGS.invert_y ? -1 : 1 */ ;
                    // this.landmark_trackers[i].goal.z = l.z /* * SETTINGS.invert_z ? -1 : 1 */ ;
                    this.landmark_trackers[i].goal.x = SETTINGS.invert_x ? 1 - l.y : l.y /* * SETTINGS.invert_x ? -1 : 1 */
                    this.landmark_trackers[i].goal.y = l.z /* * SETTINGS.invert_y ? -1 : 1 */
                    this.landmark_trackers[i].goal.z = l.x - 5 /* * SETTINGS.invert_z ? -1 : 1 */

                    if (debug) {
                        /* for (let i = 0; i < tracker_amount; i++) { */
                        tracker_numbers[i].style.right = (l.x + 1) * innerWidth / 4 + "px"
                        tracker_numbers[i].style.top = (l.y + 1) * innerWidth / 4 + "px"
                        /* } */
                    }

                    tally.add(new THREE.Vector3(l.x, l.y, l.z))

                    this.boid_handler.app.set_goal(i,
                        ((SETTINGS.invert_x ? 1 - l.x : l.x) + tracking_offset.x) * SETTINGS.hand_scale,
                        (l.y + tracking_offset.y) * SETTINGS.hand_scale,
                        (l.z + tracking_offset.z) * SETTINGS.hand_scale,
                    )

                    // if (handConfidence > 80 && handStillness < 10) {
                    //     log(handConfidence, handStillness)
                    //     /* this.boid_handler.app.set_boid_goal_weight(0.03); */
                    //     /* log("set goal weight to 0.03, " + handConfidence) */
                    // }

                    /* let screen_x = this.boid_handler.app */
                    let trackerPos = this.landmark_trackers[i].goal.clone().add(tracking_offset).multiplyScalar(SETTINGS.hand_scale)
                    trackerPos = trackerPos.project(this.camera)
                    trackerPos.x = (trackerPos.x + 1) * window.innerWidth / 2
                    /* trackerPos.x = SETTINGS.invert_x ? window.innerWidth - trackerPos.x : trackerPos.x; */
                    trackerPos.y = -(trackerPos.y - 1) * window.innerHeight / 2
                    /* trackerPos.y = SETTINGS.invert_y ? window.innerHeight - trackerPos.y : trackerPos.y; */
                    trackerPos.z = 0
                    /* log(trackerPos) */

                    /* if (tracker_ids.includes(i)) { */
                    /* rd.shader.uniforms.mouse.value[i].x +=
                        (trackerPos.x - rd.shader.uniforms.mouse.value[i].x) * .1;
                    rd.shader.uniforms.mouse.value[i].y +=
                        (trackerPos.y - rd.shader.uniforms.mouse.value[i].y) * .1; */

                    /* rd.shader.uniforms.mouse.value[i].x +=
                        ((1 - l.x) * window.innerWidth - rd.shader.uniforms.mouse.value[i].x) * .1;
                    rd.shader.uniforms.mouse.value[i].y +=
                    (l.y * window.innerHeight - rd.shader.uniforms.mouse.value[i].y) * .1; */
                    /* } */


                    /* this.boid_handler.app.set_boid_goal_weight(0.01) */
                    /* log(i, l.x, l.y, l.z) */
                    this.particles.trackers[i] = new THREE.Vector3(l.x, l.y, l.z)

                    i++
                }
            }


            tally.divideScalar(tracker_amount)
            /* rd.displayShader.uniforms.hand_position.value.x = tally.x;
            rd.displayShader.uniforms.hand_position.value.y = tally.y; */
            hand_pos_history.push(tally)
            while (hand_pos_history.length > 20) {
                hand_pos_history.splice(0, 1)
            }


            /* log(hand_pos_history[hand_pos_history.length - 1]) */



            let prevPos = new THREE.Vector3()
            let origin = hand_pos_history[0]
            for (let pos of hand_pos_history) {
                prevPos.sub(pos.clone().sub(origin))
            }
            handStillness += ((clamp(prevPos.length() * .5, 0, 1) + .1) - handStillness) * .1
            /* log("hand stillness: " + handStillness, hand_pos_history) */

            /* if (!this.builtLandmarks) {
                this.builtLandmarks = true;
                let lines = buildLines([
                    [1, 4],
                    [5, 8],
                    [9, 12],
                    [13, 16],
                    [17, 20]
                ], results.multiHandLandmarks[0]);
                log(lines)
            } */
            this.ctx.restore()
        })

    }
}


window.onresize = () => {
    try {
        app.camera.aspect = window.innerWidth / window.innerHeight
        app.camera.updateProjectionMatrix()
        app.renderer.setSize(window.innerWidth, window.innerHeight)

        app.renderer.domElement.width = window.innerWidth
        app.renderer.domElement.height = window.innerHeight

    } catch {

    }

}

function buildLines(points, landmarks) {
    let PointLines = []
    /* log(landmarks) */
    for (let line of points) {
        let geoPoints = []
        /* log(line) */
        for (let point of line) {
            /* log(point) */
            /* log(landmarks[point]) */
            point = landmarks[point]
            geoPoints.push(new THREE.Vector3(point.x, point.y, point.z))
        }
        PointLines.push(geoPoints)
    }
    return PointLines
}

function buildWooshes(sounds, options) {
    const wooshes = {}
    const velocity = {}
    Object.entries(sounds).forEach(([key, file]) => {
        velocity[key] = new Velocity()
        const woosh = new AudioLoop({
            file,
            cooldown: 8,
            ...options
        })
        wooshes[key] = woosh
    })
    return [wooshes, velocity]
}
