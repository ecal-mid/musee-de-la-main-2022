import * as THREE from '../build/three.module.js';

import { GUI } from '../src/lil-gui.module.min.js';

import { GLTFLoader } from '../src/GLTFLoader.js';
import { plantsSpecs } from './plantsSpecs.js';
import { plantsBend1, plantsBend2, plantsBend3, plantsBend4, plantsBend5, plantsBend6 } from './plantsBends.js';
import { TWEEN } from '../src/tween.js';

class App {
    constructor({ width, height, video }) {
        this.container, this.stats, this.clock, this.loader;

        this.mixers = [];
        this.camera, this.scene, this.renderer, this.model, this.face;
        this.plants = [];
        this.plantsMixer = [];

        this.camPos = { x: 0, y: 1, z: -35 };
        this.camRot = { x: 3, y: 0, z: -3.14 };

        this.skeleton;
        this.smoother;

        this.lightPrimary;
        this.lightSecondary;
        this.lightIntensity1 = 0.01;
        this.hitBoxLights = [];
        this.hitBoxLightsPositions = [{ x: 4, y: 5.6, z: 8 }, { x: -4, y: 10.6, z: 9 }, { x: 4, y: 0.7, z: 5 }, { x: -3, y: -0.1, z: 6 }, { x: 8, y: -3, z: -0.5 }, { x: -8, y: -3, z: -0.5 },];

        this.bodyPartsAreOn = { "hitBox1": false, "hitBox2": false, "hitBox3": false, "hitBox4": false, "hitBox5": false, "hitBox6": false };

        this.ambiantSound;
        this.soundEffectLeft;
        this.soundEffectRight;
        this.composer;

        //! sound
        this.ambiantSound = new Audio('../sounds/forest_long_loop.mp3');
        this.soundEffectLeft = new Audio('../sounds/forest_short_left.mp3');
        this.soundEffectRight = new Audio('../sounds/forest_short_right.mp3');

        //! mediapipe
        this.skeleton = new Skeleton();
        this.smoother = new MediaPipeSmoothPose();

        //! webcam
        this.video = video;
        const videoContainer = document.getElementById("video");
        videoContainer.appendChild(this.video);

        //! canvas
        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext("2d");

        videoContainer.appendChild(this.canvas);

        this.initThreeScene();

        this.addListeners();
    }

    initThreeScene() {
        this.container = document.createElement('div');
        document.body.appendChild(this.container);
        this.container.setAttribute("id", "canvas1");

        this.camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 100);
        this.camera.position.set(this.camPos.x, this.camPos.y, this.camPos.z);
        this.camera.rotation.set(this.camRot.x, this.camRot.y, this.camRot.z);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        // scene.fog = new THREE.Fog(0x000000, 0, 1000);

        this.clock = new THREE.Clock();

        //LIGHTS
        this.lightPrimary = new THREE.HemisphereLight(0x666666, 0x1f1f1f, this.lightIntensity1)
        this.scene.add(this.lightPrimary);

        this.lightSecondary = new THREE.DirectionalLight(0xffffff, 1.35);
        this.lightSecondary.position.set(1, 1, 1);
        this.scene.add(this.lightSecondary);
        this.lightSecondary.castShadow = true;
        const d = 1;
        this.lightSecondary.shadow.camera.left = - d;
        this.lightSecondary.shadow.camera.right = d;
        this.lightSecondary.shadow.camera.top = d;
        this.lightSecondary.shadow.camera.bottom = - d;
        this.lightSecondary.shadow.camera.near = 1;
        this.lightSecondary.shadow.camera.far = 4;
        this.lightSecondary.shadow.bias = - 0.002;


        for (let i = 0; i < this.hitBoxLightsPositions.length; i++) {
            let light = new THREE.PointLight(0xFFFFFF, 0, 20, 2);
            light.position.set(this.hitBoxLightsPositions[i].x, this.hitBoxLightsPositions[i].y, this.hitBoxLightsPositions[i].z)
            this.hitBoxLights.push(light);
            this.scene.add(light);
        }

