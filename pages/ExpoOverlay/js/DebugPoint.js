import * as THREE from "three"
import { GREEN } from "./materials.js";
const geometry = new THREE.SphereGeometry(0.01, 6, 6);

export default class DebugPoint {
    constructor({ point, name, parent, material = GREEN }) {
        this.mesh = new THREE.Mesh(geometry, material)
        this.point = point
        this.name = name
        this.parent = parent

        this.parent.add(this.mesh)
    }
    update() {
        this.mesh.position.copy(this.point)
    }
}