import * as THREE from "../build/three.module.js";

import { GUI } from "../src/lil-gui.module.min.js";

import { GLTFLoader } from "../src/GLTFLoader.js";
import { plantsSpecs } from "./plantsSpecs.js";
import {
  plantsBend1,
  plantsBend2,
  plantsBend3,
  plantsBend4,
  plantsBend5,
  plantsBend6,
} from "./plantsBends.js";
import { TWEEN } from "../src/tween.js";

/*
- change navigation system | lerp vecteur direction
- améliorer les lights
- naviguer avec les deux mains
- ? changer le trigger d'animation des plantes
- ? ajouter du son ? 
*/
let MIRRORED = 1; // or -1

class App {
  constructor({ width, height, video }) {
    this.mode = 2; // 1 tracking | 2 moving camera
    this.debugMode = false;

    this.container, this.stats, this.clock, this.loader;

    this.mixers = [];
    this.camera, this.scene, this.renderer, this.model, this.face;
    this.plants = [];
    this.plantsMixer = [];

    this.cameraRangeExtreme = {
      min: {
        x: [-2, 2],
        y: [8, 14],
        z: [-3, -3],
      },

      max: {
        x: [-1, 1],
        y: [10, 11],
        z: [-28, -28],
      },
    };

    this.cameraRange = {
      x: [-20, 20],
      y: [0, 20],
      z: [-5, -5],
    };

    this.camPos = {
      x: this.average(this.cameraRange.x),
      y: this.average(this.cameraRange.y),
      z: this.average(this.cameraRange.z),
    };

    this.camRot = { x: 3.14, y: 0, z: -3.14 };

    this.tracker = {
      x: this.average(this.cameraRange.x),
      y: this.average(this.cameraRange.y),
    };

    this.skeleton;
    this.smoother;
    this.limitCounter = 0;
    // this.distance = 0.7;
    this.distanceXtm = [0.2, 0.5];
    this.distance = this.average(this.distanceXtm);
    this.lightPrimary;
    this.lightSecondary;
    this.lightIntensity1 = 0.01;
    this.hitBoxLights = [];
    this.hitBoxLightsPositions = [
      { x: 4, y: 5.6, z: 8 },
      { x: -4, y: 10.6, z: 9 },
      { x: 4, y: 0.7, z: 5 },
      { x: -3, y: -0.1, z: 6 },
      { x: 8, y: -3, z: -0.5 },
      { x: -8, y: -3, z: -0.5 },
    ];

    this.hitboxes = [
      { x: 3 / 4, y: 1 / 6, active: false },
      { x: 1 / 4, y: 1 / 6, active: false },
      { x: 3 / 4, y: 3 / 6, active: false },
      { x: 1 / 4, y: 3 / 6, active: false },
      { x: 3 / 4, y: 5 / 6, active: false },
      { x: 1 / 4, y: 5 / 6, active: false },
    ];

    this.ambiantSound;
    this.soundEffectLeft;
    this.soundEffectRight;
    this.composer;

    //! sound
    this.ambiantSound = new Audio("./sounds/loop.mp3");
    this.ambiantSound.loop = true;
    this.ambiantSound.oncanplay = this.ambiantSound.play;

    this.soundEffectLeft = new Audio("./sounds/forest_short_left.mp3");
    this.soundEffectRight = new Audio("./sounds/forest_short_right.mp3");

    //! mediapipe
    this.skeleton = new Skeleton();
    this.smoother = new MediaPipeSmoothPose({
      dampAmount: 5,
    });

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

    this.toggleMode();
  }

  toggleMode() {
    if (this.debugMode) {
      document.querySelector("video").style.display = "block";
      document.getElementById("HUD").style.display = "block";
    } else {
      document.querySelector("video").style.display = "none";
      document.getElementById("HUD").style.display = "none";
    }
  }

  initThreeScene() {
    this.container = document.createElement("div");
    document.body.appendChild(this.container);
    this.container.setAttribute("id", "canvas1");

    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      1,
      100
    );
    this.camera.position.set(this.camPos.x, this.camPos.y, this.camPos.z);
    this.camera.rotation.set(this.camRot.x, this.camRot.y, this.camRot.z);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    // scene.fog = new THREE.Fog(0x000000, 0, 1000);

