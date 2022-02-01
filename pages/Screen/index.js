import "~/styles/iframe.scss"
import IFrame from "~/js/IFrame"

import CONFIG from "~/static/config.js"
import { execExternalScript } from '~/static/utils/file.js'

// hack parcel..
const loadMediapipe = execExternalScript('/scripts/mediapipe-pose.js', { type: 'module' })

window.onload = async () => {

  await loadMediapipe
  const pose = await window.MediaPipePose.create({
    cameraConstraints: CONFIG.cameraConstraints,
    mediaPipeOptions: CONFIG.mediaPipeOptions,
    smoothen: CONFIG.smoothenDetection
  })

  const player = pose.getVideoPlayer()
  pose.startDetection()

  const frame = new IFrame()
  
  frame.onFrameLoad = function (event) {
    const iframe = event.target
    const mediaPipe = iframe.contentWindow?.mediaPipe
    if (!mediaPipe) return
    mediaPipe.setup({ stream: player.stream, width: player.width, height: player.height, pose })
  }
}