// make sure serve over https is enabled in the sketch settings window!!
// make noise to grow the circle

let mic;

let states = ["distance", "height", "sound", "width", "position", ];
let state = "distance";
let nbState = 0;

let bottomBox;
let topBox;

let xoff = 0.0;

let paramLevelLine = [50,20,2]; //[positionY,heightY]

let transitionTime = 650;

let speed = 0;
let prevSpeed;
let prevPosX = 0;
let prevPosY = 0;
let prevWidthX = 0;
let prevwidthY = 0;

let prevAccelerationSpeed = 0;

let personTimer = 0;
let maxFramePerson = 4; //secondes

let zone = [];
let timerFactor = 0;

// let img;
let video;
let detector;
let detections = [];
let poses = [];

//THE LOWER THE SLOWER  
let easing = 0.05;

let minHeight = 5;
let marge = 2;

let y = 1;
let prevLevel = 0;

let words = [];

let level = 0;

//PARAM
let sensi = 0;
let limit = 0;

function touchStarted() {
  getAudioContext().resume();
}

function preload() {
  detector = ml5.objectDetector('cocossd');
}

function gotDetections(error, results) {
  if (error) {
    console.error(error);
  }
  detections = results;
  detector.detect(video, gotDetections);
}

function setup() {
  mic = new p5.AudioIn();
  mic.start();

  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);

  topBox = document.getElementById('upBox');
  bottomBox = document.getElementById('downBox');
  levelLine = document.getElementById('level');

  //POSENET
  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function (results) {
    poses = results;
  });

  video.hide();
  detector.detect(video, gotDetections);
}

window.onkeydown = function (event) {
  if (event.keyCode === 32) {
    nbState++;
    if (nbState >= states.length) {
      nbState = 0;
    };

    console.log(nbState);

    changeState(states[nbState]);
  }
};

//SWITCH 
function changeState(param) {

  document.body.style.filter = "invert(100%) saturate(0)";

  timerFactor = 0;

  let upBox = document.getElementById('upBox');
  let downBox = document.getElementById('downBox');

  let oldUpBox = document.getElementById(state + "1");
  let oldDownBox = document.getElementById(state + "2");

  oldUpBox.style.width = "0%";
  oldDownBox.style.width = "0%";

  state = "transition";

  //create divs
  divUp = document.createElement('div');
  divUp.setAttribute("id", param + "1");
  divUp.setAttribute("class", "text");

  divDown = document.createElement('div');
  divDown.setAttribute("id", param + "2");
  divDown.setAttribute("class", "text");

  upBox.appendChild(divUp);
  downBox.appendChild(divDown);

  bottomBox = downBox;
  topBox = upBox;

  divUp.style.width = "0%";
  divDown.style.width = "0%";

  setTimeout(function () {
    divUp.style.width = "100%";
    divDown.style.width = "100%";
  }, 0);

  //
  prevLevel = level;

  // Après le temps
  setTimeout(function () {
    state = param;

    oldUpBox.remove();
    oldDownBox.remove();

    document.body.style.filter = "none";
  }, transitionTime);
}

/*
setInterval(() => {
  if (poses == "") {
    console.log("there is no one " + personTimer);
    personTimer++;
    if (personTimer == maxFramePerson) {
      changeState("yes");
    }
  } else {
    if (personTimer > 0) {
      let randomState = states[Math.floor(Math.random() * (states.length))];

      changeState(randomState);
    }
    personTimer = 0;
  }
}, 1000);
*/