    this.clock = new THREE.Clock();

    //LIGHTS
    this.lightPrimary = new THREE.HemisphereLight(
      0x666666,
      0x1f1f1f,
      this.lightIntensity1
    );
    this.scene.add(this.lightPrimary);

    this.lightSecondary = new THREE.DirectionalLight(0xffffff, 1.35);
    this.lightSecondary.position.set(1, 1, 1);
    this.scene.add(this.lightSecondary);
    this.lightSecondary.castShadow = true;
    const d = 1;
    this.lightSecondary.shadow.camera.left = -d;
    this.lightSecondary.shadow.camera.right = d;
    this.lightSecondary.shadow.camera.top = d;
    this.lightSecondary.shadow.camera.bottom = -d;
    this.lightSecondary.shadow.camera.near = 1;
    this.lightSecondary.shadow.camera.far = 4;
    this.lightSecondary.shadow.bias = -0.002;

    for (let i = 0; i < this.hitBoxLightsPositions.length; i++) {
      let light = new THREE.PointLight(0xffffff, 0, 20, 2);
      light.position.set(
        this.hitBoxLightsPositions[i].x,
        this.hitBoxLightsPositions[i].y,
        this.hitBoxLightsPositions[i].z
      );
      // light.intensity = (0.6);
      this.hitBoxLights.push(light);
      this.scene.add(light);
    }

    // this.hitBoxLights[2].intensity = 0.6;

    console.log(this.hitBoxLights);

