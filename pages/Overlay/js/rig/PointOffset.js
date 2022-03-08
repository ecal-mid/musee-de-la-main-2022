import * as THREE from "three"

export default class PointOffset {

    constructor({ targetPoint, multiplier }) {
        this.target = targetPoint
        this.multiplier = multiplier
        this.point = new THREE.Vector3()
    }

    update() {
        const newPoint = this.target.clone().multiply(this.multiplier)
        this.point.copy(newPoint)
    }
}