export default Object.freeze({
    density: 2,
    bloom: {
        exposure: 1,
        bloomStrength: 1.5,
        bloomThreshold: 0,
        bloomRadius: 0
    },
    models: {
        demo: {
            path: '/models/gltf/Xbot.glb',
            baseActions: {
                idle: { weight: 1 },
                walk: { weight: 0 },
                run: { weight: 0 }
            },
            additiveActions: {
                sneak_pose: { weight: 0 },
                sad_pose: { weight: 0 },
                agree: { weight: 0 },
                headShake: { weight: 0 }
            }
        },
        simple: {
            path: '/models/gltf/human-backflip+idle.glb',
            // path: '/models/gltf/human-backflip-9.glb',

        }
    }
})