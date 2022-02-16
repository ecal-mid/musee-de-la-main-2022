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

//! CENTER ENDS HERE

//!LEFT BEGINS HERE
//plant31
{
    id:31,
    position: { x: 7.2, y: -1.6, z: 0.3 },
    scale:0.75,
    flip:false,
    color: purple,
    rotation: 0,
    filePath: "models/plant3.glb",
},
//plant32
{
    id:32,
    position: { x: 6.5, y: -1.6, z: 0.5 },
    scale:0.85,
    flip:true,
    color: brightRed,
    rotation: 0,
    filePath: "models/plant3.glb",
},
//plant33
{
    id:33,
    position: { x: 5.5, y: -1.6, z: 0.4},
    scale:0.7,
    flip:true,
    color: turquoise,
    rotation: 0,
    filePath: "models/plant2.glb",
},
//plant34
{
    id:34,
    position: { x: 5.3, y: -1.5, z: 0.2},
    scale:0.6,
    flip:false,
    color: brightGreen,
    rotation: 0,
    filePath: "models/plant2.glb",
},
//plant35
{
    id:35,
    position: { x: 5.7, y: -1.7, z: 0.4},
    scale:0.75,
    flip:true,
    color:orange,
    rotation: 0,
    filePath: "models/plant5.glb",
},
//plant36
{
    id:36,
    position: { x: 4.2, y: -1.5, z: 0.7},
    scale:0.95,
    flip:true,
    color: middleOrange,
    rotation: 0,
    filePath: "models/plant3.glb",
},  
//plant37
{
    id:37,
    position: { x: 3.5, y: -1.5, z: 0. },
    scale:0.75,
    flip:false,
    color: orange,
    rotation: 0,
    filePath: "models/plant3.glb",
},
//plant38
{
    id:38,
    position: { x: 7.2, y: -0.1, z: 1.3},
    scale:0.9,
    flip:false,
    color: aqua,
    rotation: 0,
    filePath: "models/plant5.glb",
},   
//plant39
{
    id:39,
    position: { x: 6.2, y: -0.1, z: 1.7},
    scale:0.9,
    flip:false,
    color: pink,
    rotation: 0,
    filePath: "models/plant2.glb",
},
//plant40
{
    id:40,
    position: { x: 5, y: 0.2, z: 1.2},
    scale:1,
    flip:true,
    color: brightRed,
    rotation: 0,
    filePath: "models/plant4.glb",
}, 
//plant41
{
    id:41,
    position: { x: 4.4, y: 1, z: 2.5},
    scale:1,
    flip:false,
    color:beige,
    rotation: 0,
    filePath: "models/plant1.glb",
}, 
//plant42
{
    id:42,
    position: { x: 3.2, y: -0.1, z: 0.8},
    scale:0.95,
    flip:false,
    color: brightGreen,
    rotation: 0,
    filePath: "models/plant4.glb",
}, 
//plant43
{
    id:43,
    position: { x: 7, y: 1, z: 2.5},
    scale:1,
    flip:false,
    color: brightGreen,
    rotation: 0,
    filePath: "models/plant6.glb",
}, 
//plant44
{
    id:44,
    position: { x: 5.5, y: -1, z: 4},
    scale:1.7,
    flip:true,
    color: orange,
    rotation: 0,
    filePath: "models/plant6.glb",
}, 
//plant45
{
    id:45,
    position: { x: 4.7, y: 0.2, z: 3},
    scale:1.2,
    flip:true,
    color: turquoise,
    rotation:0,
    filePath: "models/plant5.glb",
}, 
//plant46
{
    id:46,
    position: { x: 6.6, y: 0.3, z: 6},
    scale:1.5,
    flip:false,
    color: beige,
    rotation: 0,
    filePath: "models/plant5.glb",
}, 
//plant47
{
    id:47,
    position: { x: 4.5, y: 0.3, z: 6},
    scale:1.4,
    flip:true,
    color: purple,
    rotation: 0,
    filePath: "models/plant2.glb",
}, 
//plant48
{
    id:48,
    position: { x: 6.3, y: 3.6, z: 7},
    scale:1.2,
    flip:true,
    color: middleOrange,
    rotation: 0,
    filePath: "models/plant1.glb",
},
//plant49
{
    id:49,
    position: { x: 4.55, y: -0.25, z: 7},
    scale:2,
    flip:false,
    color: brightBlue,
    rotation: 0,
    filePath: "models/plant6.glb",
},
//plant50
{
    id:50,
    position: { x: 7.5, y: 4, z: 8},
    scale:1.3,
    flip:true,
    color: purple,
    rotation: 0,
    filePath: "models/plant4.glb",
},  
//plant51
{
    id:51,
    position: { x:5.8, y: 2.5, z: 9},
    scale:1.7,
    flip:true,
    color: aqua,
    rotation:0,
    filePath: "models/plant5.glb",
}, 
//plant52
{
    id:52,
    position: { x: 4.6, y: -0.1, z: 8.5},
    scale:2,
    flip:false,
    color: brightGreen,
    rotation: 0,
    filePath: "models/plant2.glb",
}, 
//plant53
{
    id:53,
    position: { x: 7.2, y: 3.7, z: 9},
    scale:1.7,
    flip:true,
    color: turquoise,
    rotation: 0,
    filePath: "models/plant2.glb",
}, 
//plant54
{
    id:54,
    position: { x: 6.2, y: 4, z: 10},
    scale:1.7,
    flip:false,
    color: brightGreen,
    rotation: 0,
    filePath: "models/plant6.glb",
}, 
//plant55
{
    id:55,
    position: { x: 3.1, y: 7.2, z: 9.5},
    scale:1.2,
    flip:false,
    color: purple,
    rotation: 0,
    filePath: "models/plant4.glb",
}, 
//plant56
{
    id:56,
    position: { x: 7.7, y: 10.6, z: 12.5},
    scale:1,
    flip:true,
    color:beige,
    rotation: 0,
    filePath: "models/plant1.glb",
}, 
//plant57
{
    id:57,
    position: { x: 6.1, y: 5, z: 11.5},
    scale:1.9,
    flip:false,
    color: pink,
    rotation: 0,
    filePath: "models/plant3.glb",
},
//plant58
{
    id:58,
    position: { x:5.8, y: 6.9, z: 12.5},
    scale:1.7,
    flip:true,
    color: middleOrange,
    rotation: 0,
    filePath: "models/plant3.glb",
},
//plant59
{
    id:59,
    position: { x: 4.6, y:7.2, z: 12},
    scale:1.4,
    flip:true,
    color: orange,
    rotation: 0,
    filePath: "models/plant6.glb",
}, 
//plant60
{
    id:60,
    position: { x:4.5, y: 5.6, z: 11},
    scale:1.7,
    flip:true,
    color: beige,
    rotation: 0,
    filePath: "models/plant5.glb",
}, 
//!LEFT ENDS HERE

