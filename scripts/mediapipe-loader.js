execExternalScript('/scripts/mediapipe-smooth-pose.js', { type: 'module' })
execExternalScript('/scripts/mediapipe-client.js', { type: 'module' })
execExternalScript('/scripts/mediapipe-player.js', { type: 'module' })
execExternalScript('/scripts/mediapipe-pose.js', { type: 'module' })

function execExternalScript(src, options = {}) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        document.head.appendChild(script)
        script.onload = resolve
        script.onerror = reject

        Object.entries(options).forEach(([key, value]) => {
            script[key] = value
        })

        script.src = src
    })
}
