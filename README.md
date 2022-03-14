# Musée de la main 2022
## Student DEV
### [Installation - Documentation](../../wiki)

## Admin
#### DEV
1. `npm i`
2. `npm run dev`
! If changes are made in the `static` folder, kill the server & rerun `npm run dev`.

#### Build (for Windows 11 in a Zotac Magnus One, connected to a TV)
1. `npm i`
2. `npm run expo`
3. Opens [http://localhost:1575](http://localhost:1575).
- Will launch Google Chrome in kiosk mode, with webcam and audio permissions enabled.
- Creates a local Mobile Hotspot for running the home app on the connected iPad

#### Windows Scripts
Make sure to install the launch-scripts

- `mobile-hotspot/` Enable mobile hotspot. Paste this folder on the desktop. [Original script](https://gist.github.com/primaryobjects/8b54f7f4219960127f1f620116315a37).
- `runServer.bat` Autolaunch app when boot up.

1. `Windows+R`
2. Type `shell:startup` + enter.
3. Paste `runServer.bat` & `hotspot.cmd`