    //FLOOR
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000),
      new THREE.MeshPhongMaterial({ color: 0x000000, depthWrite: true })
    );
    mesh.rotation.x = -Math.PI / 2;
    this.scene.add(mesh);

    // LOAD PLANTS
    this.loader = new GLTFLoader();
    for (let i = 0; i < plantsSpecs.length; i++) {
      let plant = new Plant(
        plantsSpecs[i].id,
        plantsSpecs[i].group,
        plantsSpecs[i].position,
        plantsSpecs[i].scale,
        plantsSpecs[i].flip,
        plantsSpecs[i].color,
        plantsSpecs[i].rotation,
        plantsSpecs[i].filePath,
        this.loader,
        this.scene,
        GUI,
        THREE,
        this.plantsMixer
      );
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

  changeLight(index) {
    // https://sbcode.net/threejs/tween/

    this.hitBoxLights.forEach((light, i) => {
      let easing = TWEEN.Easing.Linear.None;
      let intensity = 0;
      if (i == index) {
        intensity = 1;
        easing = TWEEN.Easing.Exponential.In;
      }
      // const intensity = i == index ? 0.6 : 0;
      var tweenLight = new TWEEN.Tween(light)
        .to({ intensity: intensity }, 750)
        .easing(easing)
        .start();
    });
  }

  addListeners() {
    window.addEventListener("resize", this.onWindowResize.bind(this));
    window.addEventListener("keydown", this.keyDown.bind(this));
    // document.body.addEventListener('click', this.onClick.bind(this), true);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
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
      // let pose = event.data.skeleton;
      // // pose.LEFT_WRIST.y < 0.35 &&

      // const pose = this.smoother.smoothDamp();
      // this.skeleton.update(pose);

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (this.debugMode) {
        this.skeleton.show(this.ctx, { color: "red" });

        /*
        //grid and number overlay
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;
        for (let i = 0; i < 2; i++) {
          const h = (this.canvas.height / 3) * (i + 1);
          this.ctx.beginPath();
          this.ctx.moveTo(0, h);
          this.ctx.lineTo(window.innerWidth, h);
          this.ctx.stroke();
          this.ctx.closePath();
        }

        this.ctx.beginPath();

        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        this.ctx.closePath();
        */
      }
      if (this.hands != undefined) {
        this.drawHands();
      }
    }
  }

  keyDown(e) {
    //permet de debug les hitbox en utilisant les touches 1 à 6
    //touche 1

    console.log(e.key);

    const usedNumber = [1, 2, 3, 4, 5, 6];
    const number = parseFloat(e.key);

    if (usedNumber.includes(number)) {
      this.changeLight(number - 1);
    } else if (e.key == " ") {
      this.debugMode = !this.debugMode;
      this.toggleMode();
    }

    // ArrowUp
    // ArrowRight
    // ArrowLeft
    // ArrowDown

    const duration = 1000;
    let easing = TWEEN.Easing.Sinusoidal.Out;

    if (e.key == "ArrowUp") {
      var tweenCamPosition = new TWEEN.Tween(this.camPos)
        .to({ z: this.camPos.z + 1 }, duration)
        .easing(easing)
        .start();
    } else if (e.key == "ArrowDown") {
      var tweenCamPosition = new TWEEN.Tween(this.camPos)
        .to({ z: this.camPos.z - 1 }, duration)
        .easing(easing)
        .start();
    }
    // else if (e.key == "ArrowLeft") {
    //   this.limitCounter++;
    //   console.log(this.boundary(this.limitCounter, -5, 5));
    // } else if (e.key == "ArrowRight") {
    //   this.limitCounter--;
    //   console.log(this.boundary(this.limitCounter, -5, 5));
    // }
  }

  map(value, min1, max1, min2, max2) {
    const ratio = (value - min1) / (max1 - min1);
    return (max2 - min2) * ratio + min2;
  }

  moveCamera(nose, ratio) {
    // ratio is varibale base on the distance beetween to shoulder
    // 0 - 5 | 0 is very far(infinite),  5 close to the screen, 1 around 2.5 meter for average person

    // map the value to "real" distance | meters
    const distance = this.map(ratio, 5, 1, 0, 2.5);
    const duration = 150;

    // docu for animation curve
    // https://sbcode.net/threejs/tween/
    let easing = TWEEN.Easing.Sinusoidal.Out;

    const posZ = 0 - distance * 10;
    const posX = ((nose.x - 0.5) * 2 * 10) / (distance + 0.3);
    var tweenCamPosition = new TWEEN.Tween(this.camPos)
      .to({ x: posX, z: posZ }, duration)
      .easing(easing)
      .start();
    const rotY = this.calcAngle(posX, 200 - posZ);

    var tweenCamRot = new TWEEN.Tween(this.camRot)
      .to({ y: rotY }, duration)
      .easing(easing)
      .start();
  }

  moveCameraWithHands() {
    // const distance = this.map(this.distance, 5, 1, 0, 1);
    const hand = this.hands.left;
    // docu for animation curve
    // https://sbcode.net/threejs/tween/
    let easing = TWEEN.Easing.Sinusoidal.InOut;

    const range = this.cameraRange;
    // console.log(range.z);

    if (hand.visible) {
      const togo = {
        x: this.limit(
          this.map(hand.position.x, 0, 1, range.x[0], range.x[1]),
          range.x[0],
          range.x[1]
        ),
        y: this.limit(
          this.map(hand.position.y, 1, 0, range.y[0], range.y[1]),
          range.y[0],
          range.y[1]
        ),
      };

      const amount = 0.05;
      // this.tracker.x = this.lerp(this.tracker.x, togo.x,amount);
      // this.tracker.y = this.lerp(this.tracker.y, togo.y,amount);

      const duration = 100;

      //     var tweenCamPosition = new TWEEN.Tween(this.camPos)
      //         .to({  x:this.tracker.x ,y: this.tracker.y}, duration)
      //         .easing(easing)
      //         .start();
      // }

      const h = this.hands.left.position;

      this.camPos.x = this.lerp(
        this.camPos.x,
        this.map(h.x, 0, 1, range.x[0], range.x[1]),
        amount
      );
      this.camPos.y = this.lerp(
        this.camPos.y,
        this.map(h.y, 0, 1, range.y[1], range.y[0]),
        amount
      );

      // var tweenCamPosition = new TWEEN.Tween(this.camPos)
      //   .to({ x: togo.x, y: togo.y }, duration)
      //   .easing(easing)
      //   .start();
    }

    // console.log(distance);

    const extrem = this.cameraRangeExtreme;

    for (let d in this.cameraRange) {
      const lRange = this.cameraRange[d];
      //  console.log(d);

      lRange.forEach((value, index) => {
        lRange[index] = this.limit(
          this.map(
            this.distance,
            this.distanceXtm[1],
            this.distanceXtm[0], // real value
            // 3,2, //fake
            extrem.min[d][index],
            extrem.max[d][index]
          ),
          extrem.max[d][index],
          extrem.min[d][index]
        );

        // lRange[index] = this.map(
        //   this.distance,
        //   2,
        //   1,
        //   extrem.min[d][index],
        //   extrem.max[d][index]
        // );

        if (d == "z") {
          // console.log(lRange[index]);
          // console.log(extrem.min[d][index], extrem.max[d][index]);
        }
      });
    }

    // this.camPos.z = this.lerp(this.camPos.z, this.cameraRange.z[0], 0.1);
    this.camPos.z = this.cameraRange.z[0];
    this.ambiantSound.volume = this.limit(
      this.map(this.distance, this.distanceXtm[0], this.distanceXtm[1], 0, 1),
      0,
      1
    );

    // console.log(this.cameraRange.z);

    // console.log(this.camPos.z);
  }

  limit(value, b1, b2) {
    const min = b1 > b2 ? b2 : b1;
    const max = min == b1 ? b2 : b1;
    // console.log(min, max);

    if (value > max) {
      return max;
    } else if (value < min) {
      return min;
    } else {
      return value;
    }
  }

  average(array) {
    var tot = 0;

    array.forEach((elm) => {
      tot += elm;
    });

    return tot / array.length;
  }

  calcAngle(opposite, adjacent) {
    return Math.atan(opposite / adjacent);
  }

  // à refaire avec une array | dans l'idéal un classe
  toggleHitBox(index) {
    const hitboxIndex = index + 1;
    switch (hitboxIndex) {
      case 1:
        // console.log("Hitbox 1 was hit");
        this.bendPlants(plantsBend1);
        // this.tweenCamAndLights(0, 12, 22, -15, 3.5, 0.3, -3.14, 0.6);
        break;
      case 2:
        // console.log("Hitbox 2 was hit");
        this.bendPlants(plantsBend2);
        // this.tweenCamAndLights(1, -12, 20, -20, 3.4, -0.3, -3.14, 0.6);
        break;
      case 3:
        // console.log("Hitbox 3 was hit");
        this.bendPlants(plantsBend3);
        // this.tweenCamAndLights(2, 12, 5, -25, 3.1, 0.3, -3.14, 0.6);
        break;
      case 4:
        // console.log("Hitbox 4 was hit");
        this.bendPlants(plantsBend4);
        // this.tweenCamAndLights(3, -12, 0, -25, 2.9, -0.3, -3.14, 0.6);
        break;
      case 5:
        // console.log("Hitbox 5 was hit");
        this.bendPlants(plantsBend5);
        // this.tweenCamAndLights(4, 10, 1, -20, 3, 0.2, -3.14, 0.8);
        break;
      case 6:
        // console.log("Hitbox 6 was hit");
        this.bendPlants(plantsBend6);
        // this.tweenCamAndLights(5, -10, 1, -20, 3, -0.2, -3.14, 0.8);
        break;
    }
  }

  /// wtf is that ?
  // À changer !!!
  bendPlants(bend) {
    let j = 0;
    let bendDirection;
    //selectionner seulement les plantes du groupe
    for (let i = 0; i < this.plants.length; i++) {
      // console.log(this.plants[i].id)
      // if (groupId == this.plants[i].group) {
      if (this.plants[i].id == bend[j].plantId) {
        bendDirection = bend[j].direction;
        // console.log("bendPlants" + bendDirection);
        if (bendDirection == "bend-l-big" && this.plants[i].flip == false) {
          bendDirection = "bend-r-big";
        } else if (
          bendDirection == "bend-l-small" &&
          this.plants[i].flip == false
        ) {
          bendDirection = "bend-r-small";
        } else if (
          bendDirection == "bend-r-big" &&
          this.plants[i].flip == false
        ) {
          bendDirection = "bend-l-big";
        } else if (
          bendDirection == "bend-r-small" &&
          this.plants[i].flip == false
        ) {
          bendDirection = "bend-l-small";
        }
        if (j < bend.length - 1) {
          j++;
        }
        // console.log(bendDirection)
        this.plants[i].bendTo(bendDirection);
      }
    }
  }

  onPose(event) {
    this.skeleton.update(event.data.skeleton);
    this.smoother.target(event.data.skeleton);

    // console.log(event.data.skeleton.NOSE.x)
    // y: 0 en haut, 1 en bas
    // x: 1 à gauche, 0 à droite

    if (!event.data.skeleton) return;
    let pose = event.data.skeleton;

    //points map and name
    //https://google.github.io/mediapipe/images/mobile/pose_tracking_full_body_landmarks.png

    /*
    // Experimentation with Z axis-position
    // --SPOIL-- it doesn't work as we expecteda, as describre in the link below
    // https://developers.google.com/ml-kit/vision/pose-detection

    const extrem = {
      min:{pos:1000, point:""},
      center:{pos:1000, point:""},
      max:{pos:-1000, point:""}

    }

    console.log(this.round2(distance));

    for (const point in pose) {
      let posZ = this.round2(pose[point].z);
      
      if(posZ > extrem.max.pos){
        extrem.max.pos = posZ;
        extrem.max.point = point;
      }else if(posZ < extrem.min.pos){
        extrem.min.pos = posZ;
        extrem.min.point = point;
      }else if(Math.abs(posZ) < extrem.center.pos){
        extrem.center.pos = Math.abs(posZ);
        extrem.center.point = point;
      }
    }

    console.table(extrem);
    console.log("");
    */

    this.hands = {
      left: this.findHandsCenter(pose, "LEFT"),
      right: MIRRORED * this.findHandsCenter(pose, "RIGHT"),
    };

    // for (let hand in this.hands) {
    //   const h = this.hands[hand];
    //   console.log(h.position.x);
    //   h.position.x = 1 - h.position.x;
    // }

    if (this.hands != undefined) {
      this.checkHitBox();
    }

    this.distance = this.lerp(
      this.distance,
      this.roundx(this.dist(pose.LEFT_SHOULDER, pose.RIGHT_SHOULDER), 2),
      0.1
    );

    // this.distance =
    //   this.roundx(this.dist(pose.LEFT_SHOULDER, pose.RIGHT_SHOULDER),2);
    // this.moveCamera(pose.NOSE, distance);

    this.moveCameraWithHands(); // left hand
    this.checkCamPosition();

    this.HUD();
  }

  checkCamPosition() {
    if (this.hands.left.visible) {
      const grid = { x: 2, y: 3 };
      const pos = this.hands.left.position;
      const zone = {
        x: Math.floor((1 - pos.x) / (1 / grid.x)),
        y: Math.floor(pos.y / (1 / grid.y)),
      };
      const index = grid.x * zone.y + zone.x;
      // console.log("index = " + index);
      if (index != this.lastZone) {
        this.changeLight(index);
      }
      this.lastZone = index;
    }
  }

  HUD() {
    const p = this.camPos;
    document.getElementById("HUD").innerHTML = `x:${readyToPrint(
      p.x,
      this
    )} | dist:${this.round2(this.distance)} z:${readyToPrint(p.z, this)}`;

    function readyToPrint(number, that) {
      const rounded = Math.round(number);
      let string = rounded.toString();
      if (rounded > 0) {
        string = ` ${string}`;
      }
      if (rounded < 10) {
        string = ` ${string}`;
      }

      return string;
    }
  }

  checkHitBox() {
    const boxSize = 1 / 10; //box size/2 --> ray of hit box
    this.hitboxes.forEach((box, index) => {
      //  console.log(this.hands);
      for (let hand in this.hands) {
        const h = this.hands[hand];
        if (this.hands[hand].visible && !box.active) {
          if (this.dist(box, h.position) < boxSize) {
            this.triggerHitBox(index);
          }
        }
      }
    });
  }

  triggerHitBox(index) {
    // console.log(`touching the box ${index + 1}`);
    this.toggleHitBox(index);
    this.delayBodyDetection(`hitBox${index + 1}`, 10000, index);
  }

  findHandsCenter(pose, side) {
    const parts = ["WRIST", "PINKY", "INDEX"];
    const points = [];

    parts.forEach((part) => {
      points.push(pose[`${side}_${part}`]);
    });

    let visibleScore = 0;
    points.forEach((point) => (visibleScore += point.visibility));
    const center = this.centerPoint2D(points);
    return { position: center, visible: visibleScore / points.length > 0.3 };
  }

  centerPoint2D(points) {
    let total = { x: 0, y: 0 };
    points.forEach((point) => {
      total.x += point.x;
      total.y += point.y;
    });

    return { x: 1 - total.x / points.length, y: total.y / points.length };
  }

  round2(number) {
    return Math.round(number * 100) / 100;
  }

  roundx(number, x) {
    const multiplier = Math.pow(10, x);
    return Math.round(number * multiplier) / multiplier;
  }

  drawHands() {
    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 2;

    // this.canvas.width = width;
    // this.canvas.height = height;
    const c = this.canvas;
    const ctx = this.ctx;

    // console.log(this.hands);

    const radius = 50;
    const width = 20;

    for (let hand in this.hands) {
      if (this.hands[hand].visible) {
        const h = this.hands[hand].position;
        if (hand == "left") {
          const x = h.x * c.width;
          var gradient = ctx.createRadialGradient(
            x,
            h.y * c.height,
            radius - 5 - width,
            x,
            h.y * c.height,
            radius - 5
          );
          gradient.addColorStop(0, "rgba(255,255,255,0)");
          gradient.addColorStop(0.5, "rgba(255,255,255,0.5)");
          gradient.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = gradient;

          // ctx.lineWidth = 20;

          ctx.beginPath();
          ctx.arc(x, h.y * c.height, radius, 0, 2 * Math.PI, false);
          ctx.fill();

          // ctx.lineWidth = 5;
          // ctx.strokeStyle = "white";
          // // ctx.fillRect(20, 20, 160, 160);

          // ctx.beginPath();
          // ctx.arc(h.x*c.width, h.y*c.height, 60, 0, 2 * Math.PI, false);
          // ctx.stroke();
        }
      }
    }
  }

  delayBodyDetection(bodyPart, delay, index) {
    const hitboxIndex = index + 1;
    const easing = TWEEN.Easing.Sinusoidal.In;
    const duration = 5000;
    // console.log(index, this.hitboxes[index].active);
    this.hitboxes[index].active = true;

    var that = this;
    setTimeout(() => {
      // console.log(hitboxIndex);
      // var tweenLight = new TWEEN.Tween(that.hitBoxLights[hitboxIndex - 1])
      //   .to({ intensity: 0 }, 10000)
      //   .easing(easing)
      //   .start();
      // var tweenCamPosition = new TWEEN.Tween(that.camPos)
      //   .to({ x: 0, y: 1, z: -35 }, duration)
      //   .easing(easing)
      //   .start();
      // var tweenCamRot = new TWEEN.Tween(that.camRot)
      //   .to({ x: 3, y: 0, z: -3.14 }, duration)
      //   .easing(easing)
      //   .start();
    }, 1000);
    setTimeout(() => {
      this.hitboxes[index].active = false;
    }, delay);
  }

  mapRange(value, low1, high1, low2, high2) {
    return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
  }

  getDistance(x1, y1, x2, y2) {
    let y = x2 - x1;
    let x = y2 - y1;
    return Math.sqrt(x * x + y * y);
  }

  dist(a, b) {
    const x = b.x - a.x;
    const y = b.y - a.y;
    return Math.sqrt(x * x + y * y);
  }

  dist3D(a, b) {
    const x = b.x - a.x;
    const y = b.y - a.y;
    const z = b.z - a.z;
    return Math.sqrt(x * x + y * y + z * z);
  }

  lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }
}

const mediaPipe = new MediaPipeClient();

mediaPipe.on("setup", () => {
  const { video } = mediaPipe;

  MIRRORED = mediaPipe.mirrored ? -1 : 1;
  const app = new App({
    width: video.width,
    height: video.height,
    video,
  });

  console.log(MIRRORED);

  mediaPipe.on("pose", (event) => {
    app.onPose(event);
  });
});
