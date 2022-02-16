class Plant {
    constructor(id, group, position, scale, flip, color, rotation, filePath, loader, scene, GUI, THREE, plantsMixer) {
        this.id = id;
        this.position = position;
        this.scale = scale;
        this.flip = flip;
        this.color = color;
        this.filePath = filePath;
        this.group = group;
        this.loader = loader;
        this.scene = scene;
        this.mixer;
        this.GUI = GUI;
        this.gui;
        this.THREE = THREE;
        this.yolo;
        this.rotation = rotation;

        this.actions = {};
        this.api = { state: 'sway' };
        this.activeAction;
        this.previousAction;
        this.plantFolder;

        this.plantsMixer = plantsMixer;
        this.addListeners();
        this.loadPlant();
        // console.log(this.mixer);
        setTimeout(() => {
            // console.log(this.wesh)
        }, 1000);


    }

    addListeners() {
        document.addEventListener('keydown', this.keyDown.bind(this));
    }

    loadPlant() {
        var that = this;
        this.loader.load(this.filePath, function (gltf) {
            let model = gltf.scene;
            model.position.set(that.position.x, that.position.y, that.position.z);
            model.scale.set(that.scale * 2, that.scale * 2, that.scale * 2);
            
            
            
            if (that.flip == true) {
                // model.rotation.set(0, Math.PI, 0);
                that.rotation = that.rotation + 180;
            }
            if (that.color == "") {
            } else {
                let meshColor = new that.THREE.Color(that.color);
                const newMaterial = new that.THREE.MeshLambertMaterial({color:meshColor });
                model.children[2].children[1].material = newMaterial;
                // model.children[2].children[1].material.toneMapped = false
                // console.log(model.children[2].children[1].material)
            }
            let radianAngle =  2 * Math.PI * (that.rotation / 360);
            model.rotation.set(0,radianAngle,0);

            model.traverse(function(obj) { obj.frustumCulled = false; });

            that.scene.add(model)
            that.createGUI(model, gltf.animations);
            // console.log("finished creating gui");
            // console.log(that.mixer);
            that.plantsMixer.push(that.mixer);
        }, undefined, function (e) {
            console.error(e);
        });
    }

    createGUI(model, animations) {
        const states = ['sway'];
        const emotes = ['bend-l-big', 'bend-l-small','bend-r-big', 'bend-r-small', 'bend-f'];

        this.gui = new this.GUI({ autoPlace: false });
        this.plantFolder = this.gui.addFolder(this.id)
        // document.getElementById("gui").append(this.gui.domElement);

        this.mixer = new this.THREE.AnimationMixer(model);

        for (let i = 0; i < animations.length; i++) {

            const clip = animations[i];
            const action = this.mixer.clipAction(clip);
            this.actions[clip.name] = action;

            if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 6) {
                action.clampWhenFinished = true;
                action.loop = this.THREE.LoopOnce;
            }
        }

        for (let i = 0; i < emotes.length; i++) {
            this.createEmoteCallback(emotes[i]);
        }
        this.activeAction = this.actions['sway'];
        this.activeAction.play();
       
        if(this.activeAction._clip.name == "sway"){
            this.activeAction.timeScale = 0.4;
        }
    }

    createEmoteCallback(name) {
        var that = this;
        this.api[name] = function () {
            console.log("clicked emote " + name)
            that.fadeToAction(name, 0.5);
            that.mixer.addEventListener('finished', that.restoreState.bind(that));
        };
        this.plantFolder.add(this.api, name);
    }

    restoreState() {
        var that = this;
        that.mixer.removeEventListener('finished', that.restoreState.bind(that));
        that.fadeToAction(that.api.state, 1);
    }


    fadeToAction(name, duration) {
        this.previousAction = this.activeAction;
        this.activeAction = this.actions[name];

        if (this.previousAction !== this.activeAction) {
            this.previousAction.fadeOut(duration);
        }

        this.activeAction
            .reset()
            .setEffectiveTimeScale(1)
            .setEffectiveWeight(1)
            .fadeIn(duration)
            .play();
    }

    bendTo(direction){
        // console.log(direction)
        this.fadeToAction(direction, 1);
        this.mixer.addEventListener('finished', this.restoreState.bind(this)); 
    }

    keyDown(e) {
        // e.stopImmediatePropagation()
        // console.log('keyup');
        //     if(e.keyCode == 32){
        //         console.log(this);
        //         this.bendTo("bend-l");
        //     } 
        }
    
}