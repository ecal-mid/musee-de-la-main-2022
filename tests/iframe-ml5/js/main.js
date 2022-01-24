import CONFIG from "/config.js"
// import Posenet from "/libs/posenet.js";
import { VideoPlayer } from "/utils/video.js";

import 'https://cdn.jsdelivr.net/npm/@mediapipe/pose@latest/pose.js'
import "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
import "https://unpkg.com/ml5@latest/dist/ml5.min.js"

async function init() {

    const iframes = document.body.querySelectorAll('iframe')
    // const webcamStream = await getWebcamStream({ constraints: CONFIG.cameraConstraints }).catch(console.error)
    const videoPlayer = await VideoPlayer.getStream({ constraints: CONFIG.cameraConstraints })
    // console.log(videoPlayer)
    
    const pose = new window.Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    });
    
    pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: true,
        smoothSegmentation: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    pose.onResults(async (results) => {
        const { poseLandmarks } = results
        console.log(poseLandmarks)
    });
    
    videoPlayer.addEventListener('frame', async (event) => {
        await pose.send({ image: event.data.video })
    })
    
    videoPlayer.play()
    
    // return;

    // const posenet = new Posenet()
    // await posenet.init({ videoElem: webcamStream.video, mirrored: CONFIG.mirrored })

    iframes.forEach(iframe => {
        iframe.onload = () => {
            // const { stream, width, height } = webcamStream
            // iframe.contentWindow.init({ stream, width, height, posenet })
        }
        iframe.src = './frames/iframe-posenet/index.html'
    })

}


window.addEventListener('load', init)