        //FLOOR
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0x000000, depthWrite: true }));
        mesh.rotation.x = -Math.PI / 2;
        this.scene.add(mesh);

        // LOAD PLANTS
        this.loader = new GLTFLoader();
        for (let i = 0; i < plantsSpecs.length; i++) {
            let plant = new Plant(plantsSpecs[i].id, plantsSpecs[i].group, plantsSpecs[i].position, plantsSpecs[i].scale, plantsSpecs[i].flip, plantsSpecs[i].color, plantsSpecs[i].rotation, plantsSpecs[i].filePath, this.loader, this.scene, GUI, THREE, this.plantsMixer);
            setTimeout(() => {
                this.mixers.push(plant.plantsMixer);
                this.plants.push(plant);
            }, 4000);
        }

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.container.appendChild(this.renderer.domElement);

        this.animate();
    }

    addListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        window.addEventListener('keydown', this.keyDown.bind(this));
        document.body.addEventListener('click', this.onClick.bind(this), true);

    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onClick() {
        console.log('test')
        this.ambiantSound.play();
    }

    animate() {
        let dt = this.clock.getDelta();
        if (this.mixers.length == plantsSpecs.length) {
            for (let i = 0; i < this.mixers.length; i++) {
                this.mixers[0][i].update(dt);
            }
        }

        this.camera.position.set(this.camPos.x, this.camPos.y, this.camPos.z);
        this.camera.rotation.set(this.camRot.x, this.camRot.y, this.camRot.z);
        // this.lightPrimary.intensity = this.lightIntensity1;

        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
        TWEEN.update();

        if (this.skeleton) {
            const pose = this.smoother.smoothDamp()
            this.skeleton.update(pose)
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.skeleton.show(this.ctx, { color: 'red' })
            // console.log("showing")
        }
    }


    keyDown(e) {
        //permet de debug les hitbox en utilisant les touches 1 à 6
        //touche 1
        if (e.keyCode == 49) {
            this.toggleHitBox(1);
            this.delayBodyDetection("hitBox1", 5000, 1);
            this.soundEffectLeft.currentTime = 0
            this.soundEffectLeft.play();
        }
        //touche 2
        if (e.keyCode == 50) {
            this.toggleHitBox(2);
            this.delayBodyDetection("hitBox2", 5000, 2);
            this.soundEffectRight.currentTime = 0
            this.soundEffectRight.play();
        }
        //touche 3
        if (e.keyCode == 51) {
            this.toggleHitBox(3);
            this.delayBodyDetection("hitBox3", 5000, 3);
            this.soundEffectLeft.currentTime = 0
            this.soundEffectLeft.play();
        }
        //touche 4
        if (e.keyCode == 52) {
            this.toggleHitBox(4);
            this.delayBodyDetection("hitBox4", 5000, 4);
            this.soundEffectRight.currentTime = 0
            this.soundEffectRight.play();
        }
        //touche 5
        if (e.keyCode == 53) {
            this.toggleHitBox(5);
            this.delayBodyDetection("leftKnee", 5000, 5);
            this.soundEffectLeft.currentTime = 0
            this.soundEffectLeft.play();
        }
        //touche 6
        if (e.keyCode == 54) {
            this.toggleHitBox(6);
            this.delayBodyDetection("rightKnee", 5000, 6);
            this.soundEffectRight.currentTime = 0
            this.soundEffectRight.play();
        }
    }

    toggleHitBox(hitboxIndex) {
        switch (hitboxIndex) {
            case 1:
                console.log('Hitbox 1 was hit');
                this.bendPlants(plantsBend1);
                this.tweenCamAndLights(0, 12, 22, -15, 3.5, 0.3, -3.14, 0.6)
                break;
            case 2:
                console.log('Hitbox 2 was hit');
                this.bendPlants(plantsBend2);
                this.tweenCamAndLights(1, -12, 20, -20, 3.4, -0.3, -3.14, 0.6)
                break;
            case 3:
                console.log('Hitbox 3 was hit');
                this.bendPlants(plantsBend3);
                this.tweenCamAndLights(2, 12, 5, -25, 3.1, 0.3, -3.14, 0.6)
                break;
            case 4:
                console.log('Hitbox 4 was hit');
                this.bendPlants(plantsBend4);
                this.tweenCamAndLights(3, -12, 0, -25, 2.9, -0.3, -3.14, 0.6)
                break;
            case 5:
                console.log('Hitbox 5 was hit');
                this.bendPlants(plantsBend5);
                this.tweenCamAndLights(4, 10, 1, -20, 3, 0.2, -3.14, 0.8)
                break;
            case 6:
                console.log('Hitbox 6 was hit');
                this.bendPlants(plantsBend6);
                this.tweenCamAndLights(5, -10, 1, -20, 3, -0.2, -3.14, 0.8)
                break;
        }
    }

    tweenCamAndLights(hitboxIndex, x1, y1, z1, x2, y2, z2, lightIntensity) {
        let easing = TWEEN.Easing.Sinusoidal.InOut;
        let duration = 1000;
        var tweenLight = new TWEEN.Tween(this.hitBoxLights[hitboxIndex]).to({ intensity: lightIntensity }, duration).easing(easing).start();
        var tweenCamPosition = new TWEEN.Tween(this.camPos).to({ x: x1, y: y1, z: z1 }, duration).easing(easing).start();
        var tweenCamRot = new TWEEN.Tween(this.camRot).to({ x: x2, y: y2, z: z2 }, duration).easing(easing).start();
    }

    bendPlants(bend) {
        let j = 0;
        let bendDirection;
        //selectionner seulement les plantes du groupe 
        for (let i = 0; i < this.plants.length; i++) {

            // console.log(this.plants[i].id)
            // if (groupId == this.plants[i].group) {
            if (this.plants[i].id == bend[j].plantId) {
                bendDirection = bend[j].direction;
                console.log("bendPlants" + bendDirection)
                if (bendDirection == "bend-l-big" && this.plants[i].flip == false) {
                    bendDirection = "bend-r-big"
                }
                else if (bendDirection == "bend-l-small" && this.plants[i].flip == false) {
                    bendDirection = "bend-r-small"
                }
                else if (bendDirection == "bend-r-big" && this.plants[i].flip == false) {
                    bendDirection = "bend-l-big"
                }
                else if (bendDirection == "bend-r-small" && this.plants[i].flip == false) {
                    bendDirection = "bend-l-small"
                }
                if (j < bend.length - 1) { j++; }
                // console.log(bendDirection)
                this.plants[i].bendTo(bendDirection);
            }
        }
    }

    // onClick(e) {
    // }

    onPose(event) {

        this.skeleton.update(event.data.skeleton);
        this.smoother.target(event.data.skeleton);

        // console.log(event.data.skeleton.NOSE.x)
        // y: 0 en haut, 1 en bas
        // x: 1 à gauche, 0 à droite

        if (!event.data.skeleton) return;

        let pose = event.data.skeleton;

        //HAUT GAUCHE
        if (pose.LEFT_WRIST.y < 0.35 && pose.LEFT_WRIST.x > 0.7 && this.bodyPartsAreOn.hitBox1 == false) {
            console.log("hitbox 1");
            this.toggleHitBox(1)
            this.delayBodyDetection("hitBox1", 10000, 1);
        };

        //HAUT DROITE
        if (pose.RIGHT_WRIST.y < 0.35 && pose.RIGHT_WRIST.x < 0.3 && this.bodyPartsAreOn.hitBox2 == false) {
            console.log("bended");
            this.toggleHitBox(2)
            this.delayBodyDetection("hitBox2", 10000, 2);
        };

        //MILIEU GAUCHE
        if (pose.LEFT_WRIST.y > 0.35 && pose.LEFT_WRIST.y < 0.5 && pose.LEFT_WRIST.x > 0.7 && this.bodyPartsAreOn.hitBox3 == false) {
            console.log("hitbox 3");
            this.toggleHitBox(3)
            this.delayBodyDetection("hitBox3", 10000, 3);
        };

        //MILIEU DROITE
        if (pose.RIGHT_WRIST.y > 0.35 && pose.RIGHT_WRIST.y < 0.5 && pose.RIGHT_WRIST.x < 0.3 && this.bodyPartsAreOn.hitBox4 == false) {
            console.log("bended");
            this.toggleHitBox(4)
            this.delayBodyDetection("hitBox4", 10000, 4);
        };

        //BAS GAUCHE
        if (pose.LEFT_ANKLE.x > 0.7 && this.bodyPartsAreOn.hitBox5 == false) {
            console.log("bended");
            this.toggleHitBox(5)
            this.delayBodyDetection("hitBox5", 10000, 5);
        };

        //BAS DROITE
        if (pose.RIGHT_ANKLE.x < 0.3 && this.bodyPartsAreOn.hitBox6 == false) {
            console.log("bended");
            this.toggleHitBox(6)
            this.delayBodyDetection("hitBox6", 10000, 6);
        };


    }

    delayBodyDetection(bodyPart, delay, hitboxIndex) {
        let easing = TWEEN.Easing.Sinusoidal.In;
        let duration = 5000;
        this.bodyPartsAreOn[bodyPart] = true;

        var that = this;
        setTimeout(function () {
            console.log(hitboxIndex)
            var tweenLight = new TWEEN.Tween(that.hitBoxLights[hitboxIndex - 1]).to({ intensity: 0 }, 10000).easing(easing).start();
            var tweenCamPosition = new TWEEN.Tween(that.camPos).to({ x: 0, y: 1, z: -35 }, duration).easing(easing).start();
            var tweenCamRot = new TWEEN.Tween(that.camRot).to({ x: 3, y: 0, z: -3.14 }, duration).easing(easing).start();
        }, 1000);
        setTimeout(function () {
            that.bodyPartsAreOn[bodyPart] = false;
        }, delay);
    }

    mapRange(value, low1, high1, low2, high2) {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    }

    getDistance(x1, y1, x2, y2) {
        let y = x2 - x1;
        let x = y2 - y1;
        return Math.sqrt(x * x + y * y);
    }
}

const mediaPipe = new MediaPipeClient();

mediaPipe.on('setup', () => {

    const { video } = mediaPipe

    const app = new App({
        width: video.width,
        height: video.height,
        video
    })

    mediaPipe.on('pose', (event) => {
        app.onPose(event)
    })

})