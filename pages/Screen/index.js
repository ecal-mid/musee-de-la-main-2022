import "~/styles/iframe.scss"
import IFrame from "~/js/IFrame"

import CONFIG from "~/config.js"

window.onload = async () => {
  const MediaPipePose = await import("node:/scripts/mediapipe-pose.js")
  console.log(MediaPipePose);
  // const mediapipe = await MediaPipePose.create({
  //   cameraConstraints: CONFIG.cameraConstraints,
  //   mediaPipeOptions: CONFIG.mediaPipeOptions,
  //   smoothen: CONFIG.smoothenDetection
  // })

  new IFrame()
}