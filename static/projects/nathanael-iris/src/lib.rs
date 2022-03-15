use js_sys;
use noise::{Fbm, NoiseFn};
use num;
use std::ops::{Add, Div, Mul, Sub};

use wasm_bindgen::prelude::*;

extern crate console_error_panic_hook;
use std::panic;

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);

    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);
    pub fn test();
    #[wasm_bindgen(js_namespace=Math)]
    pub fn random() -> f64;
}

/* #[wasm_bindgen(module = "/boids.js")]
extern "C" {
    type boid_settings;

    #[wasm_bindgen(constructor)]
    fn new(number:i32) -> boid_settings;

    #[wasm_bindgen()]
}
 */
#[wasm_bindgen]
pub fn greet(name: &str) {
    /* alert(&format!("Hello, {}!", name)); */
    log(&format!("Hello, {}!", name));

    let fuck: Vector3 = Vector3::new();
    log("HI");
}

pub fn randf32() -> f32 {
    random() as f32
}

#[wasm_bindgen]
#[derive(Debug, Copy, Clone, PartialEq)]
pub struct Vector3 {
    pub x: f32,
    pub y: f32,
    pub z: f32,
}
impl Vector3 {
    pub fn new() -> Vector3 {
        Vector3 {
            x: 0.,
            y: 0.,
            z: 0.,
        }
    }
    pub fn random() -> Vector3 {
        Vector3 {
            x: randf32(),
            y: randf32(),
            z: randf32(),
        }
    }

    pub fn add(self, other: Vector3) -> Vector3 {
        let mut result = Vector3::new();
        result.x = self.x + other.x;
        result.y = self.y + other.y;
        result.z = self.z + other.z;
        result
    }
    pub fn sub(self, other: Vector3) -> Vector3 {
        let mut result = Vector3::new();
        result.x = self.x - other.x;
        result.y = self.y - other.y;
        result.z = self.z - other.z;
        result
    }
    pub fn mulScalar(self, other: f32) -> Vector3 {
        let mut result = Vector3::new();
        result.x = self.x * other;
        result.y = self.y * other;
        result.z = self.z * other;
        result
    }
    pub fn divScalar(self, other: f32) -> Vector3 {
        let mut result = Vector3::new();
        result.x = self.x / other;
        result.y = self.y / other;
        result.z = self.z / other;
        result
    }
    pub fn norm(self) -> Vector3 {
        let mut result = Vector3::new();
        let magnitude = self.magnitude();
        if magnitude == 0 as f32 {
            result
        } else {
            result.x = self.x / magnitude;
            result.y = self.y / magnitude;
            result.z = self.z / magnitude;
            result
        }
    }
    pub fn isNaN(self) -> bool {
        let mut result = false;
        result = self.x.is_nan();
        result = self.y.is_nan();
        result = self.z.is_nan();

        result
    }
    pub fn fromNoise(noise: &noise::Fbm, x: f32, y: f32, z: f32) -> Vector3 {
        let mut result = Vector3::new();
        result.x = noise.get([x as f64, y as f64, z as f64]) as f32;
        result.y = noise.get([y as f64, z as f64, x as f64]) as f32;
        result.z = noise.get([z as f64, y as f64, x as f64]) as f32;

        result
    }

    pub fn clamp(self, min: f32, max: f32) -> Vector3 {
        let mut result = Vector3::new();
        result.x = num::clamp(self.x, min, max);
        result.y = num::clamp(self.y, min, max);
        result.z = num::clamp(self.z, min, max);
        result
    }

    pub fn magnitude(self) -> f32 {
        (self.x.powi(2) + self.y.powi(2) + self.z.powi(2)).sqrt()
    }

    pub fn distance(self, other: Vector3) -> f32 {
        /* log(&format!("{}", (self.x - other.x).powi(2)));
        log(&format!("{}", 1.0_f32.sqrt())); */
        ((self.x - other.x).powi(2) + (self.y - other.y).powi(2) + (self.z - other.z).powi(2))
            .sqrt()
    }
    pub fn rotationFromDirection(self) -> Vector3 {
        let mut dir = self.clone();
        let mut angle = Vector3::new();
        dir = dir.norm();
        angle.x = dir.x.cos().powi(-1);
        angle.y = dir.y.sin().powi(-1);
        angle.z = dir.z.tan().powi(-1);

        angle
    }
}
/*
#[wasm_bindgen] */
/* #[derive(Copy, Clone)] */
pub struct boid_world_settings {
    pub number: i32,
    pub neighbour_threshold: f32,
    pub neighbour_max: i32,
    pub boid_drag: f32,
    pub boid_repulsion: f32,
    pub boid_cohesion: f32,
    pub boid_noise: f32,
    pub boid_goal_weight: f32,
    pub boid_min_vel: f32,
    pub boid_max_vel: f32,
    pub boid_acceleration_matching: f32,
    pub goal_position_x: f32,
    pub goal_position_y: f32,
    pub goal_position_z: f32,
    pub goals: Vec<Vector3>,
}

