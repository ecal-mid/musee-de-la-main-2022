# Examples
- **boilerplates** ([folder](https://github.com/ecal-mid/musee-de-la-main-2022/tree/main/boilerplates))

# CDN
### Scripts
- [skeleton.js](https://mediapipe.ecal-mid.ch/scripts/skeleton.js)
- [mediapipe-client.js](https://mediapipe.ecal-mid.ch/scripts/mediapipe-client.js)

### CSS
- [reset.css](https://mediapipe.ecal-mid.ch/styles/reset.css)
- [main.css](https://mediapipe.ecal-mid.ch/styles/main.css)

# HTML example
```html
<link rel="stylesheet" href="https://mediapipe.ecal-mid.ch/styles/reset.css">
<link rel="stylesheet" href="https://mediapipe.ecal-mid.ch/styles/main.css">
<script src="https://mediapipe.ecal-mid.ch/scripts/mediapipe-client.js" type="module"></script>
<script src="https://mediapipe.ecal-mid.ch/scripts/skeleton.js" type="module"></script>

<!-- your main script here, make sure to put defer on it -->
<script src="./js/main.js" defer></script>
```

If you use `import` modules, check out the [boilerplates/module-example](/boilerplates/module-example).