//!RIGHT BEGINS HERE
//plant61
{
    id:61,
    position: { x: -3.2, y: -1.6, z: 0.3 },
    scale:0.75,
    flip:false,
    color: turquoise,
    rotation: 0,
    filePath: "models/plant3.glb",
},
//plant62
{
    id:62,
    position: { x: -4.5, y: -1.6, z: 0.5 },
    scale:0.85,
    flip:true,
    color: brightRed,
    rotation: 0,
    filePath: "models/plant3.glb",
},
//plant63
{
    id:63,
    position: { x: -5.5, y: -1.6, z: 0.4},
    scale:0.7,
    flip:true,
    color: turquoise,
    rotation: 0,
    filePath: "models/plant2.glb",
},
//plant64
{
    id:64,
    position: { x: -5.3, y: -1.5, z: 0.2},
    scale:0.6,
    flip:false,
    color: brightGreen,
    rotation: 0,
    filePath: "models/plant2.glb",
},
//plant65
{
    id:65,
    position: { x: -5.7, y: -1.7, z: 0.4},
    scale:0.75,
    flip:true,
    color:orange,
    rotation: 0,
    filePath: "models/plant5.glb",
},
//plant66
{
    id:66,
    position: { x: -6.2, y: -1.5, z: 0.7},
    scale:0.95,
    flip:true,
    color: aqua,
    rotation: 0,
    filePath: "models/plant3.glb",
},  
//plant67
{
    id:67,
    position: { x: -7, y: -1.5, z: 0.3 },
    scale:0.75,
    flip:false,
    color: aqua,
    rotation: 0,
    filePath: "models/plant3.glb",
},
//plant68
{
    id:68,
    position: { x: -3.2, y: -0.1, z: 1.3},
    scale:0.9,
    flip:false,
    color: purple,
    rotation: 0,
    filePath: "models/plant5.glb",
},   
//plant69
{
    id:69,
    position: { x: -4.2, y: -0.1, z: 1.7},
    scale:0.9,
    flip:false,
    color: brightBlue,
    rotation: 0,
    filePath: "models/plant2.glb",
},
//plant70
{
    id:70,
    position: { x: -5, y: 0.2, z: 1.2},
    scale:1,
    flip:true,
    color: pink,
    rotation: 0,
    filePath: "models/plant4.glb",
}, 
//plant71
{
    id:71,
    position: { x: -6.4, y: 1, z: 2.5},
    scale:1,
    flip:false,
    color:beige,
    rotation: 0,
    filePath: "models/plant1.glb",
}, 
//plant72
{
    id:72,
    position: { x: -7.2, y: -0.1, z: 0.8},
    scale:0.95,
    flip:false,
    color: brightGreen,
    rotation: 0,
    filePath: "models/plant4.glb",
}, 
//plant73
{
    id:73,
    position: { x: -3, y: 1, z: 2.5},
    scale:1,
    flip:false,
    color: brightGreen,
    rotation: 0,
    filePath: "models/plant6.glb",
}, 
//plant74
{
    id:74,
    position: { x: -5.5, y: -1, z: 4},
    scale:1.7,
    flip:true,
    color: orange,
    rotation: 0,
    filePath: "models/plant6.glb",
}, 
//plant75
{
    id:75,
    position: { x: -6.7, y: 0.2, z: 3},
    scale:1.2,
    flip:true,
    color: turquoise,
    rotation:0,
    filePath: "models/plant5.glb",
}, 
//plant76
{
    id:76,
    position: { x: -4.6, y: 0.3, z: 8},
    scale:1.5,
    flip:false,
    color: beige,
    rotation: 0,
    filePath: "models/plant5.glb",
}, 
//plant77
{
    id:77,
    position: { x: -6.5, y: 0.3, z: 6},
    scale:1.4,
    flip:true,
    color: purple,
    rotation: 0,
    filePath: "models/plant2.glb",
}, 
//plant78
{
    id:78,
    position: { x: -4.3, y: 3.4, z: 8},
    scale:1.3,
    flip:true,
    color: brightBlue,
    rotation: 0,
    filePath: "models/plant1.glb",
},
//plant79
{
    id:79,
    position: { x: -6.55, y: -0.25, z: 7},
    scale:2,
    flip:false,
    color: brightRed,
    rotation: 0,
    filePath: "models/plant6.glb",
},
//plant80
{
    id:80,
    position: { x: -3.5, y: 4, z: 8},
    scale:1.3,
    flip:true,
    color: middleOrange,
    rotation: 0,
    filePath: "models/plant4.glb",
},  
//plant81
{
    id:81,
    position: { x:-5.8, y: 2.5, z: 9},
    scale:1.7,
    flip:true,
    color: aqua,
    rotation:0,
    filePath: "models/plant5.glb",
}, 
//plant82
{
    id:82,
    position: { x: -6.6, y: -0.1, z: 8.5},
    scale:2,
    flip:false,
    color: pink,
    rotation: 0,
    filePath: "models/plant2.glb",
}, 
//plant83
{
    id:83,
    position: { x: -3.2, y: 3.7, z: 9},
    scale:1.7,
    flip:true,
    color: turquoise,
    rotation: 0,
    filePath: "models/plant2.glb",
}, 
//plant84
{
    id:84,
    position: { x: -4.2, y: 4, z: 10},
    scale:1.7,
    flip:false,
    color: pink,
    rotation: 0,
    filePath: "models/plant6.glb",
}, 
//plant85
{
    id:85,
    position: { x: -7.1, y: 7.2, z: 9.5},
    scale:1.2,
    flip:false,
    color: purple,
    rotation: 0,
    filePath: "models/plant4.glb",
}, 
//plant86
{
    id:86,
    position: { x: -3.7, y: 10.6, z: 12.5},
    scale:1,
    flip:true,
    color:beige,
    rotation: 0,
    filePath: "models/plant1.glb",
}, 
//plant87
{
    id:87,
    position: { x: -4.1, y: 5, z: 11.5},
    scale:1.9,
    flip:false,
    color: brightGreen,
    rotation: 0,
    filePath: "models/plant3.glb",
},
//plant88
{
    id:88,
    position: { x:-5.8, y: 6.9, z: 12.5},
    scale:1.7,
    flip:true,
    color: brightBlue,
    rotation: 0,
    filePath: "models/plant3.glb",
},
//plant89
{
    id:89,
    position: { x: -6.6, y:7.2, z: 12},
    scale:1.4,
    flip:true,
    color: orange,
    rotation: 0,
    filePath: "models/plant6.glb",
}, 
//plant90
{
    id:90,
    position: { x:-6.5, y: 5.6, z: 11},
    scale:1.7,
    flip:true,
    color: beige,
    rotation: 0,
    filePath: "models/plant5.glb",
},

