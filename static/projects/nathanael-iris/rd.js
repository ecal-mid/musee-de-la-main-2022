let log = console.log

class reactionDiffusionRender {
    constructor() {
        this.frametexture = new THREE.DataTexture();
        this.framebuffer = new THREE.WebGLRenderTarget(
            window.innerWidth,
            window.innerHeight, {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.NearestFilter,
                format: THREE.RGBAFormat
            }
        )
        this.renderer = new THREE.WebGLRenderer({
            autoClear: false,
            alpha: true
        });

        this.renderer.setClearColor(new THREE.Color(0x000000, 0))
        this.renderer.setClearAlpha(0);
        this.renderer.clear();
        this.renderer.domElement.id = "rd"
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000)
        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, .1, 1000);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.shader = new THREE.ShaderMaterial();
        this.shader.transparent = true;
        this.shader.needsUpdate = true;
        let mice = []
        for (let i = 0; i < 21; i++) {
            mice.push(new THREE.Vector2(-10, -10));
        }
        this.shader.uniforms = {

            resolution: {
                value: new THREE.Vector2(this.renderer.domElement.offsetWidth, this.renderer.domElement.offsetHeight)
            },
            prevFrame: {
                value: this.frametexture
            },
            time: {
                value: 0
            },
            stillness: {
                value: 1
            },
            mouse: {
                value: mice
            },
            mousedown: {
                value: false
            },
            fk: {
                value: new THREE.Vector2(.5, .5)
            }
        }
        this.displayShader = new THREE.ShaderMaterial();
        this.displayShader.transparent = true;
        this.displayShader.needsUpdate = true;
        this.displayShader.uniforms = {
            resolution: {
                value: new THREE.Vector2(
                    this.renderer.domElement.offsetWidth,
                    this.renderer.domElement.offsetHeight
                )
            },
            frame: {
                value: this.frametexture
            },
            hand_position: {
                value: new THREE.Vector2()
            }
        }
        this.plane = new THREE.Mesh(
            new THREE.PlaneGeometry(),
            new THREE.MeshBasicMaterial()
        );
        this.plane.position.z = 4.89;
        this.displayPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(),
            new THREE.MeshBasicMaterial()
        )
        this.displayPlane.position.z = 4.89

        this.displayScene = new THREE.Scene();
        this.displayScene.add(this.displayPlane);
        this.displayScene.background = null

        let init = false;
        fetch("./vertex.glsl").then(thing => {
            thing.text().then(data => {
                /* log(data) */
                this.plane.material.vertexShader = data;
                this.shader.vertexShader = data;
                this.displayShader.vertexShader = data;
                if (!init) {
                    init = true;
                } else {
                    this.plane.material = this.shader;
                }
            });
        })
        fetch("./frag.glsl").then(thing => {
            thing.text().then(data => {
                /* log(data) */
                this.plane.material.fragmentShader = data;
                this.shader.fragmentShader = data;
                if (!init) {
                    init = true;
                } else {
                    this.plane.material = this.shader;
                }
            })

        });
        fetch("./display.glsl").then(thing => {
            thing.text().then(data => {
                /* log(data) */
                this.displayShader.fragmentShader = data;
                this.displayPlane.material = this.displayShader;
            })
        });
        init = false;
        this.scene.add(this.plane);
        this.camera.position.z = 5;
        this.frame = 0;
        this.start_time;
        window.addEventListener("load", () => {
            /* document.body.appendChild(this.renderer.domElement); */
            this.shader.uniforms.resolution.value.x = this.renderer.domElement.offsetWidth;
            this.shader.uniforms.resolution.value.y = this.renderer.domElement.offsetHeight;
            this.displayShader.uniforms.resolution.value.x = this.renderer.domElement.offsetWidth;
            this.displayShader.uniforms.resolution.value.y = this.renderer.domElement.offsetHeight;
            /* log(this.shader.uniforms.resolution.value)
            log(this.shader.uniforms.resolution.value.x / this.shader.uniforms.resolution.value.y); */
            this.shader.uniforms.fk.value = new THREE.Vector2(.03239, .0324);
            this.shader.baseFK = this.shader.uniforms.fk.value.clone();
            /* log(shader.uniforms.fk) */
            /* this.render() */
            log("reaction diffusion launched")
        })

        let blackplane = new THREE.Mesh(
            new THREE.PlaneGeometry(),
            new THREE.MeshBasicMaterial({
                color: 0x000000
            }))

        blackplane.position.z = 4.9;
        this.scene.add(blackplane)

        setTimeout(() => {
            blackplane.position.y = -10
        }, 500)
        log(blackplane)

        window.addEventListener("resize", () => {
            this.camera.aspectRatio = this.renderer.domElement.offsetWidth / this.renderer.domElement.offsetHeight;
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.framebuffer.setSize(this.renderer.domElement.offsetWidth, this.renderer.domElement.offsetHeight);
            /* frametexture.setSize(window.innerWidth, window.innerHeight); */
            this.shader.uniforms.resolution.value.x = this.renderer.domElement.offsetWidth
            this.shader.uniforms.resolution.value.y = this.renderer.domElement.offsetHeight
            this.displayShader.uniforms.resolution.value.x = this.renderer.domElement.offsetWidth
            this.displayShader.uniforms.resolution.value.y = this.renderer.domElement.offsetHeight
        })

        /* window.addEventListener("mousemove", e => {
            this.shader.uniforms.mouse.value.x = e.layerX;
            this.shader.uniforms.mouse.value.y = e.layerY;
        }) */
        this.renderer.domElement.onpointerdown = () => {
            this.shader.uniforms.mousedown.value = true;
        }
        this.renderer.domElement.onpointerup = () => {
            this.shader.uniforms.mousedown.value = false;
        }
    }

    render() {
        if (this.frame == 0) {
            this.start_time = Date.now();
        }
        this.frame++;
        let time = (Date.now() - this.start_time) / 1000
        this.shader.uniforms.time.value = time;
        this.frametexture.copy(this.framebuffer.texture)

        // animate fk
        /* this.shader.uniforms.fk.value.x = this.shader.uniforms.fk.value.x + Math.sin(time) * .000001;
        this.shader.uniforms.fk.value.y = this.shader.uniforms.fk.value.y + Math.cos(time) * .000001; */
        /* log(shader.uniforms.fk.value) */


        requestAnimationFrame(this.render.bind(this));
        this.renderer.setRenderTarget(null)
        this.renderer.render(this.displayScene, this.camera);
        this.renderer.setRenderTarget(this.framebuffer);
        this.renderer.render(this.scene, this.camera);
        this.renderer.copyFramebufferToTexture(new THREE.Vector2(), this.frametexture);
        this.shader.uniforms.prevFrame.value = this.frametexture;
        this.displayShader.uniforms.frame.value = this.frametexture;
    }


}

let rd;
rd = new reactionDiffusionRender();