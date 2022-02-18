import "~/styles/iframe.scss";
import IFrame from "~/js/IFrame";
import AudioAllower from "~/js/AudioAllower";
import { MediaPipePose } from "@ecal-mid/mediapipe";

let p5Microphone;

const CONFIG = {
  smoothenDetection: 0.5, //? between 0 and 1, 0 is no smoothing
  cameraConstraints: {
    audio: false,
    video: {
      width: 1080,
      height: 1920,
      // deviceId: "977315e0713f6d873c7028ba8221c652a0fcb866e151903ccd95efd5371153b3"
    },
  },

  mediaPipeOptions: {
    selfieMode: true, // mirror mode
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: false,
    smoothSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  },
};

//! use the self called setup function from p5 to use microphone (for jamy project)
window.setup = async () => {
  await AudioAllower.allow();

  p5Microphone = new p5.AudioIn();
  p5Microphone.start();

  const pose = await MediaPipePose.create({
    cameraConstraints: CONFIG.cameraConstraints,
    mediaPipeOptions: CONFIG.mediaPipeOptions,
    smoothen: CONFIG.smoothenDetection,
  });

  const player = pose.getVideoPlayer();
  pose.startDetection();

  const frame = new IFrame();

  frame.onFrameLoad = (event) =>
    insertIFrame({ player, iframe: event.target, pose });

  const iframe = document.querySelector("#frame");
  iframe.src = "/projects/melanie/index.html";

  const overlayFrame = document.querySelector("#overlay");
  overlayFrame.onload = (event) =>
    insertIFrame({ player, iframe: event.target, pose });
  overlayFrame.src = "/pages/ExpoOverlay/tmp_gael.html";
  overlayFrame.classList.add("hide");
};

function insertIFrame({ player, pose, iframe }) {
  const { mediaPipe, microphone } = iframe.contentWindow || {};

  mediaPipe?.setup({
    stream: player.stream,
    width: player.width,
    height: player.height,
    pose,
    mirrored: CONFIG.mediaPipeOptions.selfieMode,
  });

  microphone?.plugIn(p5Microphone);
}