/* #[wasm_bindgen] */
impl boid_world_settings {
    /* #[wasm_bindgen(constructor)] */
    pub fn new(goal_count: i32) -> boid_world_settings {
        let mut b = boid_world_settings {
            number: 1000,
            neighbour_threshold: 0.45,
            neighbour_max: 1000,
            boid_drag: 0.5,
            boid_repulsion: 3.5,
            boid_cohesion: 0.013,
            boid_noise: 0.3,
            boid_goal_weight: 0.0,
            boid_min_vel: 0.01,
            boid_max_vel: 100.0,
            boid_acceleration_matching: 0.2,
            goal_position_x: 0.0,
            goal_position_y: 0.0,
            goal_position_z: 0.0,
            goals: Vec::new(),
            /* number: 1000,
            neighbour_threshold: 3.0,
            neighbour_max: 1000,
            boid_drag: 0.94,
            boid_repulsion: 0.0,
            boid_cohesion: 0.0,
            boid_noise: 0.00,
            boid_goal_weight: 0.5,
            boid_min_vel: 0.01,
            boid_max_vel: 5.0,
            boid_acceleration_matching: 5.0,
            goal_position_x: 0.0,
            goal_position_y: 0.0,
            goal_position_z: 0.0,
            goals: Vec::new(), */
        };
        for _ in 0..goal_count {
            b.goals.push(Vector3::new());
        }
        b
    }
    /* #[wasm_bindgen] */
    /* pub fn new_parametrized(
        number: i32,
        neighbour_threshold: f32,
        neighbour_max: i32,
        boid_drag: f32,
        boid_repulsion: f32,
        boid_cohesion: f32,
        boid_noise: f32,
        boid_goal_weight: f32,
        boid_min_vel: f32,
        boid_max_vel: f32,
        boid_acceleration_matching: f32,
        goal_position_x: f32,
        goal_position_y: f32,
        goal_position_z: f32,
    ) -> boid_world_settings {
        boid_world_settings {
            number,
            neighbour_threshold,
            neighbour_max,
            boid_drag,
            boid_repulsion,
            boid_cohesion,
            boid_noise,
            boid_goal_weight,
            boid_min_vel,
            boid_max_vel,
            boid_acceleration_matching,
            goal_position_x,
            goal_position_y,
            goal_position_z,
            goals: Vec::new()
        }
    } */

    pub fn get(&self) -> f32 {
        self.boid_acceleration_matching
    }

    /* #[wasm_bindgen(method)]
    pub fn set_goal(index: i32, x: f32, y: f32, z: f32) {} */

    /* fn string_to_attribute(query: &str) -> String {
        match query {
            "number" => {}
            _ => {
                log(&format!("unknown attribute: {}", query));
                String::from("undefined")
            }
        }
    } */

    /* pub fn get(self) -> boid_world_settings {
        self
    } */

    /* #[wasm_bindgen(setter)]
    pub fn set_number(mut self, val: i32) {
        self.number = val;
    } */
}

pub struct boid_world {
    pub boids: Vec<boid>,
    pub settings: boid_world_settings,
    noise: noise::Fbm,
}

impl boid_world {
    pub fn new(number: i32, goal_count: i32) -> boid_world {
        let settings: boid_world_settings = boid_world_settings::new(goal_count);
        let mut boids: Vec<boid> = Vec::new();
        panic::set_hook(Box::new(console_error_panic_hook::hook));
        for i in 0..number {
            boids.push(boid::new(
                Vector3::random(),
                i,
                boid_world::get_boid_goal_id(number, i as usize, goal_count),
            ));
            /* log(&format!(
                "{:?}",
                boid_world::get_boid_goal_id(number, i as usize)
            )); */
        }
        boid_world {
            boids,
            settings,
            noise: noise::Fbm::new(),
        }
    }

    pub fn get_boid_goal_id(count: i32, index: usize, goal_count: i32) -> usize {
        (index as f32 * goal_count as f32 / count as f32).floor() as usize
    }

