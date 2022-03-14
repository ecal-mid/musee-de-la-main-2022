import * as THREE from 'three';
import { Smoother } from './utils/math';

class DashedObject extends THREE.LineSegments {

    constructor(geometry, dashLength, smoothness = 0.5) {

        const material = new THREE.LineDashedMaterial({
            vertexColors: THREE.VertexColors,
            dashSize: 0,
            gapSize: 0,
        });

        super(geometry, material);

        this.computeLineDistances()

        this.userData.dashLength = dashLength
        this.userData.smoother = new Smoother({
            smoothness,
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

export { DashedObject };