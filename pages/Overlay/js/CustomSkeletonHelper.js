// import { LineSegments } from '../objects/LineSegments.js';
// import { Matrix4 } from '../math/Matrix4.js';
// import { LineBasicMaterial as THREE.LineBasicMaterial } from '../materials/LineBasicMaterial.js';
// import { Color as THREE.Color } from '../math/Color.js';
// import { Vector3 } from '../math/Vector3.js';
// import { BufferGeometry } from '../core/BufferGeometry.js';
// import { THREE.Float32BufferAttribute } from '../core/BufferAttribute.js';
import * as THREE from 'three'
import { DashedObject } from './DashedObject.js'

const _vector = /*@__PURE__*/ new THREE.Vector3();
const _boneMatrix = /*@__PURE__*/ new THREE.Matrix4();
const _matrixWorldInv = /*@__PURE__*/ new THREE.Matrix4();


class CustomSkeletonHelper extends DashedObject {

    constructor(object, color1 = 0x0000ff, color2 = 0x00ff00, dashLength = 100) {

        const bones = getBoneList(object);
        color1 = new THREE.Color(color1)
        color2 = new THREE.Color(color2)

        const geometry = new THREE.BufferGeometry();

        const vertices = [];
        const colors = [];

        for (let i = 0; i < bones.length; i++) {

            const bone = bones[i];

            if (bone.parent && bone.parent.isBone) {

                vertices.push(0, 0, 0);
                vertices.push(0, 0, 0);
                colors.push(color1.r, color1.g, color1.b);
                colors.push(color2.r, color2.g, color2.b);

            }

        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        // const material = new THREE.LineBasicMaterial({ vertexColors: true, depthTest: false, depthWrite: false, toneMapped: false, transparent: true });

        super(geometry, dashLength, 0.1);

        this.type = 'SkeletonHelper';
        this.isSkeletonHelper = true;

        this.root = object;
        this.bones = bones;

        this.matrix = object.matrixWorld;
        this.matrixAutoUpdate = false;

    }

    updateMatrixWorld(force) {

        const bones = this.bones;

        const geometry = this.geometry;
        const position = geometry.getAttribute('position');

        _matrixWorldInv.copy(this.root.matrixWorld).invert();

        for (let i = 0, j = 0; i < bones.length; i++) {

            const bone = bones[i];

            if (bone.parent && bone.parent.isBone) {

                _boneMatrix.multiplyMatrices(_matrixWorldInv, bone.matrixWorld);
                _vector.setFromMatrixPosition(_boneMatrix);
                position.setXYZ(j, _vector.x, _vector.y, _vector.z);

                _boneMatrix.multiplyMatrices(_matrixWorldInv, bone.parent.matrixWorld);
                _vector.setFromMatrixPosition(_boneMatrix);
                position.setXYZ(j + 1, _vector.x, _vector.y, _vector.z);

                j += 2;

            }

        }

        geometry.getAttribute('position').needsUpdate = true;

        super.updateMatrixWorld(force);

        super.computeLineDistances()

    }
}


function getBoneList(object) {

    const boneList = [];

    if (object.isBone === true) {

        boneList.push(object);

    }

    for (let i = 0; i < object.children.length; i++) {

        boneList.push.apply(boneList, getBoneList(object.children[i]));

    }

    return boneList;

}


export { CustomSkeletonHelper };
