let mic;

function setup() {
  createCanvas(710, 200);

  // Create an Audio input
  mic = new p5.AudioIn();

  // start the Audio Input.
  // By default, it does not .connect() (to the computer speakers)
  
}

window.onclick = ()=> {
    mic.start()
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }
    console.log('click')
}

function draw() {
  
  let vol = mic.getLevel();

    console.log(vol)
}