    pub fn update(&mut self) {
        // Compute neighbours
        let mut neighbourhood: Vec<Vec<usize>> = Vec::new();
        let mut i: usize = 0;
        let mut separations: Vec<Vector3> = Vec::new();
        let mut cohesions: Vec<Vector3> = Vec::new();
        let mut directions: Vec<Vector3> = Vec::new();
        let mut goals: Vec<Vector3> = Vec::new();

        /* for i in 0..21 {
            log(&format!("{:?}", self.settings.goals[i]));
        } */

        let mut boid_goal = Vector3::new();
        boid_goal.x = self.settings.goal_position_x;
        boid_goal.y = self.settings.goal_position_y;
        boid_goal.z = self.settings.goal_position_z;
        for boi in &self.boids {
            // Calculate neighbours for boid
            let mut neighbours: Vec<usize> = Vec::new();
            i = 0;
            for boi2 in &self.boids {
                let distance = boi.position.distance(boi2.position);
                /* log(&format!("{}", distance)); */
                if boi.index != boi2.index && distance < self.settings.neighbour_threshold {
                    neighbours.push(boi2.index as usize);
                    i += 1;
                }
                if i > self.settings.neighbour_max as usize {
                    break;
                }
            }
            /* neighbourhood.push(neighbours); */
            let neighbour_count: i32 = neighbours.len() as i32;

            let mut separation_tally: Vector3 = Vector3::new();
            let mut center = Vector3::new();
            let mut direction = Vector3::new();
            /* let mut goal = Vector3::new(); */

            if neighbour_count > 0 {
                for i in &neighbours {
                    let boi2 = self.boids[*i].position;
                    let mut separation = boi.position.sub(boi2);
                    separation = separation
                        .mulScalar(self.settings.neighbour_threshold - boi.position.distance(boi2));
                    /* log(&format!(
                        "{:?},{:?},{:?}",
                        self.settings.neighbour_threshold - boi.position.distance(boi2),
                        self.settings.neighbour_threshold,
                        boi.position.distance(boi2)
                    )); */
                    separation_tally = separation_tally.add(separation);
                    center = center.add(boi2);
                    direction = direction.add(self.boids[*i].acceleration);
                }
                /* log(&format!("{:?}", neighbour_count)); */
                // compute separation
                separation_tally = separation_tally.divScalar(neighbour_count as f32);
                /* separation_tally = separation_tally.norm(); */
                separation_tally = separation_tally.mulScalar(self.settings.boid_repulsion);
                /* log(&format!("{:?}", separation_tally)); */

                // compute cohesion
                center = center.divScalar(neighbour_count as f32);
                /* center = center.sub(boi.position).norm(); */
                center = center.mulScalar(self.settings.boid_cohesion);

                //  compute direction matching
                direction.divScalar(neighbour_count as f32);
            }
            // compute goal
            /* goal = (self.settings.goals[boi.goal_index])
            .sub(boi.position)
            .norm()
            .mulScalar(self.settings.boid_goal_weight);
            goals.push(goal); */
            /* log(&format!("{:?}", boi.goal_index)); */
            separations.push(separation_tally);
            directions.push(direction);
            cohesions.push(center);
        }
        /* log(&format!("{:?}", self.settings.goals)); */

        //	Apply changes
        let ruleset = vec![separations, cohesions /* goals, *//*  directions */];

        /* for i in 0..21 {
            log(&format!("{:?}", self.settings.goals[i]));
        } */

        for boi in &mut self.boids {
            for rule in &ruleset {
                boi.acceleration = boi.acceleration.add(
                    rule[boi.index as usize], /* .divScalar(ruleset.len() as i32 as f32) */
                );
            }

            // Get closer to boid's goal
            let distance = boi.position.distance(self.settings.goals[boi.goal_index]);
            /* log(&format!("{:?}", distance)); */
            /* if distance > 0.5 { */

            boi.acceleration = boi.acceleration.add(
                self.settings.goals[boi.goal_index]
                    .sub(boi.position)
                    .norm()
                    .mulScalar(self.settings.boid_goal_weight)
                    .mulScalar(boi.goal_mod)
                    .mulScalar(num::clamp(distance, 0.0, 1.)),
            );

            /* } */
            /* if (random() < 0.1) {
                log(&format!(
                    "{:?}, {}",
                    self.settings.goals[boi.goal_index], boi.goal_index
                ));
            } */

            // Simulate boids kinematics
            let mut gravity = Vector3::new();
            gravity.z = -0.2;

            boi.acceleration = boi.acceleration.add(
                Vector3::fromNoise(
                    &self.noise,
                    boi.position.x * 0.1,
                    boi.position.y * 0.1,
                    boi.position.z * 0.1,
                )
                .mulScalar(self.settings.boid_noise),
            );

            /* boi.acceleration = boi.acceleration.sub(gravity); */
            /* if boi.acceleration.isNaN() {
                boi.acceleration = Vector3::random();
                log("NAN FOR FUCK SAKE");
            }; */
            /*  log(&format!("{:?}", boi)); */
            boi.position = boi.position.add(boi.acceleration);
            /* boi.position = self.settings.goals[boi.goal_index]; */

            /* log(&format!("{:?}", boi.position)); */
            boi.acceleration = boi.acceleration.mulScalar(self.settings.boid_drag);

            /* boi.rotation = boi.acceleration.rotationFromDirection(); */

            if boi.acceleration.magnitude() < self.settings.boid_min_vel {
                boi.acceleration = boi.acceleration.mulScalar(1.05);
            } else if boi.acceleration.magnitude() > self.settings.boid_max_vel {
                boi.acceleration = boi.acceleration.mulScalar(0.95);
            }
        }

        /* log(&format!("{:?}", neighbourhood)); */

        // Compute separation

        // for boi in &self.boids {
        //     let mut separation_tally: Vector3 = Vector3::new();
        //     if neighbourhood[boi.index as usize].len() > 0 as usize {
        //         for i in &neighbourhood[boi.index as usize] {
        //             let boi2 = self.boids[*i].position;
        //             separation_tally = separation_tally.add(boi.position.sub(boi2));
        //         }
        //         separation_tally = separation_tally
        //             .divScalar(neighbourhood[boi.index as usize].len() as i32 as f32);
        //         separation_tally = separation_tally.norm();
        //         /* log(&format!("{:?}", separation_tally)); */
        //         separation_tally = separation_tally.mulScalar(self.settings.boid_repulsion);
        //         /* log(&format!("{:?}", separation_tally)); */
        //     }
        //     separations.push(separation_tally);
        // }

        // Compute cohesion

        // for boi in &self.boids {
        //     let mut center = Vector3::new();
        //     if neighbourhood[boi.index as usize].len() > 0 as usize {
        //         for i in &neighbourhood[boi.index as usize] {
        //             let boi2 = self.boids[*i].position;
        //             center = center.add(boi2);
        //         }
        //         center = center.divScalar(neighbourhood[boi.index as usize].len() as i32 as f32);
        //         center = center.sub(boi.position).norm();
        //         center = center.mulScalar(self.settings.boid_cohesion);
        //     }
        //     cohesions.push(center);
        // }

        //Compute direction matching

        // for boi in &self.boids {
        //     let mut direction = Vector3::new();
        //     if neighbourhood[boi.index as usize].len() > 0 as usize {
        //         for i in &neighbourhood[boi.index as usize] {
        //             direction = direction.add(self.boids[*i].acceleration);
        //         }
        //         direction.divScalar(neighbourhood[boi.index as usize].len() as f64 as f32);
        //     }

        //     directions.push(direction);
        // }

        //Compute goal

        /* for boi in &self.boids {
            let mut goal = Vector3::new();
            goal = (self.settings.goal_position)
                .sub(boi.position)
                .mulScalar(self.settings.boid_goal_weight)
                .clamp(-1.0, 1.0);
            goals.push(goal);
        } */

        //Compute fear
        // same as goal but inverted

        /* pub fn update_boid_neighbours(self) {}
        pub fn update_boid_separation(self) {}
        pub fn boid_update(self, mut boi: &boid, boids: &Vec<&boid>) {}

        pub fn separate(self, mut boi: boid, other: &boid) {
            let mut repulsion: Vector3 = Vector3::new();
            repulsion = boi.position.clone().sub(other.position);
            repulsion.mulScalar(self.settings.boid_repulsion);

            boi.acceleration.add(repulsion);
        } */
    }
}

