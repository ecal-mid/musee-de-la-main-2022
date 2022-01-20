export async function getWebcamStream({ width, height } = {}) {
    const video = document.createElement('video')
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })

    return new Promise(resolve => {
        video.onloadedmetadata = () => {

            // video.play()
            video.width = width || video.videoWidth
            video.height = height || video.videoHeight
            resolve({ stream, width: video.width, height: video.height })
        }

        video.srcObject = stream
    })
}