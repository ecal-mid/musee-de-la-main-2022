import * as THREE from 'three';
import { Smoother } from './utils/math';

class CustomGridHelper extends THREE.LineSegments {

    constructor(size = 10, divisions = 10, color1 = 0x444444, color2 = 0x888888, dashLength = 100) {

        color1 = new THREE.Color(color1);
        color2 = new THREE.Color(color2);

        const center = divisions / 2;
        const step = size / divisions;
        const halfSize = size / 2;

        const vertices = [], colors = [];

        for (let i = 0, j = 0, k = - halfSize; i <= divisions; i++, k += step) {

            vertices.push(- halfSize, 0, k, halfSize, 0, k);
            vertices.push(k, 0, - halfSize, k, 0, halfSize);

            const color = i === center ? color1 : color2;

            color.toArray(colors, j); j += 3;
            color.toArray(colors, j); j += 3;
            color.toArray(colors, j); j += 3;
            color.toArray(colors, j); j += 3;

        }

        let geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.LineDashedMaterial({
            vertexColors: THREE.VertexColors,
            dashSize: 0,
            gapSize: 0,
        });

        super(geometry, material);
        this.computeLineDistances()

        this.type = 'GridHelper';
        this.userData.dashLength = dashLength
        this.userData.smoother = new Smoother({
            smoothness: 0.5,
        })

    }

    animate(amt) {
        const { material, userData } = this
        material.dashSize = amt * userData.dashLength;
        material.gapSize = (1 - amt) * userData.dashLength;
        material.needsUpdate = true
    }

    appear(enable, delay) {
        clearTimeout(this.appearTimeout)
        this.appearTimeout = setTimeout(() => {
            this.userData.smoother.setTarget(enable ? 1 : 0)
        }, delay)
    }

    update(deltaTime) {
        // console.log(this.userData.smoother)
        this.animate(this.userData.smoother.smoothen(deltaTime))
    }

}



export { CustomGridHelper };