import "~/styles/iframe.scss"
import IFrame from "~/js/IFrame"
import AudioAllower from "~/js/AudioAllower"

import CONFIG from "~/static/config.js"

import { MediaPipePose } from '@ecal-mid/mediapipe'
// import * as p5 from 'p5'


let p5Microphone

// window.setup = () => {
//   microphone = new p5.AudioIn();
//   microphone.start();
// }

//! use the self called setup function from p5 to use microphone (for jamy project)
window.setup = async () => {
  await AudioAllower.allow()

  p5Microphone = new p5.AudioIn();
  p5Microphone.start();

  const pose = await MediaPipePose.create({
    cameraConstraints: CONFIG.cameraConstraints,
    mediaPipeOptions: CONFIG.mediaPipeOptions,
    smoothen: CONFIG.smoothenDetection
  })

  const player = pose.getVideoPlayer()
  pose.startDetection()

  const frame = new IFrame()

  frame.onFrameLoad = (event) => insertIFrame({ player, iframe: event.target, pose })

  const iframe = document.querySelector('#frame')
  iframe.src = "/projects/melanie/index.html"

  const overlayFrame = document.querySelector('#overlay')
  overlayFrame.onload = (event) => insertIFrame({ player, iframe: event.target, pose })
  // overlayFrame.src = '/pages/ExpoOverlay'
}

function insertIFrame({ player, pose, iframe }) {
  const { mediaPipe, applyMicrophone } = iframe.contentWindow || {}

  mediaPipe?.setup({
    stream: player.stream,
    width: player.width,
    height: player.height,
    pose,
    mirrored: CONFIG.mediaPipeOptions.selfieMode,
  })

  applyMicrophone?.(p5Microphone)
}