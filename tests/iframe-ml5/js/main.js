import CONFIG from "/config.js"
import Posenet from "/libs/posenet.js";
import EventBus from "/libs/event-bus.js"
import { getWebcamStream } from "/utils/video.js";

async function init() {
    const webcamStream = await getWebcamStream()
    // const videoElem = document.createElement('video')
    // videoElem.width = webcamStream
    const posenet = new Posenet()
    await posenet.init({ videoElem: webcamStream.video, mirrored: CONFIG.mirrored })

    posenet.addEventListener('pose', (pose) => {
        console.log(pose)
    })

    return;

    const iframes = document.body.querySelectorAll('iframe')
    const videos = []

    // window.addEventListener('click', () => {
    //     videos.forEach(video => {
    //         video.play()
    //     })
    // })

    iframes.forEach(iframe => {
        iframe.onload = () => {
            const { stream, width, height } = webcamStream
            const { document } = iframe.contentWindow

            const video = document.body.querySelector('video')

            video.srcObject = stream
            video.width = width
            video.muted = true //! video must be muted for autoplay
            video.play()
            video.height = height
            videos.push(video)
        }
        iframe.src = './frames/iframe-posenet/index.html'
    })
    //     })()


}


window.addEventListener('load', init)