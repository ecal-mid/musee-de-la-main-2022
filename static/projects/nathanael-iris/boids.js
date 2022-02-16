let w;

let glbLoader = new THREE.GLTFLoader();
let fish_geo;


import init, * as wasm from "./pkg/still_hands.js"

function log(string) {
    console.log(string)
}

let prevAccelerations = []

log(wasm)
export class boid_handler {
    constructor(number, scene, modelList, tracker_count) {
        this.modelList = modelList
        log(this.modelList.length)
        this.scene = scene;
        this.boids_number = number;
        this.boids = []
        let boid_size = .1;

        for (let i = 0; i < number; i++) {
            prevAccelerations.push(new THREE.Vector3());
        }
        /* prevAccelerations.fill(new THREE.Vector3(), 0, number); */
        /* this.boid_settings = new wasm.boid_world_settings(); */
        /* this.boid_settings.number = this.boids_number;
        this.boid_settings.boid_repulsion = .2;
        this.boid_settings.boid_cohesion = .2;
        this.boid_settings.boid_drag = .9; */
        /* log(this.boid_settings.get()) */

        this.boid_offsets = []
        let sc = .3
        for (let i = 0; i < number; i += 3) {
            this.boid_offsets[i] = Math.random() * sc;
            this.boid_offsets[i + 1] = Math.random() * sc;
            this.boid_offsets[i + 2] = Math.random() * sc;
        }

        this.boid_geometry = fish_geo;
        /* this.boid_geometry = new THREE.BoxGeometry(boid_size, boid_size, boid_size); */
        this.boid_material = new THREE.MeshPhysicalMaterial({
            color: "#EEEEEE",
            roughness: .2,
            specularIntensity: .9,
            metalness: .5
        })
        /* this.boid_instancedGeo = new THREE.InstancedMesh(this.boid_geometry, this.boid_material, this.boids_number); */
        log(this.boid_instancedGeo)
        this.initialized = false;
        this.app;
        this.app_positions;
        /* this.boid_settings = boid_world_settings.new();
        boid_world_settings
        log(this.boid_settings) */

        init()
            .then(() => {
                /* wasm.greet("WebASSembly") */
                this.app = wasm.App.new(this.boids_number, tracker_count);
                this.app_positions = this.app.positions;

                /* glbLoader.load("./models/fishy.glb", scene => {
                    fish_geo = scene.scene.children[0].geometry;
                    this.boid_instancedGeo = new THREE.InstancedMesh(fish_geo, this.boid_material, this.boids_number);
                    this.boid_instancedGeo.receiveShadow = true;
                    log(this.boid_instancedGeo)
                    this.scene.add(this.boid_instancedGeo);
                    log(fish_geo)
                    this.initialized = true;
                }) */
                this.initialized = true;


                w = wasm
            })
        log(this)
    }

