# Examples
1. **download boilerplates** ([folder](https://github.com/ecal-mid/musee-de-la-main-2022/tree/main/boilerplates), [download](https://minhaskamal.github.io/DownGit/#/home?url=https://github.com/ecal-mid/musee-de-la-main-2022/tree/2c5bcdfb99faf957e8d316c13a47b6206d1d048a/boilerplates))
3. Run these folders with a http server / live server
4. Go to your localhost (with the proper port) [localhost:5500/boilerplates](http://localhost:5500/boilerplates/)

---
# CDN
### Scripts
- [skeleton.js](https://mediapipe.ecal-mid.ch/scripts/skeleton.js)
- [mediapipe-client.js](https://mediapipe.ecal-mid.ch/scripts/mediapipe-client.js)

### CSS
- [reset.css](https://mediapipe.ecal-mid.ch/styles/reset.css)
- [main.css](https://mediapipe.ecal-mid.ch/styles/main.css)

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
# MediapipeSmoothPose
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
Recommended
```javascript
const pose = smoother.smoothDamp() // updates and returns lerped MediapipeSkeleton or undefined (if nobody is here)
```
### .lerp()
Alternative
```javascript
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
