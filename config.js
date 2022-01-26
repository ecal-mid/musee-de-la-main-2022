export default Object.freeze({
    smoothenDetection: 0.5, //? between 0 and 1, 0 is no smoothing
    cameraConstraints: {
        audio: false,
        video: true,
        // video: {
        //     deviceId: "977315e0713f6d873c7028ba8221c652a0fcb866e151903ccd95efd5371153b3"
        // }
    },

    mediaPipeOptions: {
        selfieMode: false,
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
    }
})