import * as THREE from "three"

const green = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const geometry = new THREE.SphereGeometry(0.01, 6, 6);

export default class Joint {
    constructor({ pointA, pointB, newPoints }) {

        this.pointA = pointA
        this.pointB = pointB
        this.points = newPoints //! [{point, interpolation}, {point, interpolation}]
        this.update()
    }

    update() {
        const { pointA, pointB } = this
        const dir = pointB.clone().sub(pointA);
        const len = dir.length();

        this.points.forEach(({ point, interpolation }, index) => {
            const vect = dir.clone().setLength(len * interpolation);
            point.copy(pointA.clone().add(vect));

        });
    }

}