//! TOP BAND MIDDLE
{
    id:91,
    position: { x:0.8, y: 2.5, z: 9},
    scale:1.7,
    flip:true,
    color: aqua,
    rotation:0,
    filePath: "models/plant5.glb",
}, 
//plant92
{
    id:92,
    position: { x: -1.6, y: 7.1, z: 14.5},
    scale:2,
    flip:false,
    color: pink,
    rotation: 0,
    filePath: "models/plant2.glb",
}, 
//plant93
{
    id:93,
    position: { x: 2.2, y: 9, z: 16},
    scale:1.7,
    flip:true,
    color: pink,
    rotation: 0,
    filePath: "models/plant2.glb",
}, 
//plant94
{
    id:94,
    position: { x: 1, y: 9, z: 15},
    scale:1.7,
    flip:false,
    color: middleOrange,
    rotation: 0,
    filePath: "models/plant6.glb",
}, 
//95
{
    id:95,
    position: { x: -1, y: 9, z: 15},
    scale:1.7,
    flip:false,
    color: beige,
    rotation: 0,
    filePath: "models/plant5.glb",
},
//96
 {
    id:96,
    position: { x: 1.1, y: 10, z: 17.5},
    scale:1.9,
    flip:false,
    color: purple,
    rotation: 0,
    filePath: "models/plant3.glb",
},
//plant97
{
    id:97,
    position: { x:-1.3, y: 10.5, z: 18.5},
    scale:1.7,
    flip:true,
    color: orange,
    rotation: 0,
    filePath: "models/plant3.glb",
},
//! TOP BAND RIGHT
{
    id:91,
    position: { x:-6.8, y: 2.5, z: 9},
    scale:1.7,
    flip:true,
    color: aqua,
    rotation:0,
    filePath: "models/plant5.glb",
}, 
//plant92
{
    id:92,
    position: { x: -7.6, y: 7.1, z: 14.5},
    scale:2,
    flip:false,
    color: brightGreen,
    rotation: 0,
    filePath: "models/plant2.glb",
}, 
//plant93
{
    id:93,
    position: { x: -4.2, y: 9, z: 16},
    scale:1.7,
    flip:true,
    color: aqua,
    rotation: 0,
    filePath: "models/plant2.glb",
}, 
//plant94
{
    id:94,
    position: { x: -5, y: 9, z: 15},
    scale:1.7,
    flip:false,
    color: orange,
    rotation: 0,
    filePath: "models/plant6.glb",
}, 
//95
{
    id:95,
    position: { x: -7, y: 9, z: 15},
    scale:1.7,
    flip:false,
    color: beige,
    rotation: 0,
    filePath: "models/plant5.glb",
},
//96
 {
    id:96,
    position: { x:-5.1, y: 10, z: 17.5},
    scale:1.9,
    flip:false,
    color: purple,
    rotation: 0,
    filePath: "models/plant3.glb",
},
//plant97
{
    id:97,
    position: { x:-7.5, y: 10.5, z: 18.5},
    scale:1.7,
    flip:true,
    color: turquoise,
    rotation: 0,
    filePath: "models/plant3.glb",
},
//! TOP BAND LEFT
{
    id:98,
    position: { x:6.8, y: 2.5, z: 9},
    scale:1.7,
    flip:true,
    color: aqua,
    rotation:0,
    filePath: "models/plant5.glb",
}, 
//plant92
{
    id:99,
    position: { x: 4.1, y: 10.5, z: 14.5},
    scale:1.4,
    flip:false,
    color: brightGreen,
    rotation: 0,
    filePath: "models/plant4.glb",
}, 
//100
{
    id:100,
    position: { x: 8.5, y: 9, z: 16},
    scale:1.7,
    flip:true,
    color: brightBlue,
    rotation: 0,
    filePath: "models/plant4.glb",
}, 
//101
{
    id:101,
    position: { x: 7, y: 9, z: 15},
    scale:1.7,
    flip:false,
    color: brightRed,
    rotation: 0,
    filePath: "models/plant6.glb",
}, 
//102
{
    id:102,
    position: { x: 5, y: 9, z: 15},
    scale:1.7,
    flip:false,
    color: beige,
    rotation: 0,
    filePath: "models/plant5.glb",
},
//103
 {
    id:103,
    position: { x: 7.1, y: 10, z: 17.5},
    scale:1.9,
    flip:false,
    color: purple,
    rotation: 0,
    filePath: "models/plant3.glb",
},
//plant104
{
    id:104,
    position: { x:6.3, y: 10.5, z: 18.5},
    scale:1.7,
    flip:true,
    color: orange,
    rotation: 0,
    filePath: "models/plant3.glb",
},
]

export {plantsSpecs}