#[derive(Debug)]

pub struct boid {
    pub position: Vector3,
    pub acceleration: Vector3,
    pub rotation: Vector3,
    pub index: i32,
    pub neighbours: Vec<boid>,
    pub vel: f32,
    pub goal_index: usize,
    pub goal_mod: f32,
}
impl boid {
    pub fn new(position: Vector3, index: i32, goal_index: usize) -> boid {
        boid {
            position,
            acceleration: Vector3::new(),
            rotation: Vector3::new(),
            index,
            neighbours: Vec::new(),
            vel: 0.0,
            goal_index,
            goal_mod: randf32() * 0.3 + 0.8,
        }
    }
}

#[wasm_bindgen]
pub struct App {
    BoidWorld: boid_world,
    pub ready: bool,
    goals: Vec<Vector3>,
}

#[wasm_bindgen]
impl App {
    pub fn new(number: i32, goal_count: i32) -> App {
        log(&format!("{:?}", random()));
        /* let mut test = boid_settings::new(); */
        /* log(&format!("{:?}", test)); */

        App {
            BoidWorld: boid_world::new(number, goal_count),
            ready: true,
            goals: Vec::new(),
        }
    }
    #[wasm_bindgen(method)]
    pub fn step_boids(&mut self) {
        self.ready = false;
        self.BoidWorld.update();
        self.ready = true;
        /* log(&format!("{:?}", self.BoidWorld.boids)); */
        /* positions */
    }
    #[wasm_bindgen(getter)]
    pub fn positions(&self) -> js_sys::Float32Array {
        let mut positions = Vec::new();
        for boi in &self.BoidWorld.boids {
            positions.push(boi.position.x);
            positions.push(boi.position.y);
            positions.push(boi.position.z);
        }
        js_sys::Float32Array::from(&positions[..])
    }
    #[wasm_bindgen(getter)]
    pub fn rotations(&self) -> js_sys::Float32Array {
        let mut rotations = Vec::new();
        for boi in &self.BoidWorld.boids {
            rotations.push(boi.rotation.x);
            rotations.push(boi.rotation.y);
            rotations.push(boi.rotation.z);
        }
        js_sys::Float32Array::from(&rotations[..])
    }

