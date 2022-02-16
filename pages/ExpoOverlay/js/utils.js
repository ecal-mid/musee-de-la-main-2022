export function boneLookAt(bone, position) {
    var target = new THREE.Vector3(
        position.x - bone.matrixWorld.elements[12],
        position.y - bone.matrixWorld.elements[13],
        position.z - bone.matrixWorld.elements[14]
    ).normalize();
    var v = new THREE.Vector3(0, 0, 1);
    var q = new THREE.Quaternion().setFromUnitVectors(v, target);
    var tmp = q.z;
    q.z = -q.y;
    q.y = tmp;
    bone.quaternion.copy(q);
}

//* https://discourse.threejs.org/t/need-help-figuring-out-bone-rotations-please-help/29059/5

export function boneLookAtWorld(scene, bone, vector3) {
    const { parent } = bone;
    scene.attach(bone)
    boneLookAtLocal(bone, vector3)
    parent.attach(bone)
}

export function boneLookAtLocal(bone, position) {
    bone.updateMatrixWorld()
    let direction = position.clone().normalize()
    let pitch = Math.asin(direction.y)// + bone.offset
    let yaw = Math.atan2(direction.x, direction.z); //Beware cos(pitch)==0, catch this exception!
    let roll = 0;
    bone.rotation.set(roll, yaw, pitch);

    // console.log(roll, yaw, pitch);
    // console.log(roll, THREE.MathUtils.radToDeg(yaw), THREE.MathUtils.radToDeg(pitch));
}