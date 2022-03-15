/* let gpu = new GPU();

const gpu_test = gpu.createKernel(
    function () {
        return this.thread.x
    }
).setOutput([128]) */

/* gpu_noise.addNativeFunction('random', `highp float random(vec4 x)
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}`); */
/* 
gpu_noise.addNativeFunction("permute", `
    highp vec4 permute(vec4 x)
    {
        return mod(((x*34.) + 1.)*x, 289.0);
    }
`)
gpu_noise.addNativeFunction("taylorInvSqrt", `
    highp vec4 taylorInvSqrt(vec4 r)
    {
        return 1.79284291400159 - 0.85373472095314 * r;
    }
`) */




/* let div = document.createElement("div")
window.addEventListener("load", () => {
    document.body.appendChild(div)
})
try {
    log(gpu_noise(0, 5, 0.1))

} catch (e) {
    console.error(e)
}
div.innerHTML = gpu_noise.compiledFragmentShader.replaceAll("\n", "<br>") */

class GPUParticles {
    constructor(number) {
        this.clock = new THREE.Clock();
        let xSize = 1;
        let ySize = 1;
        if (window.innerWidth > window.innerHeight) {
            xSize *= window.innerWidth / window.innerHeight
        } else {
            ySize *= window.innerHeight / window.innerWidth
        }

        this.trackers = []
        this.tracker_number = 0;

        /* log({
            xSize,
            ySize
        }) */


        this.points = new THREE.Points(
            new THREE.PlaneGeometry(
                xSize * 4,
                ySize * 4,
                number - 1,
                number - 1
            ),
            new THREE.ShaderMaterial()
        )
        this.number = number;
        fetch("./particles_frag.glsl").then(data => {
            return data.text()
        }).then(frag => {
            this.points.material.fragmentShader = frag;
            fetch("./particles_vertex.glsl").then(data => {
                return data.text()
            }).then(vert => {
                this.points.material.vertexShader = vert;
                this.points.material.needsUpdate = true;
            })
        })

        let tracker_tmp = []
        for (let i = 0; i < 69; i++) {
            tracker_tmp.push(new THREE.Vector3())
        }

        this.points.material.uniforms = {
            "time": {
                value: 0
            },
            "speed": {
                value: 1
            },
            "trackers": {
                value: tracker_tmp
            },
            "tracker_amount": {
                value: 0
            }
        }
        this.points.position.y = .2;
        this.points.scale.set(2, 2, 2)



        this.positions = this.points.geometry.attributes.position.array;

        for (let i = 0; i < this.positions.length; i += 3) {
            this.positions[i] += Math.random() * 2 - 1
            this.positions[i + 1] += Math.random() * 2 - 1
            this.positions[i + 2] += Math.random() * 2 - 1
        }
        /* log(this.gpu_noise(this.positions, .01, this.clock.getElapsedTime())) */

        /* this.worker = new Worker("worker.js")
        this.newData = [] */
        // this.worker.addEventListener("message", e => {
        //     switch (e.data.cmd) {
        //         case "update":
        //             this.newData = e.data.data
        //             this.updatePositions(this.newData)
        //             /* this.newPosAvailable = true; */
        //             break;
        //     }
        // })

        this.newPosAvailable = false;
        this.waitingForNewData = false;

        /* this.worker.postMessage(this.positions) */
        // this.worker.postMessage({
        //     cmd: "init",
        //     number: this.number
        // })


        this.dt = 0;
        this.last = 0;
    }


    update() {

        let time = this.clock.getElapsedTime()
        this.dt = time - this.last;
        /* log(this.dt) */
        this.points.material.uniforms.time.value = this.clock.getElapsedTime()
        /* this.points. */
        /* this.points.rotation.x += .0001;
        this.points.rotation.y += .001;
        this.points.rotation.z += .0001; */
        /* for (let j = 0; j < 1; j++) {
            for (let i = 0; i < this.positions.length; i += 3) {
                this.positions[i] += quickNoise.noise(
                        -this.positions[i],
                        -this.positions[i + 1] - time,
                        this.positions[i + 2]) * .003 -
                    this.positions[i] * .0001

                this.positions[i + 1] += quickNoise.noise(
                        this.positions[i],
                        this.positions[i + 1],
                        -this.positions[i + 2] - time) * .003 -
                    this.positions[i + 1] * .0001

                this.positions[i + 2] += quickNoise.noise(
                        this.positions[i] + time,
                        this.positions[i + 1],
                        -this.positions[i + 2]) * .003 -
                    this.positions[i + 2] * .0001

            }
        } */
        /* let newPos = this.gpu_noise(this.positions, .01, .1, time * .2); */
        /* log(newPos.length) */

        /* this.worker.postMessage({
            cmd: "update",
            data: this.positions,
            scale: .01,
            noiseScale: .1,
            time: time * .2
        }) */
        if (this.newPosAvailable) {
            console.log(Date.now() - this.last)
            this.newPosAvailable = false;
            /* log(this.newData    ) */
            this.updatePositions(this.newData)
            this.last = Date.now()
        }


        /* this.last = this.clock.getElapsedTime(); */
    }

    updatePositions(newPos) {
        for (let i = 0; i < newPos.length; i++) {
            this.positions[i * 3] += newPos[i][0]
            this.positions[i * 3 + 1] += newPos[i][1]
            this.positions[i * 3 + 2] += newPos[i][2]
        }
        this.points.geometry.attributes.position.needsUpdate = true
    }
}