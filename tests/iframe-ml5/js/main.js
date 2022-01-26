import CONFIG from "/config.js"
import MediaPipePose from "/libs/MediaPipePose.js"

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

            const { mediaPipe } = iframe.contentWindow
            // iframe.contentWindow.postMessage({ type: 'init', data: '{ pose }' })
            mediaPipe?.setup({ stream: player.stream, width: player.width, height: player.height, pose })
        }
        iframe.src = './frames/iframe-posenet/index.html'
    })

}


window.addEventListener('load', init)