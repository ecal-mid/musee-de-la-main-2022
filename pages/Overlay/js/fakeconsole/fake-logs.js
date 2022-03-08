import prettyBytes from 'pretty-bytes'
import { random, fillArray } from '../utils/object'
import * as TEXTS from './text/texts'
import { LOGS } from './logs.js'

export const messages = {
    errors: [
        "HTTP Error 500 (Internal Server Error)",
        "HTTP Error 403 (Forbidden)",
        "HTTP Error 404 (Not Found)",
        "HTTP Error 400 (Bad Request)",
        "HTTP Error 401 (Unauthorized)",
    ],
    loading: [
        "asset",
        "download",
        "sound",
        "model",
        "pose",
        "3D asset",
        "video mp4/h.264"
    ],
    files: [
        "f50584a.js",
        "Script15670f0.js",
        "Script494d42c.js",
        "Scripta1c687e.js",
        "Script07bb84e.js",
        "Script4fbd366.js",
        "Script9a76944.js",
        "Script88ac419.js",
        "Imagelogo.svg",
        "extn-utils.html",
        "Scriptextn-utils.js",
        "pose_tracking_example.gif",
        "Imagepose_tracking_pck_chart.png",
        "Imagepose_tracking_detector_vitruvian_man.png",
        "Imagepose_tracking_full_body_landmarks.png",
        "Imagelogo_horizontal_color.png",
        "Mediapose_world_landmarks.mp4",
        "Mediapose_segmentation.mp4",
        "XHRsearch-data.json",
        "Documentextn-utils.html",
        "Scriptextn-utils.js",
    ],
    logs: LOGS
}

export function randomWeight() {
    // return prettyBytes(random(1000, 1e+12))
    return prettyBytes(random(1000, 1e+8))
}

function generateText(Text) {
    const parts = []

    if (Text === TEXTS.TextLog) {
        parts.push(random(messages.logs))
    } else if(Text === TEXTS.TextFail){
        parts.push(random(messages.errors))
    } else {
        parts.push(
            random(messages.files),
            randomWeight(),
        )
    }

    return parts.join('\n')
}

export function getRandomTextType() {

    const texts = [
        ...fillArray(5, TEXTS.TextFail),
        ...fillArray(50, TEXTS.TextLoading),
        ...fillArray(5, TEXTS.TextWarn),
        ...fillArray(5, TEXTS.TextSuccess),
        ...fillArray(20, TEXTS.TextLog),
    ]

    return random(texts)
}

export function generateEntry(params = {}, Text = getRandomTextType()) {

    const options = {
        lifeSpan: random(5000, 10000),
        text: generateText(Text),
        ...params
    }

    return new Text(options)

}