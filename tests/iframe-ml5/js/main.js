import { getWebcamStream } from "/utils/video.js";

async function init() {

    const webcamStream = await getWebcamStream()

    const iframes = document.body.querySelectorAll('iframe')

    //     (async () => {

    iframes.forEach(iframe => {
        iframe.onload = () => {
            const { stream, width, height } = webcamStream
            const { document } = iframe.contentWindow
            const video = document.body.querySelector('video')
            video.srcObject = stream
            video.play()
            // iframe.width = width
            // iframe.height = height
        }
        iframe.src = './frames/iframe-posenet/index.html'
    })
    //     })()


}


window.addEventListener('load', init)