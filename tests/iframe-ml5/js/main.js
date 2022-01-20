import { getWebcamStream } from "/utils/video.js";

async function init() {

    const webcamStream = await getWebcamStream()
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