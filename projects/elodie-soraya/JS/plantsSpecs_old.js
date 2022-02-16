var brightBlue = 0X0814ff;
var aqua = 0x7dd0ff;
var purple = 0x684aff;
var beige = 0xd4d4d4;
var orange = 0xffb914;
var brightGreen = 0xdbff0f;
var brightRed = 0xff1900;
var middleOrange = 0xff4d00;
var turquoise = 0x50ab80;
var pink = 0xFF6EB6;

const plantsSpecs = [
//plant1
    {
    id:1,
    position: { x: 2.2, y: -1.6, z: 0.3 },
    scale:0.75,
    flip:false,
    color: purple,
    rotation: 0,
    filePath: "models/plant3.glb",
},
//plant2
{
    id:2,
    position: { x: 1.5, y: -1.6, z: 0.5 },
    scale:0.85,
    flip:true,
    color: brightRed,
    rotation: 0,
    filePath: "models/plant3.glb",
},
//plant3
{
    id:3,
    position: { x: 0.5, y: -1.6, z: 0.4},
    scale:0.7,
    flip:true,
    color: turquoise,
    rotation: 0,
    filePath: "models/plant2.glb",
},
//plant4
{
    id:4,
    position: { x: 0.3, y: -1.5, z: 0.2},
    scale:0.6,
    flip:false,
    color: brightGreen,
    rotation: 0,
    filePath: "models/plant2.glb",
},
//plant5
{
    id:5,
    position: { x: -0.7, y: -1.7, z: 0.4},
    scale:0.75,
    flip:true,
    color:orange,
    rotation: 0,
    filePath: "models/plant5.glb",
},
//plant6
{
    id:6,
    position: { x: -1.2, y: -1.5, z: 0.7},
    scale:0.95,
    flip:true,
    color: middleOrange,
    rotation: 0,
    filePath: "models/plant3.glb",
},  
//plant7
{
    id:7,
    position: { x: -2, y: -1.5, z: 0.3 },
    scale:0.75,
    flip:false,
    color: aqua,
    rotation: 0,
    filePath: "models/plant3.glb",
},
//plant8
{
    id:8,
    position: { x: 2.2, y: -0.1, z: 1.3},
    scale:0.9,
    flip:false,
    color: aqua,
    rotation: 0,
    filePath: "models/plant5.glb",
},   
//plant9
{
    id:9,
    position: { x: 1.2, y: -0.1, z: 1.7},
    scale:0.9,
    flip:false,
    color: pink,
    rotation: 0,
    filePath: "models/plant2.glb",
},
//plant10
{
    id:10,
    position: { x: 0, y: 0.2, z: 1.2},
    scale:1,
    flip:true,
    color: brightBlue,
    rotation: 0,
    filePath: "models/plant4.glb",
}, 
//plant11
{
    id:11,
    position: { x: -1.4, y: 1, z: 2.5},
    scale:1,
    flip:false,
    color:beige,
    rotation: 0,
    filePath: "models/plant1.glb",
}, 
//plant12
{
    id:12,
    position: { x: -2.2, y: -0.1, z: 0.8},
    scale:0.95,
    flip:false,
    color: brightGreen,
    rotation: 0,
    filePath: "models/plant4.glb",
}, 
//plant13
{
    id:13,
    position: { x: 2, y: 1, z: 2.5},
    scale:1,
    flip:false,
    color: brightGreen,
    rotation: 0,
    filePath: "models/plant6.glb",
}, 
//plant14
{
    id:14,
    position: { x: 0.5, y: -1, z: 4},
    scale:1.7,
    flip:true,
    color: orange,
    rotation: 0,
    filePath: "models/plant6.glb",
}, 
//plant15
{
    id:15,
    position: { x: -1.7, y: 0.2, z: 3},
    scale:1.2,
    flip:true,
    color: turquoise,
    rotation:0,
    filePath: "models/plant5.glb",
}, 
//plant16
{
    id:16,
    position: { x: 1.6, y: 0.3, z: 6},
    scale:1.5,
    flip:false,
    color: beige,
    rotation: 0,
    filePath: "models/plant5.glb",
}, 
//plant17
{
    id:17,
    position: { x: -1.5, y: 0.3, z: 6},
    scale:1.4,
    flip:true,
    color: purple,
    rotation: 0,
    filePath: "models/plant2.glb",
}, 
//plant18
{
    id:18,
    position: { x: 1.3, y: 3.6, z: 7},
    scale:1.2,
    flip:true,
    color: brightRed,
    rotation: 0,
    filePath: "models/plant1.glb",
},
//plant19
{
    id:19,
    position: { x: -1.55, y: -0.25, z: 7},
    scale:2,
    flip:false,
    color: pink,
    rotation: 0,
    filePath: "models/plant6.glb",
},
//plant20
{
    id:20,
    position: { x: 2.5, y: 4, z: 8},
    scale:1.3,
    flip:true,
    color: middleOrange,
    rotation: 0,
    filePath: "models/plant4.glb",
},  
//plant21
{
    id:21,
    position: { x:0.8, y: 2.5, z: 9},
    scale:1.7,
    flip:true,
    color: aqua,
    rotation:0,
    filePath: "models/plant5.glb",
}, 
//plant22
{
    id:22,
    position: { x: -1.6, y: -0.1, z: 8.5},
    scale:2,
    flip:false,
    color: brightGreen,
    rotation: 0,
    filePath: "models/plant2.glb",
}, 
//plant23
{
    id:23,
    position: { x: 2.2, y: 3.7, z: 9},
    scale:1.7,
    flip:true,
    color: turquoise,
    rotation: 0,
    filePath: "models/plant2.glb",
}, 
//plant24
{
    id:24,
    position: { x: 1.2, y: 4, z: 10},
    scale:1.7,
    flip:false,
    color: brightGreen,
    rotation: 0,
    filePath: "models/plant6.glb",
}, 
//plant25
{
    id:25,
    position: { x: -2.1, y: 7.2, z: 9.5},
    scale:1.2,
    flip:false,
    color: purple,
    rotation: 0,
    filePath: "models/plant4.glb",
}, 
//plant26
{
    id:26,
    position: { x: 2.7, y: 10.6, z: 12.5},
    scale:1,
    flip:true,
    color:beige,
    rotation: 0,
    filePath: "models/plant1.glb",
}, 
//plant27
{
    id:27,
    position: { x: 1.1, y: 5, z: 11.5},
    scale:1.9,
    flip:false,
    color: brightBlue,
    rotation: 0,
    filePath: "models/plant3.glb",
},
//plant28
{
    id:28,
    position: { x:-0.8, y: 6.9, z: 12.5},
    scale:1.7,
    flip:true,
    color: brightRed,
    rotation: 0,
    filePath: "models/plant3.glb",
},
//plant29
{
    id:29,
    position: { x: -1.6, y:7.2, z: 12},
    scale:1.4,
    flip:true,
    color: orange,
    rotation: 0,
    filePath: "models/plant6.glb",
}, 
//plant30
{
    id:30,
    position: { x:-1.5, y: 5.6, z: 11},
    scale:1.7,
    flip:true,
    color: beige,
    rotation: 0,
    filePath: "models/plant5.glb",
}, 
]

export {plantsSpecs}