//DRAW
function draw() {
  clear();

  // We can call both functions to draw all keypoints and the skeletons
  //drawKeypoints();


  /*
  let nbPoints = 0;

  //
  if (poses != "") {

    nbPoints++;

  }
  */

/*
  //-----------------------------------------------------------OUI NON - screen saver
  if (state == "yes") {

    xoff = xoff + 0.05;
    level = noise(xoff);

    //console.log(level);

    //PARAM
    sensi = 100;
    limit = 100;
    easing = 0.05;

    // map level
    level = map(level, 0.3, 0.7, 0, sensi);
  }
  */

  //-----------------------------------------------------------SOUND
  if (state == "sound") {
    // get the loudness
    level = mic.getLevel();

    //PARAM
    sensi = 500;
    limit = 100;
    easing = 0.05;

    paramLevelLine = [60,60,1.1];

    // map the loudness from 0 - 1, to 5 - 200
    level = map(level, 0, 0.3, 0, sensi);

  }
  //-----------------------------------------------------------DISTANCE
  if (state == "distance") {

    for (let i = 0; i < detections.length; i++) {
      let object = detections[i];
      if (object.label == "person") {
        level = object.width + object.height;
      }
    }

    //console.log(level);

    //PARAM
    sensi = 100;
    limit = 100;
    easing = 0.05;

    paramLevelLine = [80,5,1.1];

    // map level
    level = map(level, 300, 800, 0, sensi);
  }
  //-----------------------------------------------------------WIDTH
  if (state == "width") {

    for (let i = 0; i < detections.length; i++) {
      let object = detections[i];
      if (object.label == "person") {
        level = object.height / object.width;
        //console.log(level);
      }
    }

    //PARAM
    sensi = 100;
    limit = 100;
    easing = 0.03;

    paramLevelLine = [20,10,1.1];

    // map level
    level = map(level, 0.6, 1.7, 0, sensi);
  }

  /*
  //-----------------------------------------------------------SPEED
  if (state == "speed") {


    let accelerationSpeed = 0;
    speed = 0;

    /*
    if (poses[0] != undefined) {
      //POSENET VERSION
      //ne voir que une personne
      let pose = poses[0].pose;
      //boucle de 17 points
      for (let j = 0; j < pose.keypoints.length; j++) {
        let keypoint = pose.keypoints[j];
        // boucle des points certains
        if (keypoint.score > 0.2) {
          //nose
          if (j == 0) {
            speed += keypoint.position.x;
            speed += keypoint.position.y;
          }
        }
      }
    }

    accelerationSpeed = prevSpeed - speed;
    accelerationSpeed = Math.abs(accelerationSpeed);

    if (prevSpeed != speed) {
      //console.log(accelerationSpeed);
    }
*/
    
/*
    //OBJECT DETECTION VERSION
    for (let i = 0; i < detections.length; i++) {
      let object = detections[i];
      if (object.label == "person") {
        speed = object.height + object.width + object.x + object.y;
      }
    }
    accelerationSpeed = Math.abs(speed - prevSpeed);

    console.log(accelerationSpeed);
    
    paramLevelLine = [80,40,1.2];

    //PARAM
    sensi = 1000;
    limit = 100;
    easing = 0.05;
    
      // map level
      level = map(accelerationSpeed, 5, 15, 0, sensi);
    
  }
  prevSpeed = speed;
*/
/*
  //-----------------------------------------------------------COLOR

  if (state == "color") {

    let red = 0;
    let blue = 0;

    video.loadPixels();

    for (let y = 0; y < video.height / 10; y++) {
      for (let x = 0; x < video.width / 10; x++) {

        // at the current position, get the red
        // value (an approximation for brightness)
        // and use it to create the diameter
        let index = (y * video.width + x) * 40;
        red += video.pixels[index];
        green += video.pixels[index + 1];
        blue += video.pixels[index + 2];
      }
    }


    //console.log("red = " + red);
    //console.log("blue = " + blue);

    level = blue / red;

    //console.log(level);

    //PARAM
    sensi = 100;
    limit = 100;
    easing = 0.05;

    // map level
    level = map(level, 0.5, 1, 0, sensi);

  }
  */

  //-----------------------------------------------------------POSITION
  if (state == "position") {

    if (poses[0] != undefined) {
      //POSENET VERSION
      //ne voir que une personne
      let pose = poses[0].pose;
      //boucle de 17 points
      for (let j = 0; j < pose.keypoints.length; j++) {
        let keypoint = pose.keypoints[j];
        // boucle des points certains
        if (keypoint.score > 0.2) {
          //nose
          if (j == 0) {
            level = keypoint.position.x;
          }
        }
      }
    }

    //console.log(level);

    //PARAM
    sensi = 100;
    limit = 100;
    easing = 0.1;

    paramLevelLine = [50,5,1.1];

    // map level
    level = map(level, 640, 0, 0, sensi);
  }

  //-----------------------------------------------------------HEIGHT
  if (state == "height") {

    for (let i = 0; i < detections.length; i++) {
      let object = detections[i];
      if (object.label == "person") {
        level = object.height / object.width;
        console.log(level);
      }
    }

    //PARAM
    sensi = 100;
    limit = 100;
    easing = 0.06;

    paramLevelLine = [10,10,1.1];

    // map level
    level = map(level, 0.8, 1.8, 0, sensi);
  }

  /*
  //-----------------------------------------------------------HUMAN
  if (state == "humain") {

    for (let i = 0; i < detections.length; i++) {
      let object = detections[i];
      if (object.label == "person") {
        level = object.confidence;
        //console.log(level);
      }
    }

    //PARAM
    sensi = 100;
    limit = 100;
    easing = 0.02;

    // map level
    level = map(level, 0.82, 0.93, 0, sensi);
  }
*/

  prevSpeed = speed;

  //limitation taille du haut
  if (level >= limit) {
    level = limit;
  }
  if (level <= 0) {
    level = 0;
  }

  //EASING
  let targetY = level;
  let dy = targetY - y;
  y += dy * easing;

  //Y
  topBox.style.height = "calc(" + map(y, limit, 0, 0 + minHeight, 100 - minHeight) + "% - " + marge / 2 + "vw)"; //calc(y + marge)
  bottomBox.style.height = "calc(" + map(y, 0, limit, 0 + minHeight, 100 - minHeight) + "% - " + marge / 2 + "vw)";

  //levelLine.style.bottom = map(paramLevelLine[0], 0, 100, marge, 100 - marge*2) - map(paramLevelLine[1],0,100,marge, 100 - marge*2)/2 + marge + "vh";
  //levelLine.style.height = map(paramLevelLine[1],0,100,marge, 100 - marge*2) - marge/2 + "vh";

  let grad1 = map(paramLevelLine[0], 0, 100, marge, 100 - marge*2) - map(paramLevelLine[1],0,100,marge, 100 - marge*2)/2 + marge*2 - map(paramLevelLine[1],0,100,marge, 100 - marge*2)/2 - timerFactor/10;
  let grad2 = map(paramLevelLine[0], 0, 100, marge, 100 - marge*2) - map(paramLevelLine[1],0,100,marge, 100 - marge*2)/2 + marge*2;
  let grad3 = map(paramLevelLine[0], 0, 100, marge, 100 - marge*2) - map(paramLevelLine[1],0,100,marge, 100 - marge*2)/2 + marge*2 + map(paramLevelLine[1],0,100,marge, 100 - marge*2)/2 + timerFactor/10;

  levelLine.style.background = "linear-gradient(0deg, rgba(" 

  + 0 + "," 
  + 0 + "," 
  + 255 + ", " 
  + timerFactor/200 + ") " 
  + grad1 + "%, rgb(" 

  + (255 - timerFactor*2) + "," 
  + (0 + timerFactor*2) + "," 
  + 0 + ", " 
  + 1 + ") " 
  + grad2 + "%, rgb(" 

  + 0 + "," 
  + 0 + "," 
  + 255 + ", " 
  + timerFactor/200 + ") " 
  + grad3 + "%)";


  //levelLine.style.transform = "scale(" + timerFactor + ")";
  //console.log(y);

  if(y <= paramLevelLine[0] + paramLevelLine[1]/2 + minHeight/2 && y >= paramLevelLine[0] - paramLevelLine[1]/2){
    //levelLine.style.background = "green";
    timerFactor = timerFactor * paramLevelLine[2];
    if(timerFactor >= 800){
      timerFactor =  800;

      nbState++;
      if (nbState >= states.length) {
        nbState = 0;
      };
  
      console.log(nbState);
  
      changeState(states[nbState]);
    }
  }else{
    //levelLine.style.background = "red";
    timerFactor = timerFactor / paramLevelLine[2];
    if(timerFactor <= 1){
      timerFactor = 1;
    }
  }
}