    #[wasm_bindgen(getter)]
    pub fn accelerations(&self) -> js_sys::Float32Array {
        let mut accelerations = Vec::new();
        for boi in &self.BoidWorld.boids {
            accelerations.push(boi.acceleration.x);
            accelerations.push(boi.acceleration.y);
            accelerations.push(boi.acceleration.z);
        }
        js_sys::Float32Array::from(&accelerations[..])
    }

    /* #[wasm_bindgen]
    pub fn swapRules(&mut self, new_rules: boid_world_settings) {
        self.BoidWorld.settings = new_rules;
    } */

    #[wasm_bindgen]
    pub fn set_goal(&mut self, index: usize, x: f32, y: f32, z: f32) {
        self.BoidWorld.settings.goals[index].x = x;
        self.BoidWorld.settings.goals[index].y = y;
        self.BoidWorld.settings.goals[index].z = z;
        /* log(&format!("{:?}", self.BoidWorld.settings.goals[index])); */
    }

    #[wasm_bindgen]
    pub fn set_neighbour_thresh(&mut self, val: f32) {
        self.BoidWorld.settings.neighbour_threshold = val;
    }
    #[wasm_bindgen]
    pub fn set_neighbour_max(&mut self, val: i32) {
        self.BoidWorld.settings.neighbour_max = val;
    }
    #[wasm_bindgen]
    pub fn set_boid_drag(&mut self, val: f32) {
        self.BoidWorld.settings.boid_drag = val;
    }
    #[wasm_bindgen]
    pub fn set_boid_repulsion(&mut self, val: f32) {
        self.BoidWorld.settings.boid_repulsion = val;
    }
    #[wasm_bindgen]
    pub fn set_boid_cohesion(&mut self, val: f32) {
        self.BoidWorld.settings.boid_cohesion = val;
    }
    #[wasm_bindgen]
    pub fn set_boid_noise(&mut self, val: f32) {
        self.BoidWorld.settings.boid_noise = val;
    }
    #[wasm_bindgen]
    pub fn set_boid_goal_weight(&mut self, val: f32) {
        self.BoidWorld.settings.boid_goal_weight = val;
    }
    #[wasm_bindgen]
    pub fn set_boid_min_vel(&mut self, val: f32) {
        self.BoidWorld.settings.boid_min_vel = val;
    }
    #[wasm_bindgen]
    pub fn set_boid_max_vel(&mut self, val: f32) {
        self.BoidWorld.settings.boid_max_vel = val;
    }
    #[wasm_bindgen]
    pub fn set_boid_acceleration_matching(&mut self, val: f32) {
        self.BoidWorld.settings.boid_acceleration_matching = val;
    }
    /* #[wasm_bindgen(getter)]
    pub fn ready(&self) -> js_sys::Boolean {
        js_sys::Boolean::from(self.ready)
    } */
}

/* pub struct Neighbour {
    pub distance: f32,
    pub neighbour: &boid,
} */
