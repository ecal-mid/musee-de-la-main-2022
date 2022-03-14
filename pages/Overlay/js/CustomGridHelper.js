import * as THREE from 'three';
import {DashedObject} from './DashedObject.js'
import { Smoother } from './utils/math';

class CustomGridHelper extends DashedObject {

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

        super(geometry, dashLength, 0.1);

        this.type = 'GridHelper';

    }
}



export { CustomGridHelper };