# Examples
- **boilerplates** ([folder](https://github.com/ecal-mid/musee-de-la-main-2022/tree/main/boilerplates), [download](https://minhaskamal.github.io/DownGit/#/home?url=https://github.com/ecal-mid/musee-de-la-main-2022/tree/ab0cc4e719028b10271c9a9e64da92c29c767b86/boilerplates))
- Run these folders with a http server / live server

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
