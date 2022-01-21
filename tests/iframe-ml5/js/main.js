import CONFIG from "/config.js"
import Posenet from "/libs/posenet.js";
import { getWebcamStream } from "/utils/video.js";

async function init() {


    const iframes = document.body.querySelectorAll('iframe')
    const webcamStream = await getWebcamStream()

    const posenet = new Posenet()
    await posenet.init({ videoElem: webcamStream.video, mirrored: CONFIG.mirrored })


    iframes.forEach(iframe => {
        iframe.onload = () => {
            const { stream, width, height } = webcamStream
            iframe.contentWindow.init({ stream, width, height, posenet })
        }
        iframe.src = './frames/iframe-posenet/index.html'
    })

}


window.addEventListener('load', init)