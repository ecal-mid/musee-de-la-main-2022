# Musée de la main 2022
## Student DEV
### [Installation - Documentation](../../wiki)

## Admin DEV
#### Installation
1. `npm i`
2. `npm run dev`

#### CDN hosting
hosted with github, built with github action
1. Push to github main branch
2. Automatic parcel build & static folder pushed to [mediapipe.ecal-mid.ch](https://mediapipe.ecal-mid.ch)

# buggy hotspot command
@ECHO OFF
netsh wlan set hostednetwork mode=allow ssid="MID-ZOTAC-1" key="ecalifornia"
netsh wlan start hostednetwork
cd C:\Users\admin\Documents\Github\musee-de-la-main-2022
npm run expo