    step() {

        let z_offset = -.5;

        if (this.initialized && this.app.ready) {
            /* let new_positions = this.app_positions; */
            let new_positions = this.app.positions;
            /* log(new_positions.length / 3) */
            /* let new_rotations = this.app.rotations; */

            let new_accelerations = this.app.accelerations;


            /* log(new_rotations) */
            /* log(new_positions) */
            this.app.step_boids();
            /* this.app.set_goal(2, 4, 4, 4); */
            /* log("boid update") */
            /* let positions = [] */

            let boid_scale = 1;
            /* let conv = 57.29577; */
            /* let conv = 0.0174533; */
            let conv = 1;
            let dummy = new THREE.Object3D();
            // for (let i = 0; i < new_positions.length; i += 3) {
            //     /* positions.push(new THREE.Vector3(new_positions[i], new_positions[i + 1], new_positions[i + 2])); */
            //     /* let newPos = new THREE.Vector3(new_positions[i] * boid_scale, new_positions[i + 1] * boid_scale, new_positions[i + 2] * boid_scale); */

            //     let acceleration = new THREE.Vector3(new_accelerations[i], new_accelerations[i + 1], new_accelerations[i + 2]);
            //     /* log(prevAccelerations[i / 3]) */
            //     acceleration = prevAccelerations[i / 3].lerp(acceleration, .05);
            //     /* if (i == 0) log(acceleration) */

            //     /* dummy.position.copy(newPos); */
            //     let matrix = new THREE.Matrix4();

            //     if (acceleration.length() > .001) {
            //         dummy.lookAt(acceleration);
            //         let newRot = dummy.rotation;
            //         /* if (i == 0) log() */
            //         matrix.makeRotationFromEuler(newRot);

            //     } else {
            //         let dummyMatrix = new THREE.Matrix4();
            //         this.boid_instancedGeo.getMatrixAt(i / 3, dummyMatrix)
            //         matrix.extractRotation(dummyMatrix);
            //         /* log(acceleration.length()) */
            //     }

            //     /* let aspectRatio = window.innerWidth / window.innerHeight; */
            //     /*  matrix.makeRotationFromEuler(new THREE.Euler(new_rotations[i] * conv, new_rotations[i + 1] * conv, new_rotations[i + 2] * conv)); */
            //     matrix.setPosition(
            //         new_positions[i] * boid_scale,
            //         new_positions[i + 1] * boid_scale,
            //         new_positions[i + 2] * boid_scale + z_offset);
            //     this.boid_instancedGeo.setMatrixAt(i / 3, matrix);
            //     prevAccelerations[i / 3] = acceleration;
            // }
            // this.boid_instancedGeo.instanceMatrix.needsUpdate = true;
            let i = 0;
            for (let model of this.modelList) {

                /* log(i) */
                for (let j = 0; j < model.count; j++) {
                    if (j == model.count) log(j)

                    let accel = new THREE.Vector3(
                        new_accelerations[j * 3],
                        new_accelerations[j * 3 + 1],
                        new_accelerations[j * 3 + 2]
                    )
                    /* log(i * Math.floor(this.boids_number / this.modelList.length) + j) */
                    accel = prevAccelerations[i * Math.floor(this.boids_number / this.modelList.length) + j].lerp(accel, .01);
                    let m = new THREE.Matrix4();
                    /* let dummyMatrix = new THREE.Matrix4();
                    model.getMatrixAt(j, dummyMatrix); */
                    /* dummy.matrix.extractRotation(dummyMatrix);
                    dummy.updateMatrix() */
                    /* let prevRot = dummy.rotation.clone(); */
                    dummy.lookAt(accel);
                    /* if (accel.length() > .001) { */
                    /* let currentPos = new THREE.Quaternion().setFromRotationMatrix(dummyMatrix) */
                    /* currentPos.slerp(new THREE.Quaternion().setFromEuler(dummy.rotation), .9) */
                    /* m.makeRotationFromEuler(dummy.rotation); */
                    /* dummy.rotation.setFromQuaternion(currentPos) */
                    /* } */
                    /* m.makeScale(.01, .01, .01) */
                    /* this.boid_offsets[i * Math.floor(this.boids_number / this.modelList.length + j) * 3] */

                    m.compose(
                        new THREE.Vector3(
                            new_positions[(i * Math.floor(this.boids_number / this.modelList.length) + j) * 3] * boid_scale,
                            new_positions[(i * Math.floor(this.boids_number / this.modelList.length) + j) * 3 + 1] * boid_scale,
                            new_positions[(i * Math.floor(this.boids_number / this.modelList.length) + j) * 3 + 2] * boid_scale + z_offset
                        ),
                        new THREE.Quaternion().setFromEuler(dummy.rotation),
                        new THREE.Vector3(model.scales[j], model.scales[j], model.scales[j])
                    )
                    model.setMatrixAt(j, m);
                    prevAccelerations[i * Math.floor(this.boids_number / this.modelList.length) + j] = accel;
                }
                model.instanceMatrix.needsUpdate = true;
                i++;
            }
        }
    }
}

export class boid_settings {
    constructor(number = 1000) {
        this.number = number,
            this.neighbour_threshold = 0.5,
            this.neighbour_max = 50,
            this.boid_drag = 0.9,
            this.boid_repulsion = 0.4,
            this.boid_cohesion = 0.17,
            this.boid_noise = 0.1,
            this.boid_goal_weight = 5.,
            this.boid_min_vel = 0.01,
            this.boid_max_vel = 0.067,
            this.boid_acceleration_matching = 0.2,
            this.goal_position_x = 0.0,
            this.goal_position_y = 0.0,
            this.goal_position_z = 0.0
    }
}