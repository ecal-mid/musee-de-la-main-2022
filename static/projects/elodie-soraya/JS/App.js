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




class App {
  constructor({ width, height, video }) {
    this.debugMode = false;
    this.container, this.stats, this.clock, this.loader;

    this.mixers = [];
    this.camera, this.scene, this.renderer, this.model, this.face;
    this.plants = [];
    this.plantsMixer = [];

    this.camPos = { x: 0, y: -1, z: -35 };
    this.camRot = { x: 3, y: 0, z: -3.14 };

    this.skeleton;
    this.smoother;

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

    this.bodyPartsAreOn = {
      hitBox1: false,
      hitBox2: false,
      hitBox3: false,
      hitBox4: false,
      hitBox5: false,
      hitBox6: false,
    };

    this.hitboxes = [
      {x:3/4, y:1/6, active : false},
      {x:1/4, y:1/6, active : false},
      {x:3/4, y:3/6, active : false},
      {x:1/4, y:3/6, active : false},
      {x:3/4, y:5/6, active : false},
      {x:1/4, y:5/6, active : false}
    ]


    this.ambiantSound;
    this.soundEffectLeft;
    this.soundEffectRight;
    this.composer;

    //! sound
    this.ambiantSound = new Audio("./sounds/forest_long_loop.mp3");
    this.ambiantSound.oncanplay = this.ambiantSound.play;

    this.soundEffectLeft = new Audio("./sounds/forest_short_left.mp3");
    this.soundEffectRight = new Audio("./sounds/forest_short_right.mp3");

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
    this.container = document.createElement("div");
    document.body.appendChild(this.container);
    this.container.setAttribute("id", "canvas1");

    this.camera = new THREE.PerspectiveCamera(
      25,
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
      this.hitBoxLights.push(light);
      this.scene.add(light);
    }

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

    if(!this.debugMode){
      console.log("hide video");
      // document.getElemen("video").style.display = "none";
      document.querySelector('video').style.display = "none";
    }

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.container.appendChild(this.renderer.domElement);

    this.animate();
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

  // onClick() {
  //     console.log('test')
  //     this.ambiantSound.play();
  // }

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
     
      const pose = this.smoother.smoothDamp();
      this.skeleton.update(pose);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if(this.debugMode){
        // display skeleton mode
        this.skeleton.show(this.ctx, { color: "red" });


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
      }
      if(this.hands != undefined){
        this.drawHands();
      }
      
      
    }
  }

  keyDown(e) {
    //permet de debug les hitbox en utilisant les touches 1 à 6
    //touche 1

    if (e.key == "1") {
      this.toggleHitBox(1);
      this.delayBodyDetection("hitBox1", 5000, 1);
      this.soundEffectLeft.currentTime = 0;
      this.soundEffectLeft.play();
    }
    //touche 2
    if (e.key == "2") {
      this.toggleHitBox(2);
      this.delayBodyDetection("hitBox2", 5000, 2);
      this.soundEffectRight.currentTime = 0;
      this.soundEffectRight.play();
    }
    //touche 3
    if (e.key == "3") {
      this.toggleHitBox(3);
      this.delayBodyDetection("hitBox3", 5000, 3);
      this.soundEffectLeft.currentTime = 0;
      this.soundEffectLeft.play();
    }
    //touche 4
    if (e.key == "4") {
      this.toggleHitBox(4);
      this.delayBodyDetection("hitBox4", 5000, 4);
      this.soundEffectRight.currentTime = 0;
      this.soundEffectRight.play();
    }
    //touche 5
    if (e.key == "5") {
      this.toggleHitBox(5);
      this.delayBodyDetection("leftKnee", 5000, 5);
      this.soundEffectLeft.currentTime = 0;
      this.soundEffectLeft.play();
    }
    //touche 6
    if (e.key == "6") {
      this.toggleHitBox(6);
      this.delayBodyDetection("rightKnee", 5000, 6);
      this.soundEffectRight.currentTime = 0;
      this.soundEffectRight.play();
    }

    // ArrowUp
    // ArrowRight
    // ArrowLeft
    // ArrowDown

    const duration = 1000;

    // docu for animation curve 
    // https://sbcode.net/threejs/tween/
    let easing = TWEEN.Easing.Sinusoidal.Out;

    if (e.key == "ArrowLeft") {
      var tweenCamRot = new TWEEN.Tween(this.camRot)
        .to({  y: this.camRot.y+0.1}, duration)
        .easing(easing)
        .start();
    }

    if (e.key == "ArrowRight") {
      var tweenCamRot = new TWEEN.Tween(this.camRot)
      .to({  y: this.camRot.y-0.1}, duration)
      .easing(easing)
      .start();
    }
    
  }

  map(value, min1, max1, min2, max2){
    const ratio = (value-min1)/(max1-min1)
    return ((max2-min2)*ratio)+ min2;
  }

  moveCamera(nose, ratio){
    // ratio is varibale base on the distance beetween to shoulder
    // 0 - 5 | 0 is very far(infinite),  5 close to the screen, 1 around 2.5 meter for average person

    // map the value to "real" distance | meters
    const distance = this.map(ratio,5,1,0,2.5);
    const duration = 150;


    // docu for animation curve 
    // https://sbcode.net/threejs/tween/
    let easing = TWEEN.Easing.Sinusoidal.Out;

    const posZ = -35 - distance*10;
    const posX = ((nose.x-0.5)*2)*10/(distance+0.3);
    var tweenCamPosition = new TWEEN.Tween(this.camPos)
        .to({  x: posX, z:posZ}, duration)
        .easing(easing)
        .start();
    const rotY =  this.calcAngle(posX, 200-posZ);
   
    var tweenCamRot = new TWEEN.Tween(this.camRot)
        .to({  y: rotY}, duration)
        .easing(easing)
        .start();
  }

  calcAngle(opposite, adjacent) {
    return Math.atan(opposite / adjacent);
  }

  // à refaire avec une array | dans l'idéal un classe
  toggleHitBox(hitboxIndex) {
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

  tweenCamAndLights(hitboxIndex, x1, y1, z1, x2, y2, z2, lightIntensity) {
    let easing = TWEEN.Easing.Sinusoidal.InOut;
    let duration = 1000;
    var tweenLight = new TWEEN.Tween(this.hitBoxLights[hitboxIndex])
      .to({ intensity: lightIntensity }, duration)
      .easing(easing)
      .start();
    var tweenCamPosition = new TWEEN.Tween(this.camPos)
      .to({ x: x1, y: y1, z: z1 }, duration)
      .easing(easing)
      .start();
    var tweenCamRot = new TWEEN.Tween(this.camRot)
      .to({ x: x2, y: y2, z: z2 }, duration)
      .easing(easing)
      .start();
  }


  /// wtf is that shit ? 
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
    
    

    //points maps and name
    //https://google.github.io/mediapipe/images/mobile/pose_tracking_full_body_landmarks.png



    /*
    // Experimentation with Z axis-position
    // --SPOIL-- it doesn't work as we expected link below
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
    this.hands = {left:this.findHandsCenter(pose, "LEFT"), right: this.findHandsCenter(pose, "RIGHT")};

    if(this.hands != undefined){
      this.checkHitBox();
    }


    /*//HAUT GAUCHE
    if (
      pose.LEFT_WRIST.y < 0.35 &&
      pose.LEFT_WRIST.x > 0.7 &&
      this.bodyPartsAreOn.hitBox1 == false
    ) {
      console.log("hitbox 1");
      this.toggleHitBox(1);
      this.delayBodyDetection("hitBox1", 10000, 1);
    }


  

    
    //HAUT DROITE
    if (
      pose.RIGHT_WRIST.y < 0.35 &&
      pose.RIGHT_WRIST.x < 0.3 &&
      this.bodyPartsAreOn.hitBox2 == false
    ) {
      // console.log("bended");
      this.toggleHitBox(2);
      this.delayBodyDetection("hitBox2", 10000, 2);
    }

    //MILIEU GAUCHE
    if (
      pose.LEFT_WRIST.y > 0.35 &&
      pose.LEFT_WRIST.y < 0.5 &&
      pose.LEFT_WRIST.x > 0.7 &&
      this.bodyPartsAreOn.hitBox3 == false
    ) {
      console.log("hitbox 3");
      this.toggleHitBox(3);
      this.delayBodyDetection("hitBox3", 10000, 3);
    }

    //MILIEU DROITE
    if (
      pose.RIGHT_WRIST.y > 0.35 &&
      pose.RIGHT_WRIST.y < 0.5 &&
      pose.RIGHT_WRIST.x < 0.3 &&
      this.bodyPartsAreOn.hitBox4 == false
    ) {
      // console.log("bended");
      this.toggleHitBox(4);
      this.delayBodyDetection("hitBox4", 10000, 4);
    }

    //BAS GAUCHE
    if (pose.LEFT_ANKLE.x > 0.7 && this.bodyPartsAreOn.hitBox5 == false) {
      // console.log("bended");
      this.toggleHitBox(5);
      this.delayBodyDetection("hitBox5", 10000, 5);
    }

    //BAS DROITE
    if (pose.RIGHT_ANKLE.x < 0.3 && this.bodyPartsAreOn.hitBox6 == false) {
      // console.log(pose.RIGHT_ANKLE.x);
      // console.log("bended");
      this.toggleHitBox(6);
      this.delayBodyDetection("hitBox6", 10000, 6);
    }*/

    const distance = this.dist3D(pose.LEFT_SHOULDER, pose.RIGHT_HEEL)
    this.moveCamera(pose.NOSE, distance);
    
    
  }

  checkHitBox(){
    const boxSize  = 1/10 ; //box size/2 --> ray of hit box
   this.hitboxes.forEach((box,index) =>{
    //  console.log(this.hands);
      for(let hand in this.hands){
        const h = this.hands[hand];
        if(this.hands[hand].visible && !box.active){
          if(this.dist(box, h.position)<boxSize){
            this.triggerHitBox(index)
          }
        }
      }
   })
  }

  triggerHitBox(index){
      console.log(`toucing the box ${index + 1}`);
      this.toggleHitBox(index+1);
      this.delayBodyDetection(`hitBox${index+1}`, 10000, index);
  }


  findHandsCenter(pose, side){
    const parts = ["WRIST", "PINKY","INDEX"];
    const points = [];
  
    parts.forEach(part => {
      points.push(pose[`${side}_${part}`])
      
    });

    let visibleScore = 0;
    points.forEach(point => visibleScore+= point.visibility)
    const center = this.centerPoint2D(points)
    return {position:center, visible : (visibleScore/points.length)>0.3};
  }

  centerPoint2D(points){
    let total = {x:0, y:0};
    points.forEach(point =>{
      total.x += point.x;
      total.y += point.y;
    })

    return {x : total.x/points.length, y: total.y/points.length}
  }

  round2(number){
    return (Math.round(number*100)/100)
  }

  drawHands(){

    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 2;

    // this.canvas.width = width;
    // this.canvas.height = height;
    const c = this.canvas;
    const ctx = this.ctx;

    // console.log(this.hands);

    for(let hand in this.hands){
      if(this.hands[hand].visible){
        const h = this.hands[hand].position;
        ctx.beginPath();
        ctx.arc(h.x*c.width, h.y*c.height, 30, 0, 2 * Math.PI, false);
        ctx.stroke();
      }
    };


    // dessiner un cercle pour chaque main dans le canvas;
    // console.log(this.round2(hands[1].y));
  }

  delayBodyDetection(bodyPart, delay,index ) {
    const hitboxIndex = index +1;
    const easing = TWEEN.Easing.Sinusoidal.In;
    const duration = 5000;
    // console.log(index, this.hitboxes[index].active);
    this.hitboxes[index].active = true;

    var that = this;
    setTimeout(() =>{
      // console.log(hitboxIndex);
      var tweenLight = new TWEEN.Tween(that.hitBoxLights[hitboxIndex - 1])
        .to({ intensity: 0 }, 10000)
        .easing(easing)
        .start();
      // var tweenCamPosition = new TWEEN.Tween(that.camPos)
      //   .to({ x: 0, y: 1, z: -35 }, duration)
      //   .easing(easing)
      //   .start();
      // var tweenCamRot = new TWEEN.Tween(that.camRot)
      //   .to({ x: 3, y: 0, z: -3.14 }, duration)
      //   .easing(easing)
      //   .start();
    }, 1000);
    setTimeout(()=> {
      this.hitboxes[index].active = false;;
   
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
    const z = b.z - a.z
    return Math.sqrt(x * x + y * y + z*z);
}
}

const mediaPipe = new MediaPipeClient();

mediaPipe.on("setup", () => {
  const { video } = mediaPipe;

  const app = new App({
    width: video.width,
    height: video.height,
    video,
  });

  mediaPipe.on("pose", (event) => {
    app.onPose(event);
  });
});
