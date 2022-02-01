<<<<<<< Updated upstream
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
=======
# ProjectSwiper

Projects controller for ECAL - MID3 2022 S1

# INSTALL NODE MODULES FOR IPAD FILES
>>>>>>> Stashed changes

npm install

# RUN DEV APP

npm run start

# INSTALL NODE MODULES FOR WEB SOCKET SERVER

<<<<<<< Updated upstream
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
=======
cd server
npm install
>>>>>>> Stashed changes

# RUN WS SERVER

npm run start

# CHECK

Change IP address at the top of Socket.js to match the server IP address.<br/>
Run the server first, then launch the iPad app. (Otherwise connection won't be running)
