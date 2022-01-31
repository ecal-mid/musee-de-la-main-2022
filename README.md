# Examples
1. **download boilerplates** ([folder](/boilerplates), [download](https://minhaskamal.github.io/DownGit/#/home?url=https://github.com/ecal-mid/musee-de-la-main-2022/tree/d44d1b5ecc8feb16583fb3de453c856863f89c2b/boilerplates))
3. Run these folders with a http server / live server
4. Go to your localhost (with the proper port) [localhost:5500/boilerplates](http://localhost:5500/boilerplates/)

### Scripts
- Skeleton - [skeleton.js](https://mediapipe.ecal-mid.ch/scripts/skeleton.js) ([doc](#Skeleton))
- MediaPipeClient - [mediapipe-client.js](https://mediapipe.ecal-mid.ch/scripts/mediapipe-client.js) ([doc](#MediaPipeClient))
- MediaPipeSmoothPose - [mediapipe-smooth-pose.js](https://mediapipe.ecal-mid.ch/scripts/mediapipe-smooth-pose.js) ([doc](#MediaPipeSmoothPose))
- MediaPipePlayer (+ Recorder) - [mediapipe-player.js](https://mediapipe.ecal-mid.ch/scripts/mediapipe-smooth-pose.js) ([doc](#MediapipePlayer))

---
# HTML example
```html
<link rel="stylesheet" href="https://mediapipe.ecal-mid.ch/styles/reset.css">
<link rel="stylesheet" href="https://mediapipe.ecal-mid.ch/styles/main.css">
<script src="https://mediapipe.ecal-mid.ch/scripts/mediapipe-client.js" type="module"></script>
<script src="https://mediapipe.ecal-mid.ch/scripts/skeleton.js" type="module"></script>

<!-- your main script here, make sure to put defer on it -->
<script src="./js/main.js" defer></script>
```
If you use `import` modules, check out the [boilerplates](#Examples).

---
# MediaPipeClient
```javascript
const mediaPipe = new MediaPipeClient()
```
### setup event
Called when mediapipe & webcam are loaded
```javascript
mediaPipe.addEventListener('setup', () => {
  console.log(mediaPipe.video)
})
```
### pose event
Called when mediapipe analysed a frame

Returns an `event.data` containing:
- `skeleton` Smoothed skeleton with mediapipe keypoints
- `skeletonNormalized` Smoothed skeleton with mediapipe normalized keypoints
- `raw` Original mediapipe results

```javascript
mediaPipe.addEventListener('pose', (event) => {
  console.log(event.data) // {skeleton, skeletonNormalized, raw}
})
```

---
# MediaPipeSmoothPose
Skeleton Smoothing
```javascript
const smoother = new MediapipeSmoothPose()
// or with parameters
const smoother = new MediapipeSmoothPose({
  lerpAmount: 0.33, // range [0-1], 0 is slowest, used by lerp()
  dampAmount: 0.1, // range ~1-10 [0 is fastest], used by smoothDamp()
  dampMaxSpeed: Infinity // max speed, used by smoothDamp()
})
```
### .target(MediapipeSkeleton)
Update with the last skeleton results from MediaPipeClient
```javascript
mediaPipe.addEventListener('pose', (event) => {
  smoother.target(event.data.skeleton)
})
```
## Retrieve smoothing
Use it on your draw loop.
### .smoothDamp()
### .lerp()
```javascript
//! Recommended
const pose = smoother.smoothDamp() // updates and returns lerped MediapipeSkeleton or undefined (if nobody is here)
// Alternative
const pose = smoother.lerp() // updates and returns smoothened MediapipeSkeleton or undefined (if nobody is here)
```
---

# Skeleton
Utilitary class to show keypoints
```javascript
const skeleton = new Skeleton()
```
```diff
- Not compatible with a webgl canvas (Pixi, three, ...)
```
### .update(MediapipeSkeleton)
Update with the last skeleton results from MediaPipeClient
```javascript
mediaPipe.addEventListener('pose', (event) => {
  skeleton.update(event.data.skeleton)
  // skeleton.update(event.data.skeletonNormalized)
})
```
### .show(HTMLCanvasContext, \[options\])
Display the skeleton on a specified HTMLCanvas context
```javascript
skeleton.show(ctx, {color: 'red'}) // optionally set the color
```
---

# Player
Record and playback Mediapipe poses
```javascript
let recorder = new MediaPipePlayer()
```
### .update(MediapipeSkeleton)
Update with the last skeleton results from MediaPipeClient
```javascript
mediaPipe.addEventListener('pose', (event) => {
  recorder.update(event.data.skeleton)
})
```
### .is(state)
Returns true is passed state matches current state of recorder.
- state: `"idle"`, `"playing"`, `"recording"`
```javascript
if (recorder.is('playing')) return
```
### .startPlayback(\[options\])
### .stopPlayback()
Will trigger the event playbackpose on eache poses
**Options:**
- loop: `Boolean` make it loop
```javascript
recorder.startPlayback({ loop: false })
recorder.stopPlayback()
```
### .startRecord(\[options\])
### .stopRecord()
```javascript
recorder.startPlayback()
// or
recorder.startPlayback({
  skipFrames: 10, // will save 1 frame every 10 frames, file will be lighter
  bufferMaxDuration: 10 * 1000, // milliseconds, recording will be of 10s max, then rewrites on its frames
})
recorder.stopPlayback()
```
### .getRecording()
### .setRecording(jsonData)
Get and set compressed record data.
```javascript
const jsonData = recorder.getRecording()
recorder.setRecording(jsonData)
```
### Events
```javascript
recorder.addEventListener('playbackpose', (event) => {
    // console.log(event.data.recordedSkeleton)
})
recorder.addEventListener('playbackstop', () => { // doesn't trigger if playback is looping
    // only triggers if playback not looping
})
```
