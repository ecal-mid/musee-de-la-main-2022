export async function getWebcamStream({ width, height, constraints = {} } = {}) {
    const video = document.createElement('video')
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, ...constraints })

    return new Promise(resolve => {
        video.onloadedmetadata = () => {

            video.play()
            video.muted = true
            video.width = width || video.videoWidth
            video.height = height || video.videoHeight
            resolve({ stream, width: video.width, height: video.height, video })
        }

        video.srcObject = stream
    })
}