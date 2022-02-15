import "~/styles/iframe.scss"
import IFrame from "~/js/IFrame"
import AudioAllower from "~/js/AudioAllower"

import CONFIG from "~/static/config.js"

import { MediaPipePose } from '@ecal-mid/mediapipe'

// hack parcel..

window.onload = async () => {

  await AudioAllower.allow()

  // await loadMediapipe
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
  const mediaPipe = iframe.contentWindow?.mediaPipe
  console.log(mediaPipe)
  if (!mediaPipe) return
  mediaPipe.setup({ stream: player.stream, width: player.width, height: player.height, pose })
}