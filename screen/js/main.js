import CONFIG from "/config.js"
import MediaPipePose from "/scripts/mediapipe-pose.js"
import { delay } from "/utils/time.js"

async function init() {

    const iframes = document.body.querySelectorAll('iframe') //? dynamic list
    const pose = await MediaPipePose.create({
        cameraConstraints: CONFIG.cameraConstraints,
        mediaPipeOptions: CONFIG.mediaPipeOptions,
        smoothen: CONFIG.smoothenDetection
    })

    const player = pose.getVideoPlayer()

    pose.startDetection()

    iframes.forEach(iframe => {
        iframe.onload = () => {
            // await delay(10)
            const { mediaPipe } = iframe.contentWindow
            mediaPipe?.setup({ stream: player.stream, width: player.width, height: player.height, pose })
        }
        iframe.src = '/boilerplates/p5-example/index.html'
    })

}


window.addEventListener